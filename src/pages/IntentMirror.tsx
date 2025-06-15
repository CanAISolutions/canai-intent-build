import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Edit2, HelpCircle, CheckCircle, ArrowLeft, Shield, Clock, Users } from "lucide-react";
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

  // Enhanced mock data with dynamic confidence and clarifying questions
  const generateMockIntentData = (confidenceLevel = 0.85): IntentMirrorData => {
    const baseData = {
      summary: "Create a family-friendly organic bakery business plan for Sprinkle Haven in Denver, focusing on community engagement and investor funding.",
      originalData: {
        businessName: "Sprinkle Haven Bakery",
        targetAudience: "Denver families with children seeking organic, artisanal baked goods",
        primaryGoal: "Secure $200K investor funding for bakery launch",
        competitiveContext: "Competing with Blue Moon Bakery and chain stores like King Soopers bakery",
        brandVoice: "warm",
        location: "Denver, Colorado",
        uniqueValue: "Organic, community-focused pastries with interactive family baking workshops",
        resourceConstraints: "$50k initial budget; team of 3; 6-month timeline",
        currentStatus: "Planning phase with market research completed",
        businessDescription: "Artisanal neighborhood bakery specializing in organic pastries and family experiences",
        revenueModel: "Retail sales, custom orders, baking workshops, catering events",
        planPurpose: "Secure investor funding and establish market presence"
      }
    };

    // Dynamic clarifying questions based on confidence
    let clarifyingQuestions: string[] = [];
    if (confidenceLevel < 0.8) {
      clarifyingQuestions = [
        "What specific funding amount are you targeting from investors?",
        "How will you differentiate from Blue Moon Bakery specifically?",
        "What's your projected monthly revenue for year 1?",
        "Do you have any existing partnerships or supplier relationships?",
        "What permits and certifications do you need for organic certification?"
      ];
    }

    return {
      ...baseData,
      confidenceScore: confidenceLevel,
      clarifyingQuestions
    };
  };

  // Load intent mirror data with retry logic (F6-E1)
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
      //   body: JSON.stringify({
      //     businessName: "Sprinkle Haven Bakery",
      //     targetAudience: "Denver families",
      //     primaryGoal: "funding",
      //     competitiveContext: "Blue Moon Bakery",
      //     brandVoice: "warm",
      //     resourceConstraints: "$50k budget; team of 3; 6 months",
      //     currentStatus: "Planning phase",
      //     businessDescription: "Artisanal bakery offering organic pastries",
      //     revenueModel: "Sales, events",
      //     planPurpose: "investor",
      //     location: "Denver, CO",
      //     uniqueValue: "Organic, community-focused pastries"
      //   })
      // });
      
      // Simulate API call with performance target <300ms
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 250));
      
      // Mock potential failure for testing retry logic
      if (Math.random() > 0.9 && retryCount === 0) {
        throw new Error('Simulated API failure');
      }
      
      // Simulate varying confidence levels for testing
      const mockConfidence = lowConfidenceAttempts > 0 ? 0.65 : 0.85;
      const mockData = generateMockIntentData(mockConfidence);
      setIntentData(mockData);
      
      // Track low confidence attempts
      if (mockData.confidenceScore < 0.8) {
        setLowConfidenceAttempts(prev => prev + 1);
        
        // TODO: Supabase logging for low confidence
        // INSERT INTO error_logs (prompt_id, error_message, support_request, error_type)
        // VALUES (?, 'Low confidence score: ' + mockData.confidenceScore, false, 'low_confidence');
      }
      
      const endTime = Date.now();
      console.log('Intent mirror loaded:', { 
        promptId, 
        confidence: mockData.confidenceScore,
        loadTime: endTime - startTime 
      });
      
      // TODO: PostHog event tracking
      // posthog.capture('funnel_step', { 
      //   stepName: 'intent_mirror', 
      //   completed: true, 
      //   confidence: mockData.confidenceScore,
      //   loadTime: endTime - startTime
      // });
      
      // TODO: Supabase logging
      // UPDATE prompt_logs SET 
      //   payload = payload || jsonb_build_object('intent_summary', ?, 'confidence_score', ?)
      // WHERE id = ?;
      
    } catch (error) {
      console.error('Intent mirror load failed:', error);
      
      // F6-E1: Retry logic with exponential backoff (3 attempts, 2^i * 1000ms delay)
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
        
        // TODO: Supabase error logging
        // INSERT INTO error_logs (user_id, prompt_id, error_message, action, error_type)
        // VALUES (auth.uid(), ?, ?, 'intent_mirror_load', 'api_failure');
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
      // TODO: Supabase logging - Update prompt_logs with confirmation
      // UPDATE prompt_logs SET 
      //   payload = payload || jsonb_build_object('intent_confirmed', true, 'confidence_score', ?)
      // WHERE id = ?;
      
      console.log('Intent confirmed:', { promptId, confidence: intentData.confidenceScore });
      
      // TODO: PostHog tracking
      // posthog.capture('funnel_step', { 
      //   stepName: 'intent_confirmed', 
      //   confidence: intentData.confidenceScore,
      //   completed: true
      // });
      
      toast({
        title: "Perfect! Let's create your plan",
        description: "Moving to deliverable generation...",
      });
      
      // Navigate to generating spinner
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
    // posthog.capture('field_edited', { 
    //   field: field, 
    //   confidence: intentData?.confidenceScore 
    // });
    
    console.log('Edit field requested:', field);
  };

  const handleEditConfirm = () => {
    setShowEditModal(false);
    
    // TODO: Supabase logging - Update prompt_logs with edit action
    // UPDATE prompt_logs SET 
    //   payload = payload || jsonb_build_object('edited_field', ?, 'edit_timestamp', now())
    // WHERE id = ?;
    
    // Navigate back to detailed input with specific field focus
    window.location.href = `/detailed-input?prompt_id=${promptId}&edit_field=${editField}`;
  };

  const handleSupportRequest = () => {
    // TODO: PostHog tracking
    // posthog.capture('support_requested', { 
    //   reason: 'low_confidence',
    //   attempts: lowConfidenceAttempts, 
    //   confidence: intentData?.confidenceScore 
    // });
    
    // TODO: Supabase logging
    // INSERT INTO error_logs (prompt_id, error_message, support_request, error_type)
    // VALUES (?, 'Support requested after low confidence attempts', true, 'low_confidence');
    
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
        {/* F6-E1: Fallback UI on all retries failed */}
        <div className="error-fallback text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-canai-light mb-2">Validation Failed</h2>
          <p className="text-white opacity-75 mb-6">There was an issue validating your business summary.</p>
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
        {/* Enhanced Header with Trust Indicators */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-canai-light mb-4 animate-text-glow">
            Review Your Business Summary
          </h1>
          <p className="text-white text-lg opacity-90 font-medium mb-6">
            We've analyzed your details. Please confirm this summary captures your vision.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center gap-6 text-sm text-canai-light opacity-75">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-canai-primary" />
              <span>AI-Analyzed</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-canai-primary" />
              <span>30s to Review</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-canai-primary" />
              <span>Expert Backed</span>
            </div>
          </div>
        </div>

        {/* Enhanced Summary Card */}
        <Card className="bg-canai-blue-card/90 border-2 border-canai-primary/40 backdrop-blur-md mb-8 shadow-2xl hover:shadow-canai-primary/20 transition-all duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-canai-light text-center font-bold flex items-center justify-center gap-3">
              <CheckCircle className="w-6 h-6 text-canai-primary" />
              Business Intent Summary
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-8 px-8 pb-8">
            {/* Enhanced Summary Text */}
            <div className="bg-gradient-to-br from-black/30 to-black/10 rounded-xl p-8 border border-canai-primary/30 hover:border-canai-primary/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-canai-light">Your Business Plan Focus:</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit('summary')}
                  className="text-canai-primary hover:text-canai-cyan hover:bg-canai-primary/10 opacity-75 hover:opacity-100 transition-all duration-200"
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>
              <p 
                id="summary-text"
                className="text-white text-lg leading-relaxed"
              >
                {intentData.summary}
              </p>
            </div>

            {/* Enhanced Confidence Gauge */}
            <div className="bg-gradient-to-br from-black/30 to-black/10 rounded-xl p-8 border border-canai-primary/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-canai-light">Confidence Score</h3>
                <div className="flex items-center gap-2">
                  <span className={`text-3xl font-bold ${
                    intentData.confidenceScore >= 0.8 ? 'text-green-400' : 
                    intentData.confidenceScore >= 0.6 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {(intentData.confidenceScore * 100).toFixed(0)}%
                  </span>
                  {intentData.confidenceScore >= 0.8 && <CheckCircle className="w-6 h-6 text-green-400" />}
                </div>
              </div>
              <Progress 
                id="confidence-gauge"
                value={intentData.confidenceScore * 100} 
                className="h-6 bg-canai-primary-blue-dark rounded-full overflow-hidden mb-3"
              />
              <div className="flex justify-between items-center">
                <p className={`text-sm font-medium ${
                  intentData.confidenceScore >= 0.8 ? 'text-green-300' : 
                  intentData.confidenceScore >= 0.6 ? 'text-yellow-300' : 'text-red-300'
                }`}>
                  {intentData.confidenceScore >= 0.8 
                    ? "High confidence - ready to proceed!" 
                    : intentData.confidenceScore >= 0.6
                    ? "Good confidence - minor refinements suggested"
                    : "Lower confidence - we recommend clarification"}
                </p>
                {intentData.confidenceScore < 0.8 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit('general')}
                    className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Improve
                  </Button>
                )}
              </div>
            </div>

            {/* Enhanced Clarifying Questions - Now properly implemented */}
            {showLowConfidenceHelp && intentData.clarifyingQuestions.length > 0 && (
              <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-2 border-amber-500/40 rounded-xl p-8 hover:border-amber-400/60 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-7 h-7 text-amber-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-amber-200 mb-4">
                      Help us understand better:
                    </h3>
                    <div id="clarify-text" className="space-y-3 mb-6">
                      {intentData.clarifyingQuestions.map((question, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <p className="text-amber-100 text-lg">{question}</p>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleEdit('clarification')}
                      className="bg-amber-500/20 border-amber-400 text-amber-200 hover:bg-amber-500/30 hover:border-amber-300"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Provide More Details
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t-2 border-canai-primary/30">
              <div className="flex-1">
                <Button
                  id="confirm-btn"
                  variant="canai"
                  onClick={handleConfirm}
                  disabled={isConfirming}
                  className="w-full py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isConfirming ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"></div>
                      Generating Your Plan...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6 mr-3" />
                      Looks Perfect - Create My Plan
                    </>
                  )}
                </Button>
              </div>
              
              <Button
                id="edit-btn"
                variant="outline"
                onClick={() => handleEdit('general')}
                className="bg-transparent border-2 border-canai-primary text-canai-light hover:bg-canai-primary/20 hover:border-canai-cyan transition-all duration-300 py-6 text-lg font-semibold"
              >
                <Edit2 className="w-5 h-5 mr-3" />
                Edit Details
              </Button>
            </div>

            {/* Enhanced Field-specific Edit Buttons with proper IDs */}
            <div className="bg-gradient-to-br from-black/20 to-black/5 rounded-xl p-6 border border-canai-primary/20">
              <h4 className="text-lg font-semibold text-canai-light mb-4 text-center">Quick Edit Specific Fields</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(intentData.originalData).map(([key, value]) => (
                  <Button
                    key={key}
                    id={`edit-field-${key}`}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(key)}
                    className="text-canai-light hover:bg-canai-primary/15 hover:text-canai-primary text-sm p-3 h-auto rounded-lg border border-transparent hover:border-canai-primary/30 transition-all duration-200 group"
                  >
                    <Edit2 className="w-3 h-3 mr-2 group-hover:text-canai-cyan transition-colors" />
                    <span className="truncate">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Enhanced Support Link - appears after 2 low confidence attempts */}
            {showSupportLink && (
              <div className="text-center pt-6 border-t border-canai-primary/20">
                <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-400/30">
                  <HelpCircle className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <p className="text-canai-light mb-4 text-lg">
                    Having trouble with the summary?
                  </p>
                  <p className="text-white opacity-75 mb-4 text-sm">
                    Our team can help refine your business summary for better results
                  </p>
                  <Button
                    id="support-link"
                    variant="outline"
                    onClick={handleSupportRequest}
                    className="bg-blue-500/20 border-blue-400 text-blue-200 hover:bg-blue-500/30 hover:border-blue-300 transition-all duration-200"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Get help from our team
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Back Link */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => window.location.href = `/detailed-input?prompt_id=${promptId}`}
            className="text-canai-light-blue hover:text-canai-primary transition-colors duration-200 text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Edit Details
          </Button>
        </div>
      </div>

      {/* Enhanced Edit Confirmation Modal with Clean Brand Styling */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-canai-blue-card/95 backdrop-blur-xl border border-canai-primary/30 text-canai-light max-w-md mx-auto shadow-2xl rounded-2xl overflow-hidden">
          <DialogHeader className="text-center pb-6 border-b border-canai-primary/20">
            <DialogTitle className="text-2xl font-bold text-canai-light mb-2">
              Edit Your Details
            </DialogTitle>
            <div className="w-12 h-0.5 bg-canai-primary rounded-full mx-auto"></div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            {/* Clean Icon Section */}
            <div className="text-center">
              <div className="w-16 h-16 bg-canai-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-canai-primary/40">
                <Edit2 className="w-8 h-8 text-canai-primary" />
              </div>
              
              {/* Clean Content */}
              <div className="space-y-3">
                <p className="text-white text-lg font-medium leading-relaxed">
                  You'll return to the detailed input form to update your{" "}
                  <span className="font-semibold text-canai-primary">
                    {editField.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>{" "}
                  information.
                </p>
                
                <div className="flex items-center justify-center gap-2 text-canai-light/60 text-sm">
                  <Shield className="w-4 h-4 text-canai-primary/60" />
                  <span>Your progress will be saved automatically</span>
                </div>
              </div>
            </div>
            
            {/* Clean Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                variant="canai"
                onClick={handleEditConfirm}
                className="w-full h-12 text-base font-semibold"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Continue to Edit
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="w-full h-12 bg-transparent border border-canai-primary/40 text-canai-light hover:bg-canai-primary/10 hover:border-canai-primary/60 text-base font-medium"
              >
                Cancel
              </Button>
            </div>
            
            {/* Clean Footer */}
            <div className="text-center pt-3 border-t border-canai-primary/20">
              <div className="flex items-center justify-center gap-2 text-canai-light/50 text-sm">
                <Clock className="w-3 h-3" />
                <span>Takes less than 30 seconds</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default IntentMirror;
