import React, { useState } from "react";
import StandardBackground from "@/components/StandardBackground";
import Hero from "@/components/DiscoveryHook/Hero";
import TrustIndicatorsSection from "@/components/DiscoveryHook/TrustIndicatorsSection";
import ProductCardsSection from "@/components/DiscoveryHook/ProductCardsSection";
import SecondaryCTAs from "@/components/DiscoveryHook/SecondaryCTAs";
import PricingModal from "@/components/PricingModal";
import PreviewModal from "@/components/PreviewModal";
import MemberstackLoginButton from "@/components/DiscoveryHook/MemberstackLoginButton";

// Demo auth logic (customize later)
const useFakeAuth = () => ({ isLoggedIn: true, userName: "Taylor" });

/**
 * TODO: Webflow integration placeholder
 * TODO: PostHog analytics integration placeholder
 * TODO: Make.com automation integration placeholder
 */

const DiscoveryHook = () => {
  const [isPricingOpen, setPricingOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const { isLoggedIn, userName } = useFakeAuth();

  // --- API PLACEHOLDER STUBS ---
  // TODO: GET /v1/messages
  // Example:
  // React.useEffect(() => {
  //   fetch("/v1/messages").then(res => res.json()).then(console.log);
  // }, []);

  // TODO: POST /v1/log-interaction (maps to Supabase: session_logs)
  // Example:
  // function logInteraction(type: string, details?: any) {
  //   fetch("/v1/log-interaction", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ type, ...details })
  //   });
  //   // Supabase: see table `session_logs` for storage
  // }

  // TODO: POST /v1/generate-preview-spark placeholder
  // Example:
  // function generatePreviewSpark(payload: any) {
  //   return fetch("/v1/generate-preview-spark", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload)
  //   });
  // }

  return (
    <StandardBackground>
      {/* Memberstack login button (top right) */}
      <MemberstackLoginButton />

      {/* START: Modal Placeholders */}
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
        {/* TODO: Display API/errors */}
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
      <div
        id="upsell-modal"
        role="dialog"
        aria-modal="true"
        className="hidden fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
      >
        {/* TODO: Upgrade/Upsell integration */}
        <div className="bg-white rounded-xl p-8 shadow-xl text-center w-[350px] max-w-[90vw]">
          <h2 className="text-xl font-bold mb-2 text-canai-dark">Upgrade Your Plan</h2>
          <p className="mb-4 text-canai-dark">Unlock premium features by upgrading now.</p>
          <button
            className="bg-[#00CFFF] text-white font-semibold px-8 py-3 rounded-lg"
            aria-label="Upgrade"
          >
            Upgrade
          </button>
        </div>
      </div>
      {/* END: Modal Placeholders */}
      <main
        className="flex-1 w-full flex flex-col items-center justify-center"
        aria-label="CanAI Emotional Sovereignty Platform Landing"
      >
        {/* HERO */}
        <Hero
          userName={isLoggedIn ? userName : undefined}
          onStart={() => {
            window.location.assign("/discovery-funnel");
          }}
        />
        {/* Trust Indicators */}
        <TrustIndicatorsSection />
        {/* Product Cards (extra spacing for modern look) */}
        <div className="flex flex-col w-full items-center px-2 sm:px-0">
          <ProductCardsSection />
          {/* Secondary CTAs below */}
          <SecondaryCTAs
            onOpenPricing={() => setPricingOpen(true)}
            onOpenPreview={() => setPreviewOpen(true)}
          />
        </div>
        {/* Modals */}
        <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} />
        <PreviewModal isOpen={isPreviewOpen} onClose={() => setPreviewOpen(false)} />
      </main>
    </StandardBackground>
  );
};

export default DiscoveryHook;
