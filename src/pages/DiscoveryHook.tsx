import React, { useState } from "react";
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
    <>
      {/* Memberstack login button (top right) */}
      {/* TODO: Memberstack real integration (see src/components/DiscoveryHook/MemberstackLoginButton.tsx) */}
      <MemberstackLoginButton />

      {/* START: Modal Placeholders */}
      <div
        id="login-modal"
        role="dialog"
        aria-modal="true"
        className="hidden fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        data-component="login-modal"
      >
        {/* TODO: Memberstack integration */}
        <div className="bg-white rounded-xl p-8 shadow-xl text-center w-[350px] max-w-[90vw]">
          <h2 className="text-xl font-bold mb-2 text-canai-dark">Login Required</h2>
          <p className="mb-4 text-canai-dark">Please log in to continue.</p>
          <button
            className="bg-[#00CFFF] text-white font-semibold px-8 py-3 rounded-lg"
            aria-label="Log In"
            // TODO: Connect this to Memberstack
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
        className="min-h-screen w-full flex flex-col items-center justify-center"
        style={{
          background: `radial-gradient(ellipse at 55% 24%, #152647 0%, #091023 65%, #052947 100%)`,
          backgroundColor: "#0A1535",
          position: "relative",
          overflow: "hidden",
        }}
        aria-label="CanAI Emotional Sovereignty Platform Landing"
      >
        {/* Subtle starfield overlay (SVG for cosmic feel) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60" style={{zIndex:0}} viewBox="0 0 1920 1080" preserveAspectRatio="none">
          <defs>
            <radialGradient id="spotlight" cx="55%" cy="25%" r="0.7">
              <stop offset="0%" stopColor="#36d1fe22" />
              <stop offset="70%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#spotlight)" />
          {/* Random subtle twinkling stars */}
          <g>
            <circle cx="220" cy="180" r="1.2" fill="#e6f6ff" opacity="0.08"/>
            <circle cx="430" cy="400" r="1.6" fill="#36d1fe" opacity="0.11"/>
            <circle cx="1520" cy="250" r="1" fill="#e6f6ff" opacity="0.08"/>
            <circle cx="770" cy="850" r="0.7" fill="#00f0ff" opacity="0.09"/>
            <circle cx="1430" cy="960" r="1.4" fill="#e6f6ff" opacity="0.07"/>
            <circle cx="1190" cy="780" r="1.1" fill="#36d1fe" opacity="0.13"/>
          </g>
        </svg>
        {/* HERO */}
        <Hero
          userName={isLoggedIn ? userName : undefined}
          onStart={() => {
            // TODO: Interaction logging, see POST /v1/log-interaction, Supabase session_logs
            // logInteraction('start_journey');
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
    </>
  );
};

export default DiscoveryHook;
