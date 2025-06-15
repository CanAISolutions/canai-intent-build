
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StandardBackground from '@/components/StandardBackground';
import { PageTitle, SectionTitle, BodyText } from '@/components/StandardTypography';
import { StandardButton } from '@/components/ui/standard-button';
import StepOneForm from '@/components/DetailedInput/StepOneForm';
import StepTwoForm from '@/components/DetailedInput/StepTwoForm';
import AutoSaveIndicator from '@/components/DetailedInput/AutoSaveIndicator';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

// API and analytics imports
import { saveDetailedInput, validateDetailedInput } from '@/utils/detailedInputIntegration';
import { trackPageView, trackFunnelStep, trackFormStep } from '@/utils/analytics';
import { logInteraction } from '@/utils/api';

interface FormData {
  // Step 1 fields
  businessName: string;
  businessDescription: string;
  targetAudience: string;
  keyProducts: string;
  uniqueValueProp: string;
  location: string;
  
  // Step 2 fields
  primaryGoals: string;
  secondaryGoals: string;
  timeline: string;
  budget: string;
  successMetrics: string;
  additionalContext: string;
}

const DetailedInput = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessDescription: '',
    targetAudience: '',
    keyProducts: '',
    uniqueValueProp: '',
    location: '',
    primaryGoals: '',
    secondaryGoals: '',
    timeline: '',
    budget: '',
    successMetrics: '',
    additionalContext: ''
  });

  useEffect(() => {
    // Track page view
    trackPageView('detailed_input');
    trackFunnelStep('detailed_input_entered');
    
    // Load saved data from localStorage
    const savedData = localStorage.getItem('canai_detailed_input');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
        console.log('[Detailed Input] Loaded saved data from localStorage');
      } catch (error) {
        console.error('[Detailed Input] Failed to parse saved data:', error);
      }
    }

    logInteraction({
      user_id: 'demo-user-id',
      interaction_type: 'page_view',
      interaction_details: {
        page: 'detailed_input',
        step: currentStep,
        timestamp: new Date().toISOString(),
      }
    });
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      handleAutoSave();
    }, 10000); // Auto-save every 10 seconds

    return () => clearTimeout(autoSaveTimer);
  }, [formData]);

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    
    try {
      // Save to localStorage
      localStorage.setItem('canai_detailed_input', JSON.stringify(formData));
      
      // Save to API
      await saveDetailedInput({
        user_id: 'demo-user-id',
        payload: formData,
        step: currentStep,
        auto_save: true
      });

      setLastSaved(new Date());
      console.log('[Detailed Input] Auto-saved successfully');

    } catch (error) {
      console.error('[Detailed Input] Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepForward = () => {
    if (currentStep === 1) {
      trackFormStep('step_1_completed', { formData: getStep1Data() });
      setCurrentStep(2);
    }
  };

  const handleStepBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Validate form data
      const validation = await validateDetailedInput(formData);
      
      if (!validation.valid) {
        throw new Error(validation.error || 'Validation failed');
      }

      trackFunnelStep('detailed_input_completed', { formData });
      
      // Save final data
      await saveDetailedInput({
        user_id: 'demo-user-id',
        payload: formData,
        step: 2,
        auto_save: false,
        completed: true
      });

      console.log('[Detailed Input] Form submitted successfully');
      
      // Clear localStorage and navigate
      localStorage.removeItem('canai_detailed_input');
      navigate('/intent-mirror');

    } catch (error) {
      console.error('[Detailed Input] Submission failed:', error);
      setIsSubmitting(false);
    }
  };

  const getStep1Data = () => ({
    businessName: formData.businessName,
    businessDescription: formData.businessDescription,
    targetAudience: formData.targetAudience,
    keyProducts: formData.keyProducts,
    uniqueValueProp: formData.uniqueValueProp,
    location: formData.location
  });

  const getStep2Data = () => ({
    primaryGoals: formData.primaryGoals,
    secondaryGoals: formData.secondaryGoals,
    timeline: formData.timeline,
    budget: formData.budget,
    successMetrics: formData.successMetrics,
    additionalContext: formData.additionalContext
  });

  const isStep1Valid = formData.businessName && formData.businessDescription && 
                     formData.targetAudience && formData.keyProducts;
  const isStep2Valid = formData.primaryGoals && formData.timeline && formData.successMetrics;

  return (
    <StandardBackground>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <PageTitle className="text-white mb-4">Shape Your Vision</PageTitle>
          <BodyText className="text-xl text-white opacity-90 max-w-3xl mx-auto">
            Help us understand the details of your business so we can create something truly tailored to your needs.
          </BodyText>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? 'bg-[#36d1fe] text-white' : 'bg-gray-600 text-gray-300'
            }`}>
              {currentStep > 1 ? <CheckCircle2 size={18} /> : '1'}
            </div>
            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-[#36d1fe]' : 'bg-gray-600'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? 'bg-[#36d1fe] text-white' : 'bg-gray-600 text-gray-300'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-white opacity-70">
            <span>Business Details</span>
            <span>Goals & Context</span>
          </div>
        </div>

        {/* Auto-save Indicator */}
        <div className="mb-6">
          <AutoSaveIndicator 
            isAutoSaving={isAutoSaving}
            lastSaved={lastSaved}
          />
        </div>

        {/* Form Card */}
        <Card className="bg-[rgba(25,60,101,0.7)] border-2 border-[#36d1fe]/40 backdrop-blur-md">
          <CardContent className="p-8">
            
            {currentStep === 1 && (
              <>
                <SectionTitle className="text-white text-center mb-8">
                  Tell Us About Your Business
                </SectionTitle>
                <StepOneForm
                  data={getStep1Data()}
                  onChange={handleInputChange}
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                <SectionTitle className="text-white text-center mb-8">
                  Define Your Goals
                </SectionTitle>
                <StepTwoForm
                  data={getStep2Data()}
                  onChange={handleInputChange}
                />
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <div>
                {currentStep === 2 && (
                  <StandardButton
                    onClick={handleStepBack}
                    variant="ghost"
                    icon={<ArrowLeft size={18} />}
                    iconPosition="left"
                    className="text-white"
                  >
                    Back
                  </StandardButton>
                )}
              </div>

              <div>
                {currentStep === 1 && (
                  <StandardButton
                    onClick={handleStepForward}
                    disabled={!isStep1Valid}
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight size={20} />}
                    iconPosition="right"
                  >
                    Continue
                  </StandardButton>
                )}

                {currentStep === 2 && (
                  <StandardButton
                    onClick={handleSubmit}
                    disabled={!isStep2Valid}
                    loading={isSubmitting}
                    loadingText="Saving your details..."
                    variant="primary"
                    size="lg"
                    icon={<CheckCircle2 size={20} />}
                    iconPosition="right"
                  >
                    Complete Setup
                  </StandardButton>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </StandardBackground>
  );
};

export default DetailedInput;
