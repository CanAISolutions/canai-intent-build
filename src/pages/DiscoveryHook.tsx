
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, X, ExternalLink } from 'lucide-react';
import CanAILogo from '@/components/CanAILogo';
import CanAICube from '@/components/CanAICube';
import PricingModal from '@/components/PricingModal';
import PreviewModal from '@/components/PreviewModal';
import ProductCards from '@/components/ProductCards';
import TrustIndicators from '@/components/TrustIndicators';

const DiscoveryHook = () => {
  const navigate = useNavigate();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  const handleBeginJourney = () => {
    navigate('/discovery-funnel');
  };

  const handleViewPricing = () => {
    setIsPricingModalOpen(true);
  };

  const handleSeeSample = () => {
    navigate('/samples');
  };

  const handleTryFreeSpark = () => {
    setIsPreviewModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-canai-deep">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <CanAILogo size="md" />
      </header>

      {/* Hero Section */}
      <section className="hero-section bg-gradient-to-br from-canai-primary/20 to-canai-gradient/20 py-20">
        <div className="container mx-auto px-20 text-center relative">
          {/* Background Cube */}
          <div className="absolute inset-0 flex justify-center items-center opacity-10">
            <CanAICube size={200} />
          </div>
          
          <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
            <h1 
              id="hero-headline" 
              className="text-5xl font-bold text-canai-light leading-tight"
              style={{ fontFamily: 'Manrope', fontWeight: 700 }}
            >
              Unlock Your Vision with CanAI
            </h1>
            
            <p 
              id="hero-subtext"
              className="text-xl text-canai-light opacity-90"
              style={{ fontFamily: 'Manrope', fontWeight: 200 }}
            >
              Craft solutions that feel like you, elevated.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-6 pt-8">
              <Button 
                id="begin-btn"
                onClick={handleBeginJourney}
                size="lg" 
                className="canai-button-primary text-lg px-8 py-4 group"
              >
                Begin Your Journey
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Button>
              
              <Button 
                id="pricing-btn"
                onClick={handleViewPricing}
                variant="outline"
                size="lg" 
                className="border-canai-primary text-canai-primary hover:bg-canai-primary hover:text-canai-deep px-8 py-4"
              >
                View Pricing
              </Button>
              
              <Button 
                id="sample-btn"
                onClick={handleSeeSample}
                variant="outline"
                size="lg" 
                className="border-canai-cyan text-canai-cyan hover:bg-canai-cyan hover:text-canai-deep px-8 py-4"
              >
                See a Sample
                <ExternalLink className="ml-2" size={18} />
              </Button>
              
              <Button 
                id="preview-btn"
                onClick={handleTryFreeSpark}
                variant="ghost"
                size="lg" 
                className="text-canai-light hover:bg-canai-primary/20 border border-canai-light/30 px-8 py-4"
              >
                Try a Free Spark
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <TrustIndicators />

      {/* Product Cards */}
      <ProductCards />

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 text-center">
        <p className="text-canai-light opacity-60 text-sm">
          🚀 Emotionally Intelligent • 🎯 Zero Manual Touch • ✨ Trusted by 500+ Businesses
        </p>
      </footer>

      {/* Modals */}
      <PricingModal 
        isOpen={isPricingModalOpen} 
        onClose={() => setIsPricingModalOpen(false)} 
      />
      <PreviewModal 
        isOpen={isPreviewModalOpen} 
        onClose={() => setIsPreviewModalOpen(false)} 
      />
    </div>
  );
};

export default DiscoveryHook;
