import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CanAILogo from '@/components/CanAILogo';
const Index = () => {
  const navigate = useNavigate();
  return <div className="min-h-screen bg-canai-deep flex items-center justify-center">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-4">
        <CanAILogo size="xl" />
        
        <div className="space-y-4">
          <h2 className="text-2xl text-canai-light font-light">
            Welcome to the Emotional Sovereignty Platform
          </h2>
          <p className="text-canai-light opacity-80 text-lg">
            Experience the future of AI-driven business strategy, designed with 
            emotional intelligence and empathy at its core.
          </p>
        </div>

        <Button onClick={() => navigate('/discovery-hook')} size="lg" className="canai-button-primary text-lg px-8 py-4 group">
          Enter CanAI Platform
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </Button>

        <div className="pt-8 text-sm text-canai-light opacity-60">
          
        </div>
      </div>
    </div>;
};
export default Index;