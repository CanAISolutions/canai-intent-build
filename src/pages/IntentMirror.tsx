
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Edit2, HelpCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface IntentMirrorData {
  summary: string;
  confidenceScore: number;
  clarifyingQuestions: string[];
  originalData: {
    businessName: string;
    targetAudience: string;
    primaryGoal: string;
    competitiveContext: string;
    brandVoice: string;
    location: string;
    uniqueValue: string;
    resourceConstraints: string;
    currentStatus: string;
    businessDescription: string;
    revenueModel: string;
    planPurpose: string;
  };
}

const IntentMirror = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [lowConfidenceAttempts, setLowConfidenceAttempts] = useState(0);
  const [intentData, setIntentData] = useState<IntentMirrorData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState<string>("");

  // Get prompt_id from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const promptId = urlParams.get('prompt_id') || 'demo-prompt-id';

  // Mock data for demonstration (Sprinkle Haven Bakery example)
  const mockIntentData: IntentMirrorData = {
    summary: "Create a family-friendly bakery business plan for Sprinkle Haven in Denver, focusing on community engagement.",
    confidenceScore: 0.85,
    clarifyingQuestions: [],
    originalData: {
      businessName: "Sprinkle Haven Bakery",
      targetAudience: "Families with children in Denver suburbs",
      primaryGoal: "Build a community-centered bakery",
      competitiveContext: "Competing with chain bakeries and local cafes",
      brandVoice: "warm",
      location: "Denver, Colorado",
      uniqueValue: "Custom celebration cakes with interactive decorating workshops",
      resourceConstraints: "Limited initial capital, small team",
      currentStatus: "Planning phase with market research completed",
      businessDescription: "A family-friendly neighborhood bakery specializing in custom cakes and interactive baking experiences for children and families.",
      revenueModel: "Retail sales, custom orders, workshops",
      planPurpose: "Secure funding and establish market presence"
    }
  };

  // Load intent mirror data with retry logic
  const loadIntentMirror = async (retryCount = 0) => {
    setIsLoading(true);
    
    try {
      // TODO: API Integration - POST /v1/intent-mirror
      // const response = await fetch('/v1/intent-mirror', {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'X-Correlation-ID': generateCorrelationId()
      //   },
      //   body: JSON.stringify({ prompt_id: promptId })
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 250));
      
      // Mock potential failure for testing retry logic
      if (Math.random() > 0.9 && retryCount === 0) {
        throw new Error('Simulated API failure');
      }
      
      setIntentData(mockIntentData);
      
      // Track low confidence attempts
      if (mockIntentData.confidenceScore < 0.8) {
        setLowConfidenceAttempts(prev => prev + 1);
      }
      
      console.log('Intent mirror loaded:', { promptId, confidence: mockIntentData.confidenceScore });
      
      // TODO: PostHog event tracking
      // posthog.capture('funnel_step', { step: 'intent_mirror_viewed', confidence: mockIntentData.confidenceScore });
      
    } catch (error) {
      console.error('Intent mirror load failed:', error);
      
      // Retry logic with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          loadIntentMirror(retryCount + 1);
        }, delay);
      } else {
        toast({
          title: "Loading failed",
          description: "Unable to load your business summary. Please try again.",
          variant: "destructive"
        });
        
        // TODO: Log to Supabase error_logs
        // INSERT INTO error_logs (user_id, error_message, action, error_type)
        // VALUES (auth.uid(), error.message, 'intent_mirror_load', 'api_failure');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIntentMirror();
  }, []);

  const handleConfirm = async () => {
    if (!intentData) return;
    
    setIsConfirming(true);
    
    try {
      // TODO: Update Supabase prompt_logs with confirmation
      // UPDATE prompt_logs SET 
      //   payload = payload || jsonb_build_object('intent_confirmed', true, 'confidence_score', ?)
      // WHERE id = ?;
      
      console.log('Intent confirmed:', { promptId, confidence: intentData.confidenceScore });
      
      // TODO: PostHog tracking
      // posthog.capture('funnel_step', { step: 'intent_confirmed', confidence: intentData.confidenceScore });
      
      toast({
        title: "Perfect! Let's create your plan",
        description: "Moving to deliverable generation...",
      });
      
      // Navigate to generating spinner (placeholder for now)
      setTimeout(() => {
        window.location.href = `/generating?prompt_id=${promptId}`;
      }, 1500);
      
    } catch (error) {
      console.error('Confirmation failed:', error);
      toast({
        title: "Confirmation failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleEdit = (field: string) => {
    setEditField(field);
    setShowEditModal(true);
    
    // TODO: PostHog tracking
    // posthog.capture('field_edited', { field, confidence: intentData?.confidenceScore });
    
    console.log('Edit field requested:', field);
  };

  const handleEditConfirm = () => {
    setShowEditModal(false);
    
    // Navigate back to detailed input with specific field focus
    window.location.href = `/detailed-input?prompt_id=${promptId}&edit_field=${editField}`;
  };

  const handleSupportRequest = () => {
    // TODO: PostHog tracking
    // posthog.capture('support_requested', { 
    //   attempts: lowConfidenceAttempts, 
    //   confidence: intentData?.confidenceScore 
    // });
    
    console.log('Support requested:', { attempts: lowConfidenceAttempts });
    
    toast({
      title: "Support contacted",
      description: "Our team will help optimize your business summary.",
    });
  };

  if (isLoading) {
    return (
      <main 
        className="min-h-screen w-full flex flex-col items-center justify-center px-4"
        style={{
          background: `radial-gradient(ellipse at 55% 24%, #152647 0%, #091023 65%, #052947 100%)`,
          backgroundColor: "#0A1535"
        }}
      >
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-canai-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-canai-light mb-2">Analyzing Your Business</h2>
          <p className="text-white opacity-75">Creating your personalized summary...</p>
        </div>
      </main>
    );
  }

  if (!intentData) {
    return (
      <main 
        className="min-h-screen w-full flex flex-col items-center justify-center px-4"
        style={{
          background: `radial-gradient(ellipse at 55% 24%, #152647 0%, #091023 65%, #052947 100%)`,
          backgroundColor: "#0A1535"
        }}
      >
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-canai-light mb-2">Unable to Load Summary</h2>
          <p className="text-white opacity-75 mb-6">There was an issue loading your business summary.</p>
          <Button variant="canai" onClick={() => loadIntentMirror()}>
            Try Again
          </Button>
        </div>
      </main>
    );
  }

  const showLowConfidenceHelp = intentData.confidenceScore < 0.8;
  const showSupportLink = lowConfidenceAttempts >= 2;

  return (
    <main 
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8"
      style={{
        background: `radial-gradient(ellipse at 55% 24%, #152647 0%, #091023 65%, #052947 100%)`,
        backgroundColor: "#0A1535"
      }}
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-canai-light mb-4 animate-text-glow">
            Review Your Business Summary
          </h1>
          <p className="text-white text-lg opacity-90 font-medium">
            We've analyzed your details. Please confirm this summary captures your vision.
          </p>
        </div>

        {/* Summary Card */}
        <Card className="bg-canai-blue-card/80 border-2 border-canai-primary/30 backdrop-blur-sm mb-8 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-canai-light text-center font-bold">
              Business Intent Summary
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 pb-8">
            {/* Summary Text */}
            <div className="bg-black/20 rounded-xl p-6 border border-canai-primary/20">
              <h3 className="text-lg font-semibold text-canai-light mb-3">Your Business Plan Focus:</h3>
              <p 
                id="summary-text"
                className="text-white text-lg leading-relaxed"
              >
                {intentData.summary}
              </p>
            </div>

            {/* Confidence Gauge */}
            <div className="bg-black/20 rounded-xl p-6 border border-canai-primary/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-canai-light">Confidence Score</h3>
                <span className="text-2xl font-bold text-canai-primary">
                  {(intentData.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>
              <Progress 
                id="confidence-gauge"
                value={intentData.confidenceScore * 100} 
                className="h-4 bg-canai-primary-blue-dark rounded-full overflow-hidden mb-2"
              />
              <p className="text-sm text-canai-light opacity-75">
                {intentData.confidenceScore >= 0.8 
                  ? "High confidence - ready to proceed!" 
                  : "Lower confidence - we recommend clarification"}
              </p>
            </div>

            {/* Clarifying Questions (if confidence < 0.8) */}
            {showLowConfidenceHelp && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <HelpCircle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-amber-200 mb-3">
                      Help us understand better:
                    </h3>
                    <div id="clarify-text" className="space-y-2">
                      {intentData.clarifyingQuestions.length > 0 ? (
                        intentData.clarifyingQuestions.map((question, index) => (
                          <p key={index} className="text-amber-100">• {question}</p>
                        ))
                      ) : (
                        <p className="text-amber-100">
                          • Could you provide more specific details about your target market?<br/>
                          • What makes your business unique compared to competitors?<br/>
                          • What are your primary revenue goals for the first year?
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-canai-primary/20">
              <div className="flex-1">
                <Button
                  id="confirm-btn"
                  variant="canai"
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className="w-full py-4 text-lg"
                >
                  {isConfirming ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Looks Perfect - Create My Plan
                    </>
                  )}
                </Button>
              </div>
              
              <Button
                id="edit-btn"
                variant="outline"
                onClick={() => handleEdit('general')}
                className="bg-transparent border-canai-primary text-canai-light hover:bg-canai-primary/20 hover:border-canai-cyan transition-all duration-200 py-4"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Details
              </Button>
            </div>

            {/* Field-specific edit buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(intentData.originalData).slice(0, 6).map(([key, value]) => (
                <Button
                  key={key}
                  id={`edit-field-${key}`}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(key)}
                  className="text-canai-light hover:bg-canai-primary/10 text-xs p-2 h-auto"
                >
                  <Edit2 className="w-3 h-3 mr-1" />
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Button>
              ))}
            </div>

            {/* Support Link (after 2 low-confidence attempts) */}
            {showSupportLink && (
              <div className="text-center pt-4 border-t border-canai-primary/20">
                <p className="text-canai-light opacity-75 mb-3 text-sm">
                  Having trouble with the summary?
                </p>
                <Button
                  id="support-link"
                  variant="link"
                  onClick={handleSupportRequest}
                  className="text-canai-primary hover:text-canai-cyan underline"
                >
                  Get help from our team
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => window.location.href = `/detailed-input?prompt_id=${promptId}`}
            className="text-canai-light-blue hover:text-canai-primary transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Edit Details
          </Button>
        </div>
      </div>

      {/* Edit Confirmation Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-canai-blue-card border-canai-primary/30 text-canai-light">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-canai-light">
              Edit Your Details
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-white mb-4">
              You'll return to the detailed input form to update your{" "}
              <span className="font-semibold text-canai-primary">
                {editField.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>{" "}
              information.
            </p>
            <p className="text-canai-light opacity-75 text-sm mb-6">
              Your progress will be saved automatically as you make changes.
            </p>
            <div className="flex gap-3">
              <Button
                variant="canai"
                onClick={handleEditConfirm}
                className="flex-1"
              >
                Continue to Edit
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="bg-transparent border-canai-primary text-canai-light hover:bg-canai-primary/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default IntentMirror;
