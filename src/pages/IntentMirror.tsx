import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Shield, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StandardBackground from "@/components/StandardBackground";
import { PageTitle, BodyText } from "@/components/StandardTypography";
import PageHeader from "@/components/PageHeader";
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

  const loadIntentMirror = async (retryCount = 0) => {
    setIsLoading(true);
    
    try {
      // TODO: API Integration - POST /v1/intent-mirror
      const startTime = Date.now();
      await new Promise(resolve => setTimeout(resolve, 250));
      
      if (Math.random() > 0.9 && retryCount === 0) {
        throw new Error('Simulated API failure');
      }
      
      const mockConfidence = lowConfidenceAttempts > 0 ? 0.65 : 0.85;
      const mockData = generateMockIntentData(mockConfidence);
      setIntentData(mockData);
      
      if (mockData.confidenceScore < 0.8) {
        setLowConfidenceAttempts(prev => prev + 1);
      }
      
      const endTime = Date.now();
      console.log('Intent mirror loaded:', { 
        promptId, 
        confidence: mockData.confidenceScore,
        loadTime: endTime - startTime 
      });
      
    } catch (error) {
      console.error('Intent mirror load failed:', error);
      
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
      console.log('Intent confirmed:', { promptId, confidence: intentData.confidenceScore });
      
      toast({
        title: "Perfect! Let's create your plan",
        description: "Moving to deliverable generation...",
      });
      
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
    console.log('Edit field requested:', field);
  };

  const handleEditConfirm = () => {
    setShowEditModal(false);
    window.location.href = `/detailed-input?prompt_id=${promptId}&edit_field=${editField}`;
  };

  const handleSupportRequest = () => {
    console.log('Support requested:', { attempts: lowConfidenceAttempts });
    
    toast({
      title: "Support contacted",
      description: "Our team will help optimize your business summary.",
    });
  };

  if (isLoading) {
    return (
      <StandardBackground className="items-center justify-center">
        <PageHeader />
        <div className="text-center animate-fade-in">
          <div className="animate-spin w-12 h-12 border-4 border-[#36d1fe] border-t-transparent rounded-full mx-auto mb-4"></div>
          <PageTitle className="text-2xl mb-2">Analyzing Your Business</PageTitle>
          <BodyText className="opacity-75">Creating your personalized summary...</BodyText>
        </div>
      </StandardBackground>
    );
  }

  if (!intentData) {
    return (
      <StandardBackground className="items-center justify-center">
        <PageHeader />
        <div className="error-fallback text-center animate-fade-in">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <PageTitle className="text-2xl mb-2">Validation Failed</PageTitle>
          <BodyText className="opacity-75 mb-6">There was an issue validating your business summary.</BodyText>
          <Button variant="canai" onClick={() => loadIntentMirror()}>
            Try Again
          </Button>
        </div>
      </StandardBackground>
    );
  }

  const showLowConfidenceHelp = intentData.confidenceScore < 0.8;
  const showSupportLink = lowConfidenceAttempts >= 2;

  return (
    <StandardBackground className="items-center justify-center">
      <PageHeader />
      
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <PageTitle className="mb-4">Review Your Business Summary</PageTitle>
          <BodyText className="text-lg opacity-90">
            We've analyzed your information and created this summary. Please review and confirm it's accurate.
          </BodyText>
        </div>

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

        <div className="text-center animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => window.location.href = `/detailed-input?prompt_id=${promptId}`}
            className="text-[#36d1fe] hover:text-[#00f0ff] hover:bg-[#36d1fe]/10 transition-colors duration-200 text-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Edit Details
          </Button>
        </div>
      </div>

      <EditModal
        show={showEditModal}
        field={editField}
        onClose={() => setShowEditModal(false)}
        onContinue={handleEditConfirm}
      />
    </StandardBackground>
  );
};

export default IntentMirror;
