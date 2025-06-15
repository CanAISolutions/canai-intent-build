import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Download, RefreshCw, Edit3, FileText, Clock, CheckCircle, AlertCircle, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import StandardBackground from '@/components/StandardBackground';
import StandardCard from '@/components/StandardCard';
import PageHeader from '@/components/PageHeader';
import { PageTitle, SectionTitle, CardTitle, BodyText, CaptionText } from '@/components/StandardTypography';

interface DeliverableData {
  id: string;
  content: string;
  productType: 'BUSINESS_BUILDER' | 'SOCIAL_EMAIL' | 'SITE_AUDIT';
  promptId: string;
  generatedAt: string;
  revisionCount: number;
  pdfUrl?: string;
  emotionalResonance?: {
    canaiScore: number;
    genericScore: number;
    delta: number;
    arousal: number;
    valence: number;
    isValid: boolean;
  };
}

interface GenerationProgress {
  step: string;
  message: string;
  progress: number;
}

const DeliverableGeneration: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isGenerating, setIsGenerating] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<GenerationProgress>({
    step: 'analyzing',
    message: 'Analyzing your inputs...',
    progress: 10
  });
  const [deliverable, setDeliverable] = useState<DeliverableData | null>(null);
  const [revisionText, setRevisionText] = useState('');
  const [isRevising, setIsRevising] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerationCount, setRegenerationCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [timeoutError, setTimeoutError] = useState(false);
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const productType = searchParams.get('type') as 'BUSINESS_BUILDER' | 'SOCIAL_EMAIL' | 'SITE_AUDIT' || 'BUSINESS_BUILDER';
  const promptId = searchParams.get('promptId') || 'demo-prompt-id';

  // Sprinkle Haven Bakery 12-field inputs from Intent Mirror
  const intentMirrorInputs = {
    businessName: "Sprinkle Haven Bakery",
    targetAudience: "Denver families",
    primaryGoal: "funding",
    competitiveContext: "Blue Moon Bakery",
    brandVoice: "warm",
    resourceConstraints: "$50k budget; team of 3; 6 months",
    currentStatus: "Planning phase",
    businessDescription: "Artisanal bakery offering organic pastries",
    revenueModel: "Sales, events",
    planPurpose: "investor",
    location: "Denver, CO",
    uniqueValue: "Organic, community-focused pastries"
  };

  const generationSteps: GenerationProgress[] = [
    { step: 'analyzing', message: 'Analyzing your inputs...', progress: 10 },
    { step: 'processing', message: 'Processing with GPT-4o...', progress: 30 },
    { step: 'validating', message: 'Validating emotional resonance with Hume AI...', progress: 60 },
    { step: 'formatting', message: 'Formatting deliverable...', progress: 80 },
    { step: 'finalizing', message: 'Finalizing and generating PDF...', progress: 95 },
    { step: 'complete', message: 'Generation complete!', progress: 100 }
  ];

  useEffect(() => {
    // PostHog tracking
    console.log('PostHog: deliverable_generation_started', { 
      product_type: productType.toLowerCase(),
      prompt_id: promptId,
      timestamp: new Date().toISOString() 
    });

    generateDeliverable();
  }, []);

  const generateDeliverable = async () => {
    setIsGenerating(true);
    setProgress(0);
    setError(null);
    setTimeoutError(false);
    setRetryAttempt(0);

    await performGenerationWithRetry();
  };

  const performGenerationWithRetry = async () => {
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      setRetryAttempt(attempt + 1);
      
      try {
        await performGeneration();
        return; // Success, exit retry loop
      } catch (error) {
        console.error(`Generation attempt ${attempt + 1} failed:`, error);
        
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // All retries failed
          setError('Generation failed after multiple attempts');
          setIsGenerating(false);
        }
      }
    }
  };

  const performGeneration = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      // Timeout handler (15 seconds)
      const timeoutTimer = setTimeout(() => {
        setTimeoutError(true);
        setIsGenerating(false);
        setError('Generation timed out');
        reject(new Error('Generation timed out'));
      }, 15000);

      try {
        // Step-by-step generation simulation
        for (const step of generationSteps) {
          setCurrentStep(step);
          setProgress(step.progress);
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        // TODO: POST /v1/generate-deliverable
        // Mock API call - replace with actual endpoint
        console.log('TODO: POST /v1/generate-deliverable', {
          prompt_id: promptId,
          product_type: productType,
          inputs: intentMirrorInputs
        });

        // Simulate GPT-4o generation
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Hume AI validation endpoint
        // Mock Hume AI emotional resonance validation
        console.log('TODO: POST /api/hume/validate-resonance');
        const humeResponse = {
          arousal: 0.7,
          valence: 0.8,
          canaiScore: 0.85,
          genericScore: 0.45,
          delta: 0.4,
          isValid: true // arousal > 0.5 && valence > 0.6
        };

        if (!humeResponse.isValid) {
          throw new Error('Emotional resonance validation failed');
        }

        // TODO: Make.com PDF generation
        console.log('TODO: Make.com PDF generation via webhook');
        const pdfUrl = `https://example.com/deliverables/${promptId}.pdf`;
        
        const deliverableData: DeliverableData = {
          id: `del-${Date.now()}`,
          content: getTemplateContent(productType),
          productType,
          promptId,
          generatedAt: new Date().toISOString(),
          revisionCount: 0,
          pdfUrl,
          emotionalResonance: humeResponse
        };

        // Supabase: Store in comparisons table
        console.log('Supabase: comparisons.canai_output', {
          prompt_id: promptId,
          canai_output: deliverableData.content,
          generic_output: getGenericContent(productType),
          pdf_url: pdfUrl,
          emotional_resonance: humeResponse
        });

        setDeliverable(deliverableData);
        
        // PostHog tracking
        console.log('PostHog: deliverable_generated', {
          product_type: productType.toLowerCase(),
          prompt_id: promptId,
          deliverable_id: deliverableData.id,
          emotional_resonance_score: humeResponse.canaiScore,
          completion_time_ms: 2000
        });

        // TODO: SAAP Update Project Blueprint.json
        console.log('SAAP: Updating project status to completed via Make.com');

        clearTimeout(timeoutTimer);
        setIsGenerating(false);
        resolve();

      } catch (error) {
        clearTimeout(timeoutTimer);
        reject(error);
      }
    });
  };

  const handleRevision = async () => {
    if (!revisionText.trim() || !deliverable) return;

    setIsRevising(true);
    
    try {
      // TODO: POST /v1/request-revision
      console.log('TODO: POST /v1/request-revision', {
        prompt_id: deliverable.promptId,
        feedback: revisionText
      });
      
      // Simulate revision processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock revised content
      const revisedContent = deliverable.content + `\n\n[REVISION APPLIED: ${revisionText}]\nContent has been updated to address your feedback with a ${intentMirrorInputs.brandVoice} tone.`;
      
      setDeliverable(prev => prev ? {
        ...prev,
        content: revisedContent,
        revisionCount: prev.revisionCount + 1,
        generatedAt: new Date().toISOString()
      } : null);

      setRevisionText('');
      
      // PostHog tracking
      console.log('PostHog: revision_requested', {
        deliverable_id: deliverable.id,
        reason: revisionText.substring(0, 50),
        revision_count: deliverable.revisionCount + 1
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
      // TODO: POST /v1/regenerate-deliverable
      console.log('TODO: POST /v1/regenerate-deliverable', {
        prompt_id: deliverable?.promptId,
        attempt_count: regenerationCount + 1
      });
      
      // Simulate regeneration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDeliverable(prev => prev ? {
        ...prev,
        content: getTemplateContent(productType),
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
      if (!deliverable?.pdfUrl) {
        throw new Error('PDF not available');
      }

      // TODO: GET /v1/generation-status to check PDF readiness
      console.log('TODO: GET /v1/generation-status');
      
      // Mock PDF download via Make.com
      console.log('Downloading PDF via Make.com:', deliverable.pdfUrl);
      
      // Simulate PDF download (<1s)
      const link = document.createElement('a');
      link.href = deliverable.pdfUrl;
      link.download = `${productType.toLowerCase()}-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${section} copied to clipboard.`
      });
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const formatContent = (content: string) => {
    const sections = content.split('\n\n## ');
    if (sections.length === 1) return content;

    return sections.map((section, index) => {
      if (index === 0) return section;
      
      const [title, ...contentLines] = section.split('\n');
      const sectionContent = contentLines.join('\n');
      const sectionId = title.toLowerCase().replace(/\s+/g, '-');
      const isExpanded = expandedSections[sectionId] ?? true;

      return (
        <div key={sectionId} className="border-b border-[#00CFFF]/20 pb-4 mb-4">
          <button
            onClick={() => toggleSection(sectionId)}
            className="flex items-center justify-between w-full text-left hover:text-[#00CFFF] transition-colors duration-200"
          >
            <CardTitle className="mb-2">## {title}</CardTitle>
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          {isExpanded && (
            <div className="relative group">
              <pre className="whitespace-pre-wrap text-[#E6F6FF]/90 leading-relaxed font-manrope">
                {sectionContent}
              </pre>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(`## ${title}\n${sectionContent}`, title)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-[#00CFFF]/10 hover:bg-[#00CFFF]/20"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      );
    });
  };

  const getTemplateContent = (type: string): string => {
    const { businessName, targetAudience, location, uniqueValue, resourceConstraints } = intentMirrorInputs;
    
    switch (type) {
      case 'BUSINESS_BUILDER':
        return `# ${businessName} Business Plan

## Executive Summary
${businessName} represents a unique opportunity to serve ${targetAudience} in ${location} with ${uniqueValue.toLowerCase()}. This investor-ready plan outlines our path to success with clear financial projections and operational strategy.

## Market Analysis
The ${location} market shows strong demand for artisanal bakery options, particularly among ${targetAudience}. Our competitive analysis against ${intentMirrorInputs.competitiveContext} reveals significant opportunities for differentiation through our ${uniqueValue.toLowerCase()}.

## Unique Value Proposition
${uniqueValue} sets us apart in a crowded marketplace. Our ${intentMirrorInputs.brandVoice} approach to customer service combined with premium organic ingredients creates an unmatched value proposition for ${targetAudience}.

## Marketing Strategy
Our go-to-market strategy focuses on building strong community relationships in ${location}. Digital marketing through social media and local partnerships will drive initial awareness, while word-of-mouth referrals will sustain long-term growth.

## Operations Plan
Located in ${location}, our operations are designed for efficiency and quality. ${resourceConstraints} provides the foundation for sustainable growth while maintaining our commitment to artisanal quality.

## Competitive Advantage
While ${intentMirrorInputs.competitiveContext} focuses on traditional approaches, ${businessName} differentiates through ${uniqueValue.toLowerCase()} and exceptional customer experience that resonates with ${targetAudience}.

## Financial Projections (100 words)
Based on ${resourceConstraints}, we project break-even at month 10 with conservative growth assumptions. Revenue streams include daily pastries (60%), custom orders (30%), and catering (10%). Initial investment of $50,000 covers equipment, inventory, and 6 months operating expenses. Projected first-year revenue of $180,000 with 18% net profit margin by month 12. Cash flow positive by month 8, with reinvestment focused on equipment upgrades and staff expansion. Conservative projections show 25% annual growth through year three, positioning for potential franchise opportunities.

## Team Structure (50 words)
Founder brings 8 years culinary experience with business management certification. Initial team of 3 includes head baker, customer service specialist, and part-time decorator. Planned expansion includes additional baker by month 6 and marketing coordinator by year 2, supporting projected growth while maintaining quality standards and ${intentMirrorInputs.brandVoice} culture.`;

      case 'SOCIAL_EMAIL':
        return `# Social Media & Email Campaign Package for ${businessName}

## Social Media Posts (5 posts, 240 words total)

**Post 1 - Brand Introduction (48 words)**
🧁 Welcome to ${businessName}! Bringing ${uniqueValue.toLowerCase()} to ${location}. Our ${intentMirrorInputs.brandVoice} approach to baking creates memorable experiences for ${targetAudience}. Opening soon - follow our journey! #${businessName.replace(/\s+/g, '')} #${location.replace(/\s+/g, '')} #OrganicBaking

**Post 2 - Behind the Scenes (46 words)**
👩‍🍳 Meet our passionate team! With years of experience in artisanal baking, we're dedicated to serving ${targetAudience} with the finest organic ingredients. Every pastry tells a story of craftsmanship and community connection. #BehindTheScenes #ArtisanalBaking #${location.replace(/\s+/g, '')}

**Post 3 - Unique Value (50 words)**
✨ What makes us special? ${uniqueValue} combined with our ${intentMirrorInputs.brandVoice} service philosophy. Unlike ${intentMirrorInputs.competitiveContext}, we focus on creating personal connections with every customer in ${location}. Quality ingredients, passionate baking, unforgettable taste! #QualityFirst #${businessName.replace(/\s+/g, '')}

**Post 4 - Community Focus (48 words)**
🏘️ ${businessName} isn't just a bakery - we're your ${location} neighbors! From birthday celebrations to corporate events, we're here to make every moment sweeter for ${targetAudience}. Community-focused, locally-sourced, globally-inspired. #CommunityFirst #${location.replace(/\s+/g, '')} #LocalBusiness

**Post 5 - Opening Announcement (48 words)**
🎉 Grand opening countdown begins! ${businessName} is almost ready to serve ${location} with ${uniqueValue.toLowerCase()}. Stay tuned for exclusive previews, opening specials, and behind-the-scenes content. Your sweet journey starts here! #GrandOpening #ComingSoon #${businessName.replace(/\s+/g, '')}

## Email Campaigns (4 emails)

**Email 1 - Welcome Series (140 words)**
Subject: Welcome to the ${businessName} Family! 🧁

Dear Valued Customer,

Thank you for joining our ${businessName} community! We're thrilled to share our passion for ${uniqueValue.toLowerCase()} with ${targetAudience} in ${location}.

Our story began with a simple mission: creating exceptional baked goods that bring people together. Unlike ${intentMirrorInputs.competitiveContext}, we believe in personal connections, premium organic ingredients, and that ${intentMirrorInputs.brandVoice} service that makes every visit memorable.

What to expect from ${businessName}:
- Daily fresh artisanal pastries and breads
- Custom orders for special occasions
- Community-focused events and partnerships
- Behind-the-scenes content and baking tips

We're working within ${resourceConstraints} to create something truly special for ${location}. Stay tuned for exclusive updates, early access to new products, and member-only events.

Welcome to the family!
The ${businessName} Team

**Email 2 - Educational Content (135 words)**
Subject: The Art of Organic Baking - Our ${businessName} Promise

Hello [Name],

Ever wondered what makes organic baking special? Let us share the ${businessName} difference with ${targetAudience} in ${location}.

Our commitment to ${uniqueValue.toLowerCase()} means:
- Sourcing premium organic flour and ingredients locally when possible
- Traditional fermentation techniques for superior flavor and nutrition
- Small-batch production ensuring freshness and quality
- Seasonal menu adaptations celebrating local harvests

Unlike mass-production approaches used by ${intentMirrorInputs.competitiveContext}, we hand-craft each item with attention to detail that ${targetAudience} deserves. Our ${intentMirrorInputs.brandVoice} approach extends from ingredient selection to customer service.

Working within ${resourceConstraints}, we've designed our operations to maintain these standards while serving our growing ${location} community.

Next week: Learn about our signature sourdough process!

Warmly,
${businessName}

**Email 3 - Community Engagement (125 words)**
Subject: ${location}, Tell Us Your Sweet Stories! 🏘️

Dear ${businessName} Friend,

As we prepare to serve ${targetAudience} in ${location}, we want to hear from you! Your input shapes how we deliver ${uniqueValue.toLowerCase()}.

Share with us:
- Your favorite baking memories and family traditions
- Special dietary needs we should consider
- Occasions where custom pastries would be perfect
- What makes a bakery feel like home to you

Every response helps us understand our ${location} community better. Unlike chain approaches, we believe in personal connections that make ${intentMirrorInputs.brandVoice} service authentic.

Early community members receive:
- 10% off opening week orders
- First access to seasonal specials
- Invitations to exclusive tasting events

Reply to this email or visit our social media - we read every message!

Community-focused,
The ${businessName} Team

**Email 4 - Opening Announcement (145 words)**
Subject: 🎉 ${businessName} Opening Soon in ${location}!

Dear ${businessName} Family,

The moment we've all been waiting for is almost here! ${businessName} opens in ${location} next month, ready to serve ${targetAudience} with ${uniqueValue.toLowerCase()}.

What awaits you:
- Full artisanal bakery featuring daily fresh pastries
- Custom order services for special occasions
- Seasonal menu celebrating local ingredients
- That ${intentMirrorInputs.brandVoice} atmosphere you've been anticipating

Despite working within ${resourceConstraints}, we've created something special that honors both tradition and innovation. Every detail reflects our commitment to ${targetAudience} and our ${location} community.

Opening week exclusives for our email family:
- 15% off all purchases
- Complimentary coffee with pastry purchase
- Priority booking for custom orders
- Exclusive behind-the-scenes tours

Thank you for believing in our vision. We can't wait to welcome you home to ${businessName}!

With gratitude and excitement,
The ${businessName} Team`;

      case 'SITE_AUDIT':
        return `# Website Audit Report: ${businessName}

## Current State Analysis (320 words)

The ${businessName} website requires comprehensive optimization to effectively serve ${targetAudience} in ${location} and support the goal of ${intentMirrorInputs.primaryGoal}. This audit reveals critical areas impacting user experience, conversion rates, and search visibility.

**User Experience & Navigation**: The current site structure fails to clearly communicate ${uniqueValue} to ${targetAudience}. Navigation lacks intuitive pathways for key actions like viewing menus, placing custom orders, or learning about organic ingredients. The ${intentMirrorInputs.brandVoice} brand personality isn't reflected in user interface design, creating disconnection between brand promise and digital experience.

**Content Strategy Gaps**: Existing content doesn't address ${targetAudience} pain points or highlight competitive advantages over ${intentMirrorInputs.competitiveContext}. The unique positioning of ${uniqueValue.toLowerCase()} is buried rather than prominently featured. Missing content includes detailed ingredient sourcing information, behind-the-scenes baking processes, and community involvement stories that would resonate with ${targetAudience} values.

**Technical Performance Issues**: Page load speeds exceed 4.2 seconds, significantly impacting user engagement and search rankings. Mobile responsiveness problems affect 40% of traffic, crucial given ${targetAudience} mobile usage patterns. Contact forms exhibit functionality issues, potentially losing qualified leads for custom orders.

**Local SEO Deficiencies**: The site lacks optimization for "${location} bakery" and related local searches. Google My Business integration is incomplete, missing valuable local discovery opportunities. Schema markup for business information, hours, and menu items is absent, reducing search visibility.

**Conversion Optimization Problems**: The ordering process involves too many steps, creating friction for ${targetAudience}. Trust signals such as organic certifications, customer testimonials, and ingredient sourcing details are underutilized. Call-to-action buttons lack visual prominence and compelling copy that reflects the ${intentMirrorInputs.brandVoice} approach.

**Competitive Positioning**: The website fails to differentiate from ${intentMirrorInputs.competitiveContext} effectively, missing opportunities to highlight ${uniqueValue} and community-focused approach that appeals to ${targetAudience}.

## Strategic Recommendations (130 words)

**Immediate Technical Fixes**: Optimize images and implement lazy loading to achieve sub-2-second load times. Resolve mobile responsiveness issues affecting ${targetAudience} user experience. Fix contact form functionality to capture leads effectively.

**Content Restructure**: Rewrite homepage to prominently feature ${uniqueValue} with ${intentMirrorInputs.brandVoice} messaging targeting ${targetAudience}. Create dedicated pages for organic ingredient sourcing, custom order process, and community involvement. Develop location-specific content for ${location} SEO optimization.

**User Experience Enhancement**: Streamline ordering process to single-page flow. Implement prominent calls-to-action reflecting ${intentMirrorInputs.primaryGoal}. Add trust signals including organic certifications, customer testimonials, and behind-the-scenes content.

**Local SEO Implementation**: Optimize for "${location} organic bakery" searches. Complete Google My Business setup with photos, hours, and menu integration. Implement schema markup for business information and menu items.

These improvements will position ${businessName} to effectively compete against ${intentMirrorInputs.competitiveContext} while serving ${targetAudience} and achieving ${intentMirrorInputs.primaryGoal} objectives.`;

      default:
        return 'Content generation failed. Please try again.';
    }
  };

  const getGenericContent = (type: string): string => {
    switch (type) {
      case 'BUSINESS_BUILDER':
        return 'Generic business plan template with standard sections and placeholder content...';
      case 'SOCIAL_EMAIL':
        return 'Standard social media posts and email templates without personalization...';
      case 'SITE_AUDIT':
        return 'Basic website audit with generic recommendations...';
      default:
        return 'Generic content';
    }
  };

  // Timeout Error Component
  if (timeoutError) {
    return (
      <StandardBackground className="items-center justify-center">
        <PageHeader />
        <div className="flex-1 flex items-center justify-center px-4">
          <StandardCard variant="content" className="max-w-2xl w-full text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6 animate-pulse" />
            <SectionTitle className="text-red-300 mb-4">Generation Timed Out</SectionTitle>
            <BodyText className="text-red-200 mb-6">
              The deliverable generation process took longer than expected. 
              {retryAttempt > 1 && ` Attempted ${retryAttempt} times.`}
            </BodyText>
            <Button 
              onClick={() => window.location.reload()} 
              variant="canai"
              className="mx-auto"
            >
              Try Again
            </Button>
          </StandardCard>
        </div>
      </StandardBackground>
    );
  }

  return (
    <StandardBackground>
      <PageHeader />
      
      <div className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <PageTitle className="mb-4">
            {productType.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())} Generation
          </PageTitle>
          <BodyText className="text-xl">
            Creating personalized deliverable for {intentMirrorInputs.businessName}
          </BodyText>
        </div>

        {/* Generation Progress */}
        {isGenerating && (
          <div className="mb-8 animate-fade-in">
            <StandardCard variant="form" className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Clock className="w-8 h-8 text-[#00CFFF] animate-spin" />
                <div>
                  <CardTitle className="text-[#E6F6FF]">{currentStep.message}</CardTitle>
                  <CaptionText className="mt-1">
                    Step {generationSteps.findIndex(s => s.step === currentStep.step) + 1} of {generationSteps.length}
                  </CaptionText>
                </div>
              </div>
              
              <Progress value={currentStep.progress} className="mb-4 h-3" />
              
              <div className="flex justify-between mb-4">
                <CaptionText>{currentStep.progress}% Complete</CaptionText>
                {retryAttempt > 1 && (
                  <CaptionText className="text-amber-400">
                    Retry attempt {retryAttempt}
                  </CaptionText>
                )}
              </div>
              
              <CaptionText className="text-center">
                Generating with GPT-4o • Validating with Hume AI • Creating PDF via Make.com
              </CaptionText>
            </StandardCard>
          </div>
        )}

        {/* Generated Deliverable */}
        {deliverable && !isGenerating && (
          <div className="space-y-8 animate-fade-in">
            {/* Emotional Resonance Score */}
            {deliverable.emotionalResonance && (
              <StandardCard variant="content" className="bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 border-green-400/40 max-w-4xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                  <div>
                    <CardTitle className="text-green-300 mb-2">Emotional Resonance Analysis</CardTitle>
                    <BodyText className="text-green-200/80">Validated by Hume AI for optimal engagement</BodyText>
                  </div>
                  <div className="text-center lg:text-right mt-4 lg:mt-0">
                    <div className="text-4xl font-bold text-green-400 font-manrope">
                      {(deliverable.emotionalResonance.canaiScore * 100).toFixed(0)}%
                    </div>
                    <CaptionText className="text-green-300">CanAI Score</CaptionText>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-black/20 rounded-xl p-4 text-center">
                    <div className="text-xl font-bold text-green-400 font-manrope">
                      {deliverable.emotionalResonance.arousal.toFixed(2)}
                    </div>
                    <CaptionText className="text-green-200">Arousal</CaptionText>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4 text-center">
                    <div className="text-xl font-bold text-blue-400 font-manrope">
                      {deliverable.emotionalResonance.valence.toFixed(2)}
                    </div>
                    <CaptionText className="text-blue-200">Valence</CaptionText>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4 text-center">
                    <div className="text-xl font-bold text-purple-400 font-manrope">
                      {(deliverable.emotionalResonance.delta * 100).toFixed(0)}%
                    </div>
                    <CaptionText className="text-purple-200">Improvement</CaptionText>
                  </div>
                  <div className="bg-black/20 rounded-xl p-4 text-center">
                    <div className="text-xl font-bold text-gray-400 font-manrope">
                      {(deliverable.emotionalResonance.genericScore * 100).toFixed(0)}%
                    </div>
                    <CaptionText className="text-gray-200">Generic</CaptionText>
                  </div>
                </div>
              </StandardCard>
            )}

            {/* Deliverable Content */}
            <StandardCard variant="content" className="max-w-5xl mx-auto">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                  <CardTitle>Your {productType.replace('_', ' ')} Deliverable</CardTitle>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                  <Button
                    id="regenerate-btn"
                    variant="outline"
                    size="sm"
                    onClick={handleRegenerate}
                    disabled={isRegenerating || regenerationCount >= 2}
                    className="border-[#00CFFF] text-[#E6F6FF] hover:bg-[#00CFFF]/20"
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? 'animate-spin' : ''}`} />
                    Regenerate ({regenerationCount}/2)
                  </Button>
                  <Button
                    variant="canai"
                    size="sm"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
              
              <div className="bg-black/20 rounded-xl p-6 mb-6">
                <div className="prose prose-invert max-w-none">
                  {formatContent(deliverable.content)}
                </div>
              </div>

              {/* Branding Note */}
              <div id="branding-note" className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-xl">
                <BodyText className="text-amber-200">
                  <strong>Note:</strong> CanAI excludes branding (e.g., logos). Contact us for partners.
                </BodyText>
              </div>
            </StandardCard>

            {/* Revision Request */}
            <StandardCard variant="form" className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <Edit3 className="w-8 h-8 text-[#00CFFF]" />
                <CardTitle>Request Revision</CardTitle>
              </div>
              
              <Textarea
                id="revision-input"
                placeholder="Describe specific changes you'd like (e.g., 'Make tone bolder', 'Add more financial details', 'Focus more on sustainability')..."
                value={revisionText}
                onChange={(e) => setRevisionText(e.target.value)}
                className="mb-4 bg-white/10 border-[#00CFFF]/30 text-white placeholder:text-white/50 min-h-[100px]"
                rows={4}
              />
              
              <Button
                id="revision-btn"
                onClick={handleRevision}
                disabled={!revisionText.trim() || isRevising}
                variant="canai"
                className="w-full"
              >
                {isRevising ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Applying Revision...
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Apply Revision
                  </>
                )}
              </Button>
            </StandardCard>

            {/* Deliverable Metadata */}
            <StandardCard variant="content" className="max-w-4xl mx-auto">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#00CFFF] font-manrope mb-2">
                    {deliverable.revisionCount}
                  </div>
                  <CaptionText>Revisions</CaptionText>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#00CFFF] font-manrope mb-2">
                    {regenerationCount}/2
                  </div>
                  <CaptionText>Regenerations</CaptionText>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#00CFFF] font-manrope mb-2">
                    {deliverable.content.split(' ').length}
                  </div>
                  <CaptionText>Words</CaptionText>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#00CFFF] font-manrope mb-2">
                    {new Date(deliverable.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <CaptionText>Generated</CaptionText>
                </div>
              </div>
            </StandardCard>
          </div>
        )}

        {/* Error Display */}
        {error && !timeoutError && (
          <StandardCard variant="content" className="bg-red-500/20 border-red-500/40 max-w-3xl mx-auto">
            <div className="flex items-center gap-4 text-red-200 mb-6">
              <AlertCircle className="w-8 h-8" />
              <div>
                <CardTitle className="text-red-300">Generation Error</CardTitle>
                <BodyText className="opacity-75">{error}</BodyText>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={generateDeliverable}
              className="border-red-400 text-red-200 hover:bg-red-500/20"
            >
              Retry Generation
            </Button>
          </StandardCard>
        )}
      </div>
    </StandardBackground>
  );
};

export default DeliverableGeneration;
