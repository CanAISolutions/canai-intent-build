
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Download, RefreshCw, Edit3, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DeliverableData {
  id: string;
  content: string;
  productType: 'BUSINESS_BUILDER' | 'SOCIAL_EMAIL' | 'SITE_AUDIT';
  promptId: string;
  generatedAt: string;
  revisionCount: number;
  emotionalResonance?: {
    arousal: number;
    valence: number;
    score: number;
  };
}

const DeliverableGeneration: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [deliverable, setDeliverable] = useState<DeliverableData | null>(null);
  const [revisionText, setRevisionText] = useState('');
  const [isRevising, setIsRevising] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationCount, setRegenerationCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [timeoutError, setTimeoutError] = useState(false);

  const productType = searchParams.get('type') as 'BUSINESS_BUILDER' | 'SOCIAL_EMAIL' | 'SITE_AUDIT' || 'BUSINESS_BUILDER';
  const promptId = searchParams.get('promptId') || 'demo-prompt-id';

  // Sprinkle Haven Bakery example data
  const exampleData = {
    businessName: "Sprinkle Haven Bakery",
    targetAudience: "Local families and sweet treat enthusiasts",
    primaryGoal: "Launch community-focused bakery specializing in custom celebration cakes",
    currentChallenge: "Building brand awareness and establishing customer base",
    uniqueValue: "Artisanal ingredients with personalized cake design consultation",
    timeline: "6 months to grand opening",
    budget: "$15,000 startup capital",
    experience: "5 years professional baking, new to business ownership",
    location: "Downtown Springfield",
    competition: "2 chain bakeries, no artisanal options",
    resources: "Commercial kitchen lease secured, basic equipment acquired",
    vision: "Become the go-to celebration destination for meaningful moments"
  };

  useEffect(() => {
    // PostHog tracking
    console.log('PostHog: deliverable_generation_started', { 
      productType, 
      promptId,
      timestamp: new Date().toISOString() 
    });

    // Start generation process
    generateDeliverable();
  }, []);

  const generateDeliverable = async () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setTimeoutError(false);

    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    // Timeout handler (15 seconds)
    const timeoutTimer = setTimeout(() => {
      setTimeoutError(true);
      setIsGenerating(false);
      setError('Generation timed out');
      clearInterval(progressInterval);
    }, 15000);

    try {
      <!-- TODO: GET /v1/generation-status -->
      // Simulate API call - replace with actual endpoint
      const response = await fetch('/api/v1/generate-deliverable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('memberstack_token')}`
        },
        body: JSON.stringify({
          productType,
          promptId,
          inputData: exampleData
        })
      });

      if (!response.ok) {
        throw new Error('Generation failed');
      }

      const result = await response.json();
      
      // Hume AI emotional resonance validation
      const humeResponse = await validateEmotionalResonance(result.content);
      
      const deliverableData: DeliverableData = {
        id: result.id || `del-${Date.now()}`,
        content: getTemplateContent(productType),
        productType,
        promptId,
        generatedAt: new Date().toISOString(),
        revisionCount: 0,
        emotionalResonance: humeResponse
      };

      // Supabase: comparisons.canai_output
      await storeInSupabase(deliverableData);

      setDeliverable(deliverableData);
      setProgress(100);
      
      // PostHog tracking
      console.log('PostHog: deliverable_generated', {
        productType,
        promptId,
        deliverableId: deliverableData.id,
        emotionalResonance: humeResponse?.score,
        generationTime: Date.now() - startTime
      });

      // SAAP updates project status
      await updateProjectStatus(deliverableData.id, 'completed');

    } catch (error) {
      console.error('Generation error:', error);
      setError(error instanceof Error ? error.message : 'Generation failed');
    } finally {
      clearInterval(progressInterval);
      clearTimeout(timeoutTimer);
      setIsGenerating(false);
    }
  };

  const validateEmotionalResonance = async (content: string) => {
    try {
      // Hume AI validation (arousal >0.5, valence >0.6, weighted 0.4/0.6)
      const response = await fetch('/api/hume/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      
      const result = await response.json();
      const { arousal, valence } = result;
      const score = (arousal * 0.4) + (valence * 0.6);
      
      return {
        arousal,
        valence,
        score,
        isValid: arousal > 0.5 && valence > 0.6
      };
    } catch (error) {
      console.error('Hume AI validation failed:', error);
      return null;
    }
  };

  const storeInSupabase = async (data: DeliverableData) => {
    try {
      // Supabase: comparisons.canai_output
      const response = await fetch('/api/supabase/comparisons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_id: data.promptId,
          canai_output: data.content,
          trust_delta: data.emotionalResonance?.score || 0,
          emotional_resonance: data.emotionalResonance,
          created_at: data.generatedAt
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to store in Supabase');
      }
    } catch (error) {
      console.error('Supabase storage failed:', error);
    }
  };

  const updateProjectStatus = async (deliverableId: string, status: string) => {
    try {
      // SAAP updates project status
      await fetch('/api/make/update-project-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliverableId, status })
      });
    } catch (error) {
      console.error('Project status update failed:', error);
    }
  };

  const handleRevision = async () => {
    if (!revisionText.trim() || !deliverable) return;

    setIsRevising(true);
    
    try {
      <!-- TODO: POST /v1/request-revision -->
      const response = await fetch('/api/v1/request-revision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliverableId: deliverable.id,
          revisionRequest: revisionText
        })
      });

      if (!response.ok) {
        throw new Error('Revision request failed');
      }

      const result = await response.json();
      
      setDeliverable(prev => prev ? {
        ...prev,
        content: result.content,
        revisionCount: prev.revisionCount + 1
      } : null);

      setRevisionText('');
      
      // PostHog tracking
      console.log('PostHog: revision_requested', {
        deliverableId: deliverable.id,
        revisionCount: deliverable.revisionCount + 1,
        requestLength: revisionText.length
      });

      toast({
        title: "Revision Applied",
        description: "Your deliverable has been updated based on your feedback."
      });

    } catch (error) {
      console.error('Revision error:', error);
      toast({
        title: "Revision Failed",
        description: "Unable to process revision request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRevising(false);
    }
  };

  const handleRegenerate = async () => {
    if (regenerationCount >= 2) {
      toast({
        title: "Regeneration Limit Reached",
        description: "Maximum 2 regeneration attempts allowed per deliverable.",
        variant: "destructive"
      });
      return;
    }

    setIsRegenerating(true);
    
    try {
      <!-- TODO: POST /v1/regenerate-deliverable -->
      const response = await fetch('/api/v1/regenerate-deliverable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliverableId: deliverable?.id,
          attempt: regenerationCount + 1
        })
      });

      if (!response.ok) {
        throw new Error('Regeneration failed');
      }

      const result = await response.json();
      
      setDeliverable(prev => prev ? {
        ...prev,
        content: result.content,
        generatedAt: new Date().toISOString()
      } : null);

      setRegenerationCount(prev => prev + 1);

      toast({
        title: "Deliverable Regenerated",
        description: `New version generated (${regenerationCount + 1}/2 attempts used).`
      });

    } catch (error) {
      console.error('Regeneration error:', error);
      toast({
        title: "Regeneration Failed",
        description: "Unable to regenerate deliverable. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Make.com generates PDF (<1s download)
      const response = await fetch('/api/make/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliverableId: deliverable?.id,
          content: deliverable?.content,
          productType
        })
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${productType.toLowerCase()}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PDF Downloaded",
        description: "Your deliverable has been downloaded successfully."
      });

    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: "Download Failed",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getTemplateContent = (type: string): string => {
    switch (type) {
      case 'BUSINESS_BUILDER':
        return `# Sprinkle Haven Bakery Business Plan

## Executive Summary
Sprinkle Haven Bakery represents a unique opportunity to fill the artisanal celebration cake gap in downtown Springfield's market. With 5 years of professional baking experience and a clear vision for community-focused service, this venture is positioned to become the premier destination for meaningful celebrations.

## Market Analysis
Springfield currently hosts 2 chain bakeries but lacks artisanal options, creating a significant market opportunity. Our target demographic of local families and sweet treat enthusiasts represents an underserved segment seeking personalized, high-quality celebration cakes.

## Unique Value Proposition
Sprinkle Haven differentiates itself through artisanal ingredients combined with personalized cake design consultation. This approach transforms routine transactions into memorable experiences, building strong customer relationships and encouraging repeat business.

## Marketing Strategy
Our 6-month launch timeline focuses on building brand awareness through community engagement, social media presence, and strategic partnerships with local event planners. Initial marketing budget allocation emphasizes word-of-mouth growth and targeted digital advertising.

## Operations Plan
With a commercial kitchen lease secured and basic equipment acquired, operational foundations are established. The downtown Springfield location provides optimal foot traffic and accessibility for our target market.

## Competitive Advantage
While competitors focus on volume and convenience, Sprinkle Haven emphasizes craftsmanship and personalization. This positioning allows premium pricing while building customer loyalty through superior service and product quality.

## Financial Projections (100 words)
Startup capital of $15,000 covers initial inventory, marketing, and operational expenses. Projected break-even at month 8 with conservative estimates. Revenue streams include custom celebration cakes (70%), daily fresh items (20%), and catering services (10%). Monthly operating costs estimated at $4,200 including rent, ingredients, and utilities. Target first-year revenue of $85,000 with 15% net profit margin by year-end.

## Team Structure (50 words)
Founder brings 5 years professional baking experience with strong creative and customer service skills. Initial staffing includes part-time assistant for peak periods. Plans for additional decorator hire by month 12 based on demand growth and revenue targets.`;

      case 'SOCIAL_EMAIL':
        return `# Social Media & Email Campaign Package

## Social Media Posts (5 posts)

**Post 1 - Brand Introduction**
🧁 Welcome to Sprinkle Haven Bakery! Where every celebration deserves a masterpiece. Our artisanal approach to custom cakes turns your special moments into sweet memories. Opening soon in downtown Springfield! #SprinkleHaven #ArtisanalBaking #CustomCakes

**Post 2 - Behind the Scenes**
👩‍🍳 Meet our founder! With 5 years of professional baking experience, she's bringing her passion for personalized celebration cakes to Springfield. Every design consultation is a collaborative journey to create your perfect cake! #MeetTheTeam #BehindTheScenes

**Post 3 - Unique Value**
✨ What makes us different? Premium artisanal ingredients + personalized design consultation = unforgettable celebrations. No chain bakery can match our attention to detail and creative collaboration! #QualityMatters #PersonalizedService

**Post 4 - Community Focus**
🏘️ Sprinkle Haven isn't just a bakery - we're your celebration partners! From birthdays to weddings, graduations to anniversaries, we're here to make every moment sweeter. Springfield, we can't wait to be part of your stories! #CommunityFirst #Celebrations

**Post 5 - Grand Opening Announcement**
🎉 GRAND OPENING in 6 months! Follow our journey as we prepare to bring artisanal celebration cakes to downtown Springfield. Your sweet dreams are about to become reality! #GrandOpening #ComingSoon #SweetDreams

## Email Campaigns (4 emails)

**Email 1 - Welcome Series**
Subject: Welcome to the Sprinkle Haven Family! 🧁

Dear Celebration Enthusiast,

Thank you for joining the Sprinkle Haven community! We're thrilled to have you on this sweet journey with us.

At Sprinkle Haven, we believe every celebration deserves a masterpiece. Our founder's 5 years of professional baking experience, combined with our commitment to artisanal ingredients and personalized service, sets us apart from ordinary bakeries.

What to expect:
- Custom cake design consultations
- Premium artisanal ingredients
- Personalized service for your special moments
- Updates on our downtown Springfield opening

Stay tuned for exclusive previews, baking tips, and celebration inspiration!

Sweet regards,
The Sprinkle Haven Team

**Email 2 - Educational Content**
Subject: The Art of Custom Cake Design - A Behind-the-Scenes Look

Hello [Name],

Ever wondered what goes into creating the perfect celebration cake? Let us take you behind the scenes of our design process!

Our personalized consultation approach includes:
1. Understanding your celebration story
2. Exploring flavor preferences and dietary needs
3. Collaborative design sketching
4. Premium ingredient selection
5. Artisanal crafting with attention to detail

Unlike chain bakeries that offer limited customization, we treat each cake as a unique work of art that reflects your special moment.

Coming soon: Virtual design consultations for our Springfield community!

**Email 3 - Community Engagement**
Subject: Springfield, We Want to Hear from You! 🏘️

Dear Future Customer,

As we prepare for our downtown Springfield opening, we want to hear about your celebration dreams!

Share with us:
- Your most memorable cake experience
- Dream flavors you'd love to try
- Celebration traditions in your family
- What makes a bakery special to you

Your input helps us create the perfect Sprinkle Haven experience. Plus, early community members receive exclusive grand opening benefits!

Reply to this email or tag us on social media - we read every message!

**Email 4 - Grand Opening Announcement**
Subject: 🎉 6 Months to Sprinkle Haven's Grand Opening!

Dear Sprinkle Haven Family,

The countdown begins! In just 6 months, we'll open our doors in downtown Springfield, ready to make your celebrations extraordinary.

What we're preparing for you:
- Full custom cake design services
- Daily fresh artisanal treats
- Catering for special events
- The warmest, most welcoming bakery experience

Early supporters receive:
- 15% off your first custom order
- Priority booking for grand opening week
- Exclusive behind-the-scenes content
- First access to our signature flavors

Thank you for believing in our vision. We can't wait to be part of your sweetest moments!

With gratitude and excitement,
The Sprinkle Haven Team`;

      case 'SITE_AUDIT':
        return `# Website Audit Report: Sprinkle Haven Bakery

## Current State Analysis (300-400 words)

Upon comprehensive review of the Sprinkle Haven Bakery website, several critical areas require immediate attention to align with the business's artisanal positioning and community-focused mission.

**Navigation and User Experience**: The current navigation structure lacks clarity for users seeking custom cake consultations. The primary call-to-action for design consultations is buried in secondary navigation, reducing conversion potential. Users spend excessive time searching for contact information and service details.

**Visual Design and Branding**: While the color palette aligns with bakery aesthetics, the imagery fails to showcase the artisanal quality that differentiates Sprinkle Haven from chain competitors. Product photography lacks professional polish necessary to justify premium pricing. The logo and typography need refinement to convey craftsmanship and personalized service.

**Content Strategy**: Current content focuses heavily on products rather than the personalized experience and community connection that drives customer loyalty. The "About" section inadequately communicates the founder's 5-year professional background and unique consultation approach. Service descriptions lack emotional resonance and fail to address customer pain points.

**Technical Performance**: Page load speeds exceed 4 seconds, significantly impacting user engagement and search engine rankings. Mobile responsiveness issues affect 35% of traffic, crucial for local discovery. Contact forms exhibit functionality problems, potentially losing qualified leads.

**Local SEO and Discoverability**: The website lacks proper local SEO optimization for "downtown Springfield bakery" and related searches. Google My Business integration is incomplete, missing valuable local traffic opportunities. Social media integration requires enhancement to leverage community engagement.

**Conversion Optimization**: The booking flow for consultations involves too many steps, creating friction for potential customers. Trust signals such as testimonials, certifications, and process explanations are underutilized. Pricing transparency issues may deter potential clients.

## Strategic Recommendations (100-150 words)

**Immediate Actions**: Restructure navigation to prominently feature consultation booking. Implement professional product photography showcasing artisanal quality. Optimize page load speeds through image compression and code optimization. Fix mobile responsiveness issues affecting user experience.

**Content Overhaul**: Rewrite homepage copy to emphasize personalized consultation process and community connection. Develop founder story section highlighting professional experience and unique approach. Create service pages that emotionally connect with celebration moments rather than just listing offerings.

**Technical Improvements**: Implement local SEO optimization targeting Springfield-specific searches. Streamline consultation booking to single-page process. Add trust signals including customer testimonials, process explanations, and quality certifications.

**Long-term Strategy**: Develop content marketing strategy featuring celebration inspiration and behind-the-scenes content. Implement email capture system for community building. Create social proof system showcasing completed projects and customer stories.

These improvements will position Sprinkle Haven as the premium artisanal choice in Springfield's market while driving measurable increases in consultation bookings and customer engagement.`;

      default:
        return 'Content generation failed. Please try again.';
    }
  };

  if (timeoutError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-canai-primary-blue-dark via-canai-primary-blue to-canai-primary p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="error-fallback bg-red-500/20 border border-red-500/40 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Generation Timed Out</h2>
            <p className="text-red-200 mb-6">
              The deliverable generation process took longer than expected. Please try again.
            </p>
            <Button onClick={() => window.location.reload()} variant="canai">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-canai-primary-blue-dark via-canai-primary-blue to-canai-primary p-4">
      <div className="max-w-4xl mx-auto pt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {productType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} Generation
          </h1>
          <p className="text-canai-light">
            Creating your personalized {productType.toLowerCase().replace('_', ' ')} deliverable
          </p>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <Card className="bg-canai-blue-card/90 border-canai-primary/40 mb-8">
            <CardHeader>
              <CardTitle className="text-canai-light flex items-center gap-3">
                <Clock className="w-6 h-6 text-canai-primary animate-spin" />
                Generating Your Deliverable...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="mb-4" />
              <p className="text-canai-light-soft">
                Our AI is crafting your personalized content using advanced emotional resonance analysis...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Generated Deliverable */}
        {deliverable && !isGenerating && (
          <div className="space-y-6">
            {/* Deliverable Content */}
            <Card className="bg-canai-blue-card/90 border-canai-primary/40">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-canai-light flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  Your {productType.replace('_', ' ')} Deliverable
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    id="regenerate-btn"
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isRegenerating || regenerationCount >= 2}
                    className="border-canai-primary text-canai-light hover:bg-canai-primary/20"
                  >
                    <RefreshCw className={`w-4 h-4 mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
                    Regenerate ({regenerationCount}/2)
                  </Button>
                  <Button
                    variant="canai"
                    size="sm"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Emotional Resonance Score */}
                {deliverable.emotionalResonance && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-400/30">
                    <div className="flex items-center justify-between">
                      <span className="text-green-300 font-medium">Emotional Resonance Score</span>
                      <span className="text-2xl font-bold text-green-400">
                        {(deliverable.emotionalResonance.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-sm text-green-200 mt-1">
                      Arousal: {deliverable.emotionalResonance.arousal.toFixed(2)} | 
                      Valence: {deliverable.emotionalResonance.valence.toFixed(2)}
                    </div>
                  </div>
                )}

                {/* Content Display */}
                <div className="bg-white/10 rounded-lg p-6 font-mono text-sm text-white whitespace-pre-wrap">
                  {deliverable.content}
                </div>

                {/* Branding Note */}
                <div id="branding-note" className="mt-4 p-3 bg-amber-500/20 border border-amber-500/40 rounded-lg">
                  <p className="text-amber-200 text-sm">
                    <strong>Note:</strong> CanAI excludes branding elements (e.g., logos, specific brand assets). 
                    Contact us for partnership opportunities and branded deliverables.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Revision Request */}
            <Card className="bg-canai-blue-card/90 border-canai-primary/40">
              <CardHeader>
                <CardTitle className="text-canai-light flex items-center gap-3">
                  <Edit3 className="w-6 h-6 text-canai-primary" />
                  Request Revision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="revision-input"
                  placeholder="Describe what you'd like to change or improve in your deliverable..."
                  value={revisionText}
                  onChange={(e) => setRevisionText(e.target.value)}
                  className="mb-4 bg-white/10 border-canai-primary/30 text-white"
                  rows={4}
                />
                <Button
                  id="revision-btn"
                  variant="canai"
                  onClick={handleRevision}
                  disabled={!revisionText.trim() || isRevising}
                  className="w-full"
                >
                  {isRevising ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Processing Revision...
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Apply Revision
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Deliverable Metadata */}
            <Card className="bg-canai-blue-card/90 border-canai-primary/40">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-canai-primary font-bold text-lg">
                      {deliverable.revisionCount}
                    </div>
                    <div className="text-canai-light-soft text-sm">Revisions</div>
                  </div>
                  <div>
                    <div className="text-canai-primary font-bold text-lg">
                      {regenerationCount}/2
                    </div>
                    <div className="text-canai-light-soft text-sm">Regenerations</div>
                  </div>
                  <div>
                    <div className="text-canai-primary font-bold text-lg">
                      {deliverable.content.split(' ').length}
                    </div>
                    <div className="text-canai-light-soft text-sm">Words</div>
                  </div>
                  <div>
                    <div className="text-canai-primary font-bold text-lg">
                      {new Date(deliverable.generatedAt).toLocaleTimeString()}
                    </div>
                    <div className="text-canai-light-soft text-sm">Generated</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Display */}
        {error && !timeoutError && (
          <Card className="bg-red-500/20 border-red-500/40">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-red-200">
                <AlertCircle className="w-6 h-6" />
                <div>
                  <p className="font-medium">Generation Error</p>
                  <p className="text-sm opacity-75">{error}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={generateDeliverable}
                className="mt-4 border-red-400 text-red-200 hover:bg-red-500/20"
              >
                Retry Generation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DeliverableGeneration;
