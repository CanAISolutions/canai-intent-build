
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
      <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
        <CanAILogo size="xl" />
        
        <div className="space-y-4">
          <BodyText className="text-2xl font-light text-white">
            Welcome to the Emotional Sovereignty Platform
          </BodyText>
          <BodyText className="text-xl opacity-80">
            Experience the future of AI-driven business strategy, designed with 
            emotional intelligence and empathy at its core.
          </BodyText>
        </div>

        <Button 
          onClick={() => navigate('/discovery-hook')}
          size="lg" 
          variant="canai"
          className="text-lg px-8 py-4 group font-manrope"
        >
          Enter CanAI Platform
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </Button>

        <div className="pt-8">
          <CaptionText>
            🚀 9 Seamless Scenes • 🎯 Emotionally Intelligent • ✨ Zero Manual Touch
          </CaptionText>
        </div>
      </div>
    </StandardBackground>
  );
};

export default Index;
