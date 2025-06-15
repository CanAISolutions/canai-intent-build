
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StandardBackground from '@/components/StandardBackground';
import { PageTitle, SectionTitle, BodyText } from '@/components/StandardTypography';
import { StandardButton } from '@/components/ui/standard-button';
import { StandardForm, StandardFormGroup, StandardFormLabel, StandardFormInput } from '@/components/ui/standard-form';
import { StandardModal, StandardModalContent, StandardModalHeader, StandardModalTitle, StandardModalDescription } from '@/components/ui/standard-modal';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Lightbulb, Heart, Target, Clock } from 'lucide-react';

// API and analytics imports
import { validateInput, submitInitialPrompt } from '@/utils/discoveryFunnelApi';
import { trackPageView, trackFunnelStep, trackTrustScoreUpdate } from '@/utils/analytics';
import { logInteraction } from '@/utils/api';

const DiscoveryFunnel = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
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

  useEffect(() => {
    // Track page view and funnel step
    trackPageView('discovery_funnel');
    trackFunnelStep('discovery_funnel_entered');
    
    // Log interaction
    logInteraction({
      user_id: 'demo-user-id',
      interaction_type: 'page_view',
      interaction_details: {
        page: 'discovery_funnel',
        step: 1,
        timestamp: new Date().toISOString(),
      }
    });
  }, []);

  const handleInputChange = async (field: string, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    // Validate input and update trust score
    try {
      const validation = await validateInput({
        field,
        value,
        context: updatedData
      });

      if (validation.valid) {
        const newTrustScore = Math.min(trustScore + 15, 100);
        setTrustScore(newTrustScore);
        trackTrustScoreUpdate(newTrustScore, field);
      }
    } catch (error) {
      console.error('[Discovery Funnel] Validation failed:', error);
    }
  };

  const handleStepComplete = () => {
    if (step === 1) {
      trackFunnelStep('step_1_completed', { businessType: formData.businessType, challenge: formData.challenge });
      setStep(2);
    } else if (step === 2) {
      trackFunnelStep('step_2_completed', { tone: formData.tone, outcome: formData.outcome });
      setIsModalOpen(true);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      trackFunnelStep('discovery_completed', { trustScore, formData });
      
      const response = await submitInitialPrompt({
        ...formData,
        trustScore,
        timestamp: new Date().toISOString()
      });

      if (response.success) {
        console.log('[Discovery Funnel] Submission successful:', response);
        
        // Navigate to next step
        setTimeout(() => {
          navigate('/spark-layer');
        }, 1500);
      } else {
        throw new Error(response.error || 'Submission failed');
      }

    } catch (error) {
      console.error('[Discovery Funnel] Submission failed:', error);
      setIsSubmitting(false);
    }
  };

  const isStep1Complete = formData.businessType && formData.challenge;
  const isStep2Complete = formData.tone && formData.outcome;

  return (
    <StandardBackground>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <PageTitle className="text-white mb-4">Tell Us About Your Vision</PageTitle>
          <BodyText className="text-xl text-white opacity-90 max-w-2xl mx-auto">
            Help us understand your business goals so we can create something truly personalized for you.
          </BodyText>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-[#36d1fe] text-white' : 'bg-gray-600 text-gray-300'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${step >= 2 ? 'bg-[#36d1fe]' : 'bg-gray-600'}`} />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-[#36d1fe] text-white' : 'bg-gray-600 text-gray-300'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-white opacity-70">
            <span>Your Business</span>
            <span>Your Style</span>
          </div>
        </div>

        {/* Trust Score Display */}
        {trustScore > 0 && (
          <Card className="mb-8 bg-[rgba(25,60,101,0.7)] border-2 border-[#36d1fe]/40">
            <CardContent className="p-4 text-center">
              <BodyText className="text-white mb-2">Trust Score: {trustScore}%</BodyText>
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-[#36d1fe] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${trustScore}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Steps */}
        <Card className="bg-[rgba(25,60,101,0.7)] border-2 border-[#36d1fe]/40 backdrop-blur-md">
          <CardContent className="p-8">
            
            {step === 1 && (
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
                    placeholder="e.g., Family bakery, Tech startup, Consulting firm..."
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
                    placeholder="e.g., Finding customers, Scaling operations, Building brand awareness..."
                    className="text-white placeholder:text-white/50"
                  />
                </StandardFormGroup>

                <div className="flex justify-center mt-8">
                  <StandardButton
                    onClick={handleStepComplete}
                    disabled={!isStep1Complete}
                    variant="primary"
                    size="lg"
                    icon={<ArrowRight size={20} />}
                    iconPosition="right"
                  >
                    Continue
                  </StandardButton>
                </div>
              </StandardForm>
            )}

            {step === 2 && (
              <StandardForm>
                <SectionTitle className="text-white text-center mb-6 flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6" />
                  Define Your Style
                </SectionTitle>

                <StandardFormGroup>
                  <StandardFormLabel required className="text-white">
                    What tone best represents your brand?
                  </StandardFormLabel>
                  <StandardFormInput
                    value={formData.tone}
                    onChange={(e) => handleInputChange('tone', e.target.value)}
                    placeholder="e.g., Warm and welcoming, Professional and trustworthy, Bold and innovative..."
                    className="text-white placeholder:text-white/50"
                  />
                </StandardFormGroup>

                <StandardFormGroup>
                  <StandardFormLabel required className="text-white">
                    What outcome do you want to achieve?
                  </StandardFormLabel>
                  <StandardFormInput
                    value={formData.outcome}
                    onChange={(e) => handleInputChange('outcome', e.target.value)}
                    placeholder="e.g., Build community connections, Increase revenue, Establish market leadership..."
                    className="text-white placeholder:text-white/50"
                  />
                </StandardFormGroup>

                <div className="flex justify-center mt-8">
                  <StandardButton
                    onClick={handleStepComplete}
                    disabled={!isStep2Complete}
                    variant="primary"
                    size="lg"
                    icon={<Target size={20} />}
                    iconPosition="right"
                  >
                    Complete Discovery
                  </StandardButton>
                </div>
              </StandardForm>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Completion Modal */}
      <StandardModal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <StandardModalContent className="bg-[rgba(25,60,101,0.95)] border-2 border-[#36d1fe] backdrop-blur-md">
          <StandardModalHeader>
            <StandardModalTitle className="text-white text-center flex items-center justify-center gap-2">
              <Clock className="w-6 h-6" />
              Ready to Create Something Amazing?
            </StandardModalTitle>
            <StandardModalDescription className="text-white text-center">
              We've captured your vision. Let's transform it into something extraordinary with CanAI's emotional intelligence.
            </StandardModalDescription>
          </StandardModalHeader>
          
          <div className="flex justify-center mt-6">
            <StandardButton
              onClick={handleSubmit}
              loading={isSubmitting}
              loadingText="Processing your vision..."
              variant="primary"
              size="lg"
              icon={<ArrowRight size={20} />}
              iconPosition="right"
            >
              Continue to Spark Layer
            </StandardButton>
          </div>
        </StandardModalContent>
      </StandardModal>
    </StandardBackground>
  );
};

export default DiscoveryFunnel;
