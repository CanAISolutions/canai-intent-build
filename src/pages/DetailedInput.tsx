
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
        // const response = await fetch('/v1/save-progress', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     prompt_id: promptId,
        //     payload: formData
        //   })
        // });
        
        // Simulate API call with potential failure
        await new Promise(resolve => setTimeout(resolve, 150));
        
        // Mock occasional failure for testing retry logic
        if (Math.random() > 0.9 && retryCount === 0) {
          throw new Error('Simulated save failure');
        }
        
        setLastSaved(new Date());
        setSaveAttempts(0);
        
        console.log('Auto-save successful:', { promptId, step: currentStep, formData });
        
      } catch (error) {
        console.error('Auto-save failed:', error);
        
        // F5-E1: Retry logic with exponential backoff
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
      // Final save before submission
      await autoSave();
      
      console.log('Form submitted successfully:', formData);
      
      // Show success feedback
      toast({
        title: "Perfect! Your details are saved",
        description: "Moving to the next step...",
      });
      
      // Redirect to Intent Mirror page
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
    <main 
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-8"
      style={{
        background: `radial-gradient(ellipse at 55% 24%, #152647 0%, #091023 65%, #052947 100%)`,
        backgroundColor: "#0A1535"
      }}
    >
      <div className="w-full max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-canai-light mb-4 animate-text-glow">
            Tell Us About Your Business
          </h1>
          <p className="text-white text-lg mb-8 opacity-90 font-medium">
            Help us create something amazing for you. This should take about 2 minutes.
          </p>
          
          {/* Progress Section */}
          <div className="bg-black/20 rounded-2xl p-6 mb-8 border border-canai-primary/20">
            <div className="flex justify-between text-sm text-canai-light mb-3">
              <span className="font-medium">Step {currentStep} of 2</span>
              <span className="font-medium">{progress}% Complete</span>
            </div>
            <Progress 
              id="progress-bar"
              value={progress} 
              className="h-3 bg-canai-primary-blue-dark rounded-full overflow-hidden"
            />
          </div>
        </div>

        {/* Auto-save indicator */}
        <AutoSaveIndicator 
          isAutoSaving={isAutoSaving}
          lastSaved={lastSaved}
        />

        {/* Form Card */}
        <Card className="bg-canai-blue-card/80 border-2 border-canai-primary/30 backdrop-blur-sm mb-8 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl text-canai-light text-center font-bold">
              {currentStep === 1 ? "Business Basics" : "Business Strategy"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 px-8 pb-8">
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
            <div className="flex justify-between items-center pt-8 border-t border-canai-primary/20">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="bg-transparent border-canai-primary text-canai-light hover:bg-canai-primary/20 hover:border-canai-cyan transition-all duration-200"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
              ) : (
                <div />
              )}
              
              {currentStep === 1 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-canai-primary to-canai-cyan text-white hover:from-canai-cyan hover:to-canai-primary transition-all duration-300 shadow-lg hover:shadow-canai-primary/40 px-8 py-3"
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-canai-primary to-canai-cyan text-white hover:from-canai-cyan hover:to-canai-primary transition-all duration-300 shadow-lg hover:shadow-canai-primary/40 px-8 py-3"
                >
                  Continue to Review
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resume Link */}
        <div className="text-center text-canai-light-blue text-sm opacity-75">
          <p>
            Bookmark this link to resume later:{" "}
            <a 
              href={resumeLink}
              className="text-canai-primary hover:text-canai-cyan underline transition-colors duration-200"
            >
              {window.location.origin}{resumeLink}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default DetailedInput;
