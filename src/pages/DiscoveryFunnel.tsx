
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StandardBackground from '@/components/StandardBackground';
import { PageTitle, SectionTitle, BodyText } from '@/components/StandardTypography';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { StandardForm, StandardFormGroup, StandardFormLabel, StandardFormInput } from '@/components/ui/standard-form';
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalDescription } from '@/components/ui/responsive-modal';
import { MobileOptimizedCard, MobileOptimizedCardContent } from '@/components/ui/mobile-optimized-card';
import ProgressIndicator from '@/components/enhanced/ProgressIndicator';
import { ArrowRight, Lightbulb, Heart, Target, Clock, Palette } from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useAccessibility } from '@/hooks/useAccessibility';

// API and analytics imports
import { validateInput, submitInitialPrompt, calculateOverallTrustScore } from '@/utils/discoveryFunnelApi';
import { trackPageView, trackFunnelStep, trackTrustScoreUpdate } from '@/utils/analytics';

const DiscoveryFunnel = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trustScore, setTrustScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    businessType: '',
    challenge: '',
    tone: '',
    outcome: ''
  });

  // Enhanced hooks
  const { trackInteraction } = usePerformanceMonitor('discovery_funnel', 1500);
  const { setPageTitle, announce } = useAccessibility();

  const steps = ['Business Vision', 'Brand Personality'];

  useEffect(() => {
    setPageTitle('Discovery Funnel');
    
    // Track page view and funnel step - with error handling
    try {
      trackPageView('discovery_funnel');
      trackFunnelStep('discovery_funnel_entered');
    } catch (error) {
      console.warn('[Discovery Funnel] Analytics tracking failed:', error);
    }
  }, [setPageTitle]);

  // Recalculate trust score whenever form data changes
  useEffect(() => {
    const newTrustScore = calculateOverallTrustScore(formData);
    setTrustScore(newTrustScore);
    
    if (newTrustScore > 0) {
      try {
        trackTrustScoreUpdate(newTrustScore, { formData });
      } catch (error) {
        console.warn('[Discovery Funnel] Trust score tracking failed:', error);
      }
    }
  }, [formData]);

  const handleInputChange = async (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    // Validate input for feedback (but trust score is calculated overall)
    try {
      await validateInput({
        value,
        context: updatedData
      });
    } catch (error) {
      console.error('[Discovery Funnel] Validation failed:', error);
    }
  };

  const handleStepComplete = () => {
    try {
      trackInteraction(`step_${step + 1}_complete`);
    } catch (error) {
      console.warn('[Discovery Funnel] Step tracking failed:', error);
    }
    
    if (step === 0) {
      try {
        trackFunnelStep('step_1_completed', { businessType: formData.businessType, challenge: formData.challenge });
      } catch (error) {
        console.warn('[Discovery Funnel] Step 1 tracking failed:', error);
      }
      setStep(1);
      announce('Moving to step 2: Define your brand personality', 'polite');
    } else if (step === 1) {
      // Instead of opening modal, directly submit and navigate
      handleDirectSubmit();
    }
  };

  const handleDirectSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Track completion attempt
      try {
        trackFunnelStep('discovery_completed', { trustScore, formData });
      } catch (error) {
        console.warn('[Discovery Funnel] Completion tracking failed:', error);
      }
      
      const response = await submitInitialPrompt({
        ...formData,
        trustScore,
        timestamp: new Date().toISOString()
      });

      if (response.success) {
        console.log('[Discovery Funnel] Submission successful:', response);
        announce('Discovery submitted successfully! Redirecting to Spark Layer...', 'polite');
        
        // Navigate directly to Spark Layer
        navigate('/spark-layer');
      } else {
        throw new Error(response.error || 'Submission failed');
      }

    } catch (error) {
      console.error('[Discovery Funnel] Submission failed:', error);
      announce('Submission failed. Please try again.', 'assertive');
      // Show modal as fallback for manual retry
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await submitInitialPrompt({
        ...formData,
        trustScore,
        timestamp: new Date().toISOString()
      });

      if (response.success) {
        console.log('[Discovery Funnel] Modal submission successful:', response);
        announce('Discovery submitted successfully! Redirecting...', 'polite');
        
        setIsModalOpen(false);
        navigate('/spark-layer');
      } else {
        throw new Error(response.error || 'Submission failed');
      }

    } catch (error) {
      console.error('[Discovery Funnel] Modal submission failed:', error);
      announce('Submission failed. Please try again.', 'assertive');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Complete = formData.businessType.trim().length >= 10 && formData.challenge.trim().length >= 15;
  const isStep2Complete = formData.tone.trim().length >= 10 && formData.outcome.trim().length >= 15;

  return (
    <StandardBackground>
      <div id="main-content" className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <PageTitle className="text-white mb-4">Tell Us About Your Vision</PageTitle>
          <BodyText className="text-xl text-white opacity-90 max-w-2xl mx-auto">
            Help us understand your business goals so we can create something truly personalized for you.
          </BodyText>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressIndicator steps={steps} currentStep={step} />
        </div>

        {/* Trust Score Display */}
        {trustScore > 0 && (
          <MobileOptimizedCard className="mb-8" glowEffect>
            <MobileOptimizedCardContent className="p-4 text-center">
              <BodyText className="text-white mb-2">Trust Score: {trustScore}%</BodyText>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-[#36d1fe] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${trustScore}%` }}
                />
              </div>
              <BodyText className="text-white/70 text-sm mt-2">
                {trustScore < 30 && "Add more detail to increase your score"}
                {trustScore >= 30 && trustScore < 60 && "Good progress! More specifics will help"}
                {trustScore >= 60 && trustScore < 85 && "Excellent detail! You're almost ready"}
                {trustScore >= 85 && "Outstanding! Your vision is crystal clear"}
              </BodyText>
            </MobileOptimizedCardContent>
          </MobileOptimizedCard>
        )}

        {/* Form Steps */}
        <MobileOptimizedCard glowEffect>
          <MobileOptimizedCardContent className="p-6 sm:p-8">
            
            {step === 0 && (
              <StandardForm>
                <SectionTitle className="text-white text-center mb-6 flex items-center justify-center gap-2">
                  <Lightbulb className="w-6 h-6" />
                  Tell Us About Your Business
                </SectionTitle>

                <StandardFormGroup>
                  <StandardFormLabel required className="text-white">
                    What type of business are you building?
                  </StandardFormLabel>
                  <StandardFormInput
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    placeholder="e.g., Family bakery specializing in artisan sourdough and pastries"
                    className="text-white placeholder:text-white/50"
                  />
                </StandardFormGroup>

                <StandardFormGroup>
                  <StandardFormLabel required className="text-white">
                    What's your biggest challenge right now?
                  </StandardFormLabel>
                  <StandardFormInput
                    value={formData.challenge}
                    onChange={(e) => handleInputChange('challenge', e.target.value)}
                    placeholder="e.g., Finding loyal customers who appreciate handcrafted quality over mass-produced alternatives"
                    className="text-white placeholder:text-white/50"
                  />
                </StandardFormGroup>

                <div className="flex justify-center mt-8">
                  <EnhancedButton
                    onClick={handleStepComplete}
                    disabled={!isStep1Complete}
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight size={20} />}
                    iconPosition="right"
                  >
                    Continue to Brand Personality
                  </EnhancedButton>
                </div>
              </StandardForm>
            )}

            {step === 1 && (
              <StandardForm>
                <div className="text-center mb-6">
                  <SectionTitle className="text-white flex items-center justify-center gap-2 mb-3">
                    <Palette className="w-6 h-6" />
                    Define Your Brand Personality
                  </SectionTitle>
                  <BodyText className="text-white/80 text-sm">
                    Now let's understand how you want to connect with your audience
                  </BodyText>
                </div>

                <StandardFormGroup>
                  <StandardFormLabel required className="text-white">
                    What tone and personality should represent your brand?
                  </StandardFormLabel>
                  <StandardFormInput
                    value={formData.tone}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    placeholder="e.g., Warm and welcoming like a neighborhood gathering place, with authentic craftsmanship"
                    className="text-white placeholder:text-white/50"
                  />
                </StandardFormGroup>

                <StandardFormGroup>
                  <StandardFormLabel required className="text-white">
                    What specific outcome do you want to achieve for your business?
                  </StandardFormLabel>
                  <StandardFormInput
                    value={formData.outcome}
                    onChange={(e) => handleInputChange('outcome', e.target.value)}
                    placeholder="e.g., Build a community hub where families create memories while supporting local craftsmanship"
                    className="text-white placeholder:text-white/50"
                  />
                </StandardFormGroup>

                <div className="flex justify-center mt-8">
                  <EnhancedButton
                    onClick={handleStepComplete}
                    disabled={!isStep2Complete}
                    loading={isSubmitting}
                    loadingText="Creating your sparks..."
                    variant="primary"
                    size="lg"
                    icon={<Target size={20} />}
                    iconPosition="right"
                  >
                    Generate My Sparks
                  </EnhancedButton>
                </div>
              </StandardForm>
            )}
          </MobileOptimizedCardContent>
        </MobileOptimizedCard>
      </div>

      {/* Fallback Modal - only shows if direct submission fails */}
      <ResponsiveModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ResponsiveModalContent>
          <ResponsiveModalHeader>
            <ResponsiveModalTitle className="text-center flex items-center justify-center gap-2">
              <Clock className="w-6 h-6" />
              Ready to Create Something Amazing?
            </ResponsiveModalTitle>
            <ResponsiveModalDescription className="text-center">
              We've captured your vision with a {trustScore}% trust score. Let's transform it into something extraordinary with CanAI's emotional intelligence.
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>
          
          <div className="flex justify-center mt-6">
            <EnhancedButton
              onClick={handleModalSubmit}
              loading={isSubmitting}
              loadingText="Processing your vision..."
              variant="primary"
              size="lg"
              icon={<ArrowRight size={20} />}
              iconPosition="right"
            >
              Continue to Spark Layer
            </EnhancedButton>
          </div>
        </ResponsiveModalContent>
      </ResponsiveModal>
    </StandardBackground>
  );
};

export default DiscoveryFunnel;
