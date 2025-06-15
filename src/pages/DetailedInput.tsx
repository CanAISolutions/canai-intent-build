
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight, ChevronLeft, Save, CheckCircle } from "lucide-react";
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
  
  const [formData, setFormData] = useState<FormData>({
    businessName: "",
    targetAudience: "",
    primaryGoal: "",
    competitiveContext: "",
    brandVoice: "",
    location: "",
    uniqueValue: "",
    resourceConstraints: "",
    currentStatus: "",
    businessDescription: "",
    revenueModel: "",
    planPurpose: ""
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Auto-save functionality
  const autoSave = useCallback(async () => {
    if (Object.values(formData).some(value => value.trim())) {
      setIsAutoSaving(true);
      
      try {
        // TODO: API Integration
        // const response = await fetch('/v1/save-progress', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     prompt_id: promptId,
        //     payload: formData,
        //     step: currentStep
        //   })
        // });
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 150));
        
        setLastSaved(new Date());
        
        // TODO: Supabase mapping
        // Supabase: prompt_logs table
        // {
        //   id: UUID,
        //   user_id: UUID,
        //   initial_prompt_id: UUID,
        //   payload: JSONB (formData),
        //   location: TEXT (step info),
        //   unique_value: TEXT (prompt_id),
        //   created_at: TIMESTAMPTZ
        // }
        
        // TODO: PostHog event
        // posthog.capture('input_saved', {
        //   step: currentStep,
        //   fields_completed: Object.values(formData).filter(v => v.trim()).length,
        //   prompt_id: promptId
        // });
        
        console.log('Auto-save successful:', { promptId, step: currentStep, formData });
        
      } catch (error) {
        console.error('Auto-save failed:', error);
        toast({
          title: "Auto-save failed",
          description: "Your progress couldn't be saved. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsAutoSaving(false);
      }
    }
  }, [formData, currentStep, promptId, toast]);

  // Auto-save every 10 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 10000);
    return () => clearInterval(interval);
  }, [autoSave]);

  // Validation functions
  const validateStep1 = (): boolean => {
    const stepErrors: Partial<FormData> = {};
    
    if (!formData.businessName.trim() || formData.businessName.length < 2) {
      stepErrors.businessName = "Business name must be at least 2 characters";
    }
    
    if (!formData.targetAudience.trim() || formData.targetAudience.length < 10) {
      stepErrors.targetAudience = "Target audience must be at least 10 characters";
    }
    
    if (!formData.primaryGoal.trim()) {
      stepErrors.primaryGoal = "Primary goal is required";
    }
    
    if (!formData.location.trim()) {
      stepErrors.location = "Location is required";
    }
    
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const stepErrors: Partial<FormData> = {};
    
    if (!formData.businessDescription.trim() || formData.businessDescription.length < 20) {
      stepErrors.businessDescription = "Business description must be at least 20 characters";
    }
    
    if (!formData.revenueModel.trim()) {
      stepErrors.revenueModel = "Revenue model is required";
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
      
      // TODO: PostHog event
      // posthog.capture('funnel_step', {
      //   step: 'detailed_input_step_2',
      //   from_step: 1,
      //   completion_percentage: 50
      // });
      
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
      
      // TODO: API Integration - Intent Mirror
      // const response = await fetch('/v1/intent-mirror', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     prompt_id: promptId,
      //     payload: formData
      //   })
      // });
      
      // TODO: PostHog event
      // posthog.capture('funnel_step', {
      //   step: 'detailed_input_completed',
      //   completion_percentage: 100,
      //   prompt_id: promptId
      // });
      
      console.log('Form submitted successfully:', formData);
      
      // Redirect to Intent Mirror page
      window.location.href = `/intent-mirror?prompt_id=${promptId}`;
      
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
      className="min-h-screen w-full flex flex-col items-center justify-center px-4"
      style={{
        background: `radial-gradient(ellipse at 55% 24%, #152647 0%, #091023 65%, #052947 100%)`,
        backgroundColor: "#0A1535"
      }}
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-canai-light mb-4 animate-text-glow">
            Tell Us About Your Business
          </h1>
          <p className="text-canai-light-blue text-lg mb-6">
            Help us create something amazing for you. This should take about 2 minutes.
          </p>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-canai-light-blue mb-2">
              <span>Step {currentStep} of 2</span>
              <span>{progress}% Complete</span>
            </div>
            <Progress 
              id="progress-bar"
              value={progress} 
              className="h-3 bg-canai-primary-blue-dark"
            />
          </div>
        </div>

        {/* Auto-save indicator */}
        <AutoSaveIndicator 
          isAutoSaving={isAutoSaving}
          lastSaved={lastSaved}
        />

        {/* Form Card */}
        <Card className="canai-product-card mb-8">
          <CardHeader>
            <CardTitle className="text-canai-card-title text-center">
              {currentStep === 1 ? "Business Basics" : "Business Details"}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
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
            <div className="flex justify-between pt-6">
              {currentStep > 1 ? (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="bg-canai-blue-card border-canai-primary text-canai-light hover:bg-canai-primary-blue"
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
                >
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="canai"
                  onClick={handleSubmit}
                >
                  Continue to Review
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resume Link */}
        <div className="text-center text-canai-light-blue text-sm">
          <p>
            Bookmark this link to resume later:{" "}
            <a 
              href={resumeLink}
              className="text-canai-primary hover:text-canai-cyan underline"
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
