import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StandardBackground from "@/components/StandardBackground";
import StandardCard from "@/components/StandardCard";
import { PageTitle, BodyText, CaptionText } from "@/components/StandardTypography";
import PageHeader from "@/components/PageHeader";
import StepOneForm from "@/components/DetailedInput/StepOneForm";
import StepTwoForm from "@/components/DetailedInput/StepTwoForm";
import AutoSaveIndicator from "@/components/DetailedInput/AutoSaveIndicator";

export interface FormData {
  // Step 1 fields
  businessName: string;
  targetAudience: string;
  primaryGoal: string;
  competitiveContext: string;
  brandVoice: string;
  location: string;
  uniqueValue: string;
  
  // Step 2 fields
  resourceConstraints: string;
  currentStatus: string;
  businessDescription: string;
  revenueModel: string;
  planPurpose: string;
}

const DetailedInput = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [promptId] = useState(() => crypto.randomUUID());
  const [saveAttempts, setSaveAttempts] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    targetAudience: "",
    primaryGoal: "",
    competitiveContext: "",
    brandVoice: "warm", // Default for bakery
    location: "",
    uniqueValue: "",
    resourceConstraints: "",
    currentStatus: "",
    businessDescription: "",
    revenueModel: "",
    planPurpose: ""
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Validation regex patterns
  const validationRegex = {
    businessName: /^[a-zA-Z0-9\s]{3,50}$/,
    location: /^[a-zA-Z\s,]{1,100}$/,
    uniqueValue: /^[a-zA-Z0-9\s,.]{1,200}$/,
    competitiveContext: /^[a-zA-Z0-9\s,.]{1,100}$/,
    currentStatus: /^[a-zA-Z0-9\s,.]{1,120}$/
  };

  // Word count helper
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Auto-save with retry logic
  const autoSave = useCallback(async (retryCount = 0) => {
    if (Object.values(formData).some(value => value.trim())) {
      setIsAutoSaving(true);
      
      try {
        // TODO: API Integration - POST /v1/save-progress
        await new Promise(resolve => setTimeout(resolve, 150));
        
        if (Math.random() > 0.9 && retryCount === 0) {
          throw new Error('Simulated save failure');
        }
        
        setLastSaved(new Date());
        setSaveAttempts(0);
        
        console.log('Auto-save successful:', { promptId, step: currentStep, formData });
        
      } catch (error) {
        console.error('Auto-save failed:', error);
        
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            autoSave(retryCount + 1);
          }, delay);
          setSaveAttempts(retryCount + 1);
        } else {
          toast({
            title: "Save failed",
            description: "Your progress couldn't be saved after multiple attempts. Please try again.",
            variant: "destructive"
          });
        }
      } finally {
        setIsAutoSaving(false);
      }
    }
  }, [formData, currentStep, promptId, toast]);

  // Auto-save every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => autoSave(), 10000);
    return () => clearInterval(interval);
  }, [autoSave]);

  // Validation functions
  const validateStep1 = (): boolean => {
    const stepErrors: Partial<FormData> = {};
    
    if (!formData.businessName.trim()) {
      stepErrors.businessName = "Business name is required";
    } else if (!validationRegex.businessName.test(formData.businessName)) {
      stepErrors.businessName = "Business name must be 3-50 characters, letters and numbers only";
    }
    
    if (!formData.targetAudience.trim() || formData.targetAudience.length < 10) {
      stepErrors.targetAudience = "Target audience must be at least 10 characters";
    }
    
    if (!formData.primaryGoal.trim()) {
      stepErrors.primaryGoal = "Primary goal is required";
    }
    
    if (!formData.location.trim()) {
      stepErrors.location = "Location is required";
    } else if (!validationRegex.location.test(formData.location)) {
      stepErrors.location = "Location must be valid (letters, spaces, commas only)";
    }
    
    if (!formData.uniqueValue.trim()) {
      stepErrors.uniqueValue = "Unique value proposition is required";
    } else if (!validationRegex.uniqueValue.test(formData.uniqueValue)) {
      stepErrors.uniqueValue = "Invalid characters in unique value proposition";
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const stepErrors: Partial<FormData> = {};
    
    const descWordCount = countWords(formData.businessDescription);
    if (!formData.businessDescription.trim()) {
      stepErrors.businessDescription = "Business description is required";
    } else if (descWordCount < 10 || descWordCount > 50) {
      stepErrors.businessDescription = "Business description must be 10-50 words";
    }
    
    if (!formData.planPurpose.trim()) {
      stepErrors.planPurpose = "Plan purpose is required";
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      console.log('Moving to step 2');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    
    try {
      await autoSave();
      
      console.log('Form submitted successfully:', formData);
      
      toast({
        title: "Perfect! Your details are saved",
        description: "Moving to the next step...",
      });
      
      setTimeout(() => {
        window.location.href = `/intent-mirror?prompt_id=${promptId}`;
      }, 1500);
      
    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  const progress = currentStep === 1 ? 50 : 100;
  const resumeLink = `/resume?prompt_id=${promptId}`;

  return (
    <StandardBackground className="items-center justify-center">
      <PageHeader />
      
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <PageTitle className="mb-4">Tell Us About Your Business</PageTitle>
          <BodyText className="text-lg opacity-90 mb-8">
            Help us create something amazing for you. This should take about 2 minutes.
          </BodyText>
          
          {/* Progress Section */}
          <StandardCard variant="glass" padding="md" className="mb-8">
            <div className="flex justify-between text-sm text-[#E6F6FF] mb-3">
              <CaptionText className="font-medium">Step {currentStep} of 2</CaptionText>
              <CaptionText className="font-medium">{progress}% Complete</CaptionText>
            </div>
            <Progress 
              id="progress-bar"
              value={progress} 
              className="h-3 bg-[#19334a] rounded-full overflow-hidden"
            />
          </StandardCard>
        </div>

        {/* Auto-save indicator */}
        <AutoSaveIndicator 
          isAutoSaving={isAutoSaving}
          lastSaved={lastSaved}
        />

        {/* Form Card */}
        <StandardCard variant="form" className="mb-8 shadow-2xl">
          <div className="mb-6">
            <PageTitle className="text-2xl text-center">
              {currentStep === 1 ? "Business Basics" : "Business Strategy"}
            </PageTitle>
          </div>
          
          <div className="space-y-6">
            {currentStep === 1 ? (
              <StepOneForm 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            ) : (
              <StepTwoForm 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}
            
            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t-2 border-[#36d1fe]/20">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="bg-transparent border-[#36d1fe] text-[#E6F6FF] hover:bg-[#36d1fe]/20 hover:border-[#36d1fe] transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              ) : (
                <div />
              )}
              
              {currentStep === 1 ? (
                <Button
                  variant="canai"
                  onClick={handleNext}
                  className="px-8 py-3"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="canai"
                  onClick={handleSubmit}
                  className="px-8 py-3"
                >
                  Continue to Review
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </StandardCard>

        {/* Resume Link */}
        <div className="text-center">
          <CaptionText>
            Bookmark this link to resume later:{" "}
            <a 
              href={resumeLink}
              className="text-[#36d1fe] hover:text-[#00f0ff] underline transition-colors duration-200"
            >
              {window.location.origin}{resumeLink}
            </a>
          </CaptionText>
        </div>
      </div>
    </StandardBackground>
  );
};

export default DetailedInput;
