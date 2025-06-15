
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CanAILogo from '@/components/CanAILogo';
import StandardBackground from '@/components/StandardBackground';
import { BodyText, CaptionText } from '@/components/StandardTypography';

const Index = () => {
  const navigate = useNavigate();

  return (
    <StandardBackground className="items-center justify-center">
      <div className="text-center space-y-6 sm:space-y-8 max-w-2xl mx-auto px-4">
        <div className="animate-fade-in animate-logo-breathe">
          <CanAILogo size="xl" />
        </div>
        
        <div className="space-y-4 animate-fade-in animate-delay-200" style={{ animationDelay: '0.2s' }}>
          <BodyText className="text-xl sm:text-2xl font-light text-white enhanced-text-shadow animate-fade-in-up">
            Welcome to the Emotional Sovereignty Platform
          </BodyText>
          <BodyText className="text-lg sm:text-xl opacity-80 enhanced-text-shadow-subtle animate-fade-in-up animate-delay-300">
            Experience the future of AI-driven business strategy, designed with 
            emotional intelligence and empathy at its core.
          </BodyText>
        </div>

        <div className="animate-fade-in animate-delay-400" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={() => navigate('/discovery-hook')}
            size="lg" 
            variant="canai"
            className="
              text-lg px-8 py-4 group font-manrope transition-all duration-200 
              hover:scale-105 hover:shadow-[0_8px_25px_rgba(54,209,254,0.4)]
              hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-[#36d1fe]/60
              focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0F1C]
              enhanced-cta-glow active:scale-[0.98] active:translate-y-0
            "
            aria-label="Enter CanAI Platform - Start your AI-powered business journey"
          >
            Enter CanAI Platform
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={20} />
          </Button>
        </div>

        <div className="pt-6 sm:pt-8 animate-fade-in animate-delay-600" style={{ animationDelay: '0.6s' }}>
          <CaptionText className="enhanced-caption-glow">
            🚀 9 Seamless Scenes • 🎯 Emotionally Intelligent • ✨ Zero Manual Touch
          </CaptionText>
        </div>
      </div>
    </StandardBackground>
  );
};

export default Index;
