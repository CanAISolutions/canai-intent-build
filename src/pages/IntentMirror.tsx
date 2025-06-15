import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Shield, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EditModal from "@/components/IntentMirror/EditModal";
import SummaryCard from "@/components/IntentMirror/SummaryCard";

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
        {/* MAIN CARD REFACTOR */}
        <SummaryCard
          summary={intentData.summary}
          confidenceScore={intentData.confidenceScore}
          clarifyingQuestions={intentData.clarifyingQuestions}
          originalData={intentData.originalData}
          isConfirming={isConfirming}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
          onSupport={handleSupportRequest}
          showLowConfidenceHelp={showLowConfidenceHelp}
          showSupportLink={showSupportLink}
        />

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

      {/* EDIT MODAL REFACTOR */}
      <EditModal
        show={showEditModal}
        field={editField}
        onClose={() => setShowEditModal(false)}
        onContinue={handleEditConfirm}
      />
    </main>
  );
};

export default IntentMirror;
