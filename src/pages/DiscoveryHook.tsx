
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Target, Zap } from 'lucide-react';
import CanAILogo from '@/components/CanAILogo';
import CanAICube from '@/components/CanAICube';

const DiscoveryHook = () => {
  return (
    <div className="min-h-screen bg-canai-deep flex flex-col">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <CanAILogo size="md" />
      </header>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-canai-light leading-tight">
                  Transform Your{' '}
                  <span className="canai-gradient-text">Business Vision</span>{' '}
                  Into Reality
                </h1>
                
                <p className="text-xl text-canai-light opacity-90 leading-relaxed">
                  Our emotionally intelligent AI understands your unique challenges and creates 
                  personalized strategies that feel authentic to your vision. No generic advice—just 
                  solutions that truly fit your business.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3 canai-card p-4">
                  <Sparkles className="text-canai-primary canai-glow-soft" size={24} />
                  <span className="text-canai-light font-medium">AI-Powered</span>
                </div>
                <div className="flex items-center space-x-3 canai-card p-4">
                  <Target className="text-canai-primary canai-glow-soft" size={24} />
                  <span className="text-canai-light font-medium">Personalized</span>
                </div>
                <div className="flex items-center space-x-3 canai-card p-4">
                  <Zap className="text-canai-primary canai-glow-soft" size={24} />
                  <span className="text-canai-light font-medium">Zero Manual Work</span>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  className="canai-button-primary text-lg px-8 py-4 group"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Button>
                
                <p className="text-sm text-canai-light opacity-70">
                  ✨ Free discovery session • 💡 Instant insights • 🚀 No commitment required
                </p>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="flex justify-center items-center">
              <div className="relative">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-gradient-radial from-canai-primary/20 to-transparent rounded-full blur-3xl scale-150"></div>
                
                {/* 3D Cube */}
                <div className="relative z-10 flex justify-center">
                  <CanAICube size={120} />
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 text-canai-cyan canai-glow-soft">
                  <Sparkles size={32} />
                </div>
                <div className="absolute -bottom-4 -left-4 text-canai-primary canai-glow-soft">
                  <Target size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Indicators */}
      <footer className="container mx-auto px-4 py-8 border-t border-canai-primary/20">
        <div className="text-center space-y-4">
          <p className="text-canai-light opacity-70">
            Trusted by small business owners, solopreneurs, and enterprise teams
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-canai-light opacity-60">
            <span>🔒 Secure & Private</span>
            <span>⚡ Instant Results</span>
            <span>🎯 Emotionally Intelligent</span>
            <span>💎 Premium Quality</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DiscoveryHook;
