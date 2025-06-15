
import React, { useState, useEffect } from "react";
import StandardBackground from "@/components/StandardBackground";
import EnhancedHero from "@/components/DiscoveryHook/EnhancedHero";
import PsychologicalTrustIndicators from "@/components/DiscoveryHook/PsychologicalTrustIndicators";
import ProductCardsSection from "@/components/DiscoveryHook/ProductCardsSection";
import EnhancedSecondaryCTAs from "@/components/DiscoveryHook/EnhancedSecondaryCTAs";
import PricingModal from "@/components/PricingModal";
import PreviewModal from "@/components/PreviewModal";
import MemberstackLoginButton from "@/components/DiscoveryHook/MemberstackLoginButton";

// Import API and analytics utilities
import { getMessages, logInteraction } from "@/utils/api";
import { trackPageView, trackFunnelStep, trackPricingView, trackPreviewView } from "@/utils/analytics";

// Demo auth logic (customize later)
const useFakeAuth = () => ({ isLoggedIn: true, userName: "Taylor" });

const DiscoveryHook = () => {
  const [isPricingOpen, setPricingOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const [loadTime, setLoadTime] = useState<number>(0);
  const { isLoggedIn, userName } = useFakeAuth();

  // Performance tracking
  useEffect(() => {
    const startTime = performance.now();
    
    const initializePage = async () => {
      try {
        // Track page view
        trackPageView('discovery_hook');
        trackFunnelStep('landing', { user_type: isLoggedIn ? 'returning' : 'new' });

        // Load initial messages
        const messages = await getMessages();
        console.log('[Discovery Hook] Messages loaded:', messages);

        // Log page interaction
        await logInteraction({
          user_id: isLoggedIn ? 'demo-user-id' : undefined,
          interaction_type: 'page_view',
          interaction_details: {
            page: 'discovery_hook',
            user_type: isLoggedIn ? 'returning' : 'new',
            timestamp: new Date().toISOString(),
          }
        });

        // Calculate load time
        const endTime = performance.now();
        const loadDuration = endTime - startTime;
        setLoadTime(loadDuration);
        
        console.log(`[Performance] Discovery Hook loaded in ${loadDuration.toFixed(2)}ms`);
        
        // Performance target: <1.5s (1500ms)
        if (loadDuration > 1500) {
          console.warn('[Performance] Page load exceeded 1.5s target:', loadDuration);
        }

      } catch (error) {
        console.error('[Discovery Hook] Initialization failed:', error);
        
        // F1-E1: Fallback to localStorage
        try {
          const fallbackData = {
            user_type: isLoggedIn ? 'returning' : 'new',
            timestamp: new Date().toISOString(),
            fallback_reason: 'api_failure'
          };
          localStorage.setItem('canai_discovery_fallback', JSON.stringify(fallbackData));
          console.log('[F1-E1] Fallback data saved to localStorage');
        } catch (storageError) {
          console.error('[F1-E1] localStorage fallback failed:', storageError);
        }
      }
    };

    initializePage();
  }, [isLoggedIn]);

  const handlePricingOpen = () => {
    trackPricingView('secondary_cta');
    trackFunnelStep('pricing_viewed');
    setPricingOpen(true);
  };

  const handlePreviewOpen = () => {
    trackPreviewView('spark_preview');
    trackFunnelStep('preview_viewed');
    setPreviewOpen(true);
  };

  const handleStart = () => {
    trackFunnelStep('begin_journey', { source: 'hero_cta' });
    
    // Log interaction
    logInteraction({
      user_id: isLoggedIn ? 'demo-user-id' : undefined,
      interaction_type: 'cta_clicked',
      interaction_details: {
        cta_type: 'begin_journey',
        source: 'hero',
        user_type: isLoggedIn ? 'returning' : 'new',
      }
    });

    window.location.assign("/discovery-funnel");
  };

  return (
    <StandardBackground>
      {/* Memberstack login button (top right) */}
      <MemberstackLoginButton />

      {/* Modal Placeholders for Error Handling */}
      <div
        id="login-modal"
        role="dialog"
        aria-modal="true"
        className="hidden fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        data-component="login-modal"
      >
        <div className="bg-white rounded-xl p-8 shadow-xl text-center w-[350px] max-w-[90vw]">
          <h2 className="text-xl font-bold mb-2 text-canai-dark">Login Required</h2>
          <p className="mb-4 text-canai-dark">Please log in to continue.</p>
          <button
            className="bg-[#00CFFF] text-white font-semibold px-8 py-3 rounded-lg"
            aria-label="Log In"
          >
            Log In
          </button>
        </div>
      </div>

      <div
        id="error-modal"
        role="alertdialog"
        aria-modal="true"
        className="hidden fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      >
        <div className="bg-white rounded-xl p-8 shadow-xl text-center w-[350px] max-w-[90vw]">
          <h2 className="text-xl font-bold mb-2 text-canai-red">Something Went Wrong</h2>
          <p className="mb-4 text-canai-dark">An error occurred. Please try again later.</p>
          <button
            className="bg-[#00CFFF] text-white font-semibold px-8 py-3 rounded-lg"
            aria-label="Dismiss"
          >
            Dismiss
          </button>
        </div>
      </div>

      <main
        className="flex-1 w-full flex flex-col items-center justify-center"
        aria-label="CanAI Emotional Sovereignty Platform Landing"
      >
        {/* Enhanced HERO */}
        <EnhancedHero
          userName={isLoggedIn ? userName : undefined}
          onStart={handleStart}
        />
        
        {/* Psychological Trust Indicators */}
        <PsychologicalTrustIndicators />
        
        {/* Product Cards */}
        <div className="flex flex-col w-full items-center px-2 sm:px-0">
          <ProductCardsSection />
          
          {/* Enhanced Secondary CTAs */}
          <EnhancedSecondaryCTAs
            onOpenPricing={handlePricingOpen}
            onOpenPreview={handlePreviewOpen}
          />
        </div>
        
        {/* Modals */}
        <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} />
        <PreviewModal isOpen={isPreviewOpen} onClose={() => setPreviewOpen(false)} />
      </main>

      {/* Performance Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && loadTime > 0 && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-2 rounded text-xs">
          Load Time: {loadTime.toFixed(2)}ms
          {loadTime > 1500 && <span className="text-red-400"> (⚠️ &gt;1.5s)</span>}
        </div>
      )}
    </StandardBackground>
  );
};

export default DiscoveryHook;
