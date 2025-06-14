
import React, { useState } from "react";
import Hero from "@/components/DiscoveryHook/Hero";
import TrustIndicatorsSection from "@/components/DiscoveryHook/TrustIndicatorsSection";
import ProductCardsSection from "@/components/DiscoveryHook/ProductCardsSection";
import SecondaryCTAs from "@/components/DiscoveryHook/SecondaryCTAs";
import PricingModal from "@/components/PricingModal";
import PreviewModal from "@/components/PreviewModal";

// Demo auth logic (customize later)
const useFakeAuth = () => ({ isLoggedIn: true, userName: "Taylor" });

const DiscoveryHook = () => {
  const [isPricingOpen, setPricingOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const { isLoggedIn, userName } = useFakeAuth();

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{
        background: `radial-gradient(ellipse at 55% 25%, #183957 0%, #0A1535 65%, #061124 100%)`,
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
      {/* Hero with logo, greeting, and main CTA */}
      <Hero
        userName={isLoggedIn ? userName : undefined}
        onStart={() => window.location.assign("/discovery-funnel")}
      />
      {/* Trust Indicators */}
      <TrustIndicatorsSection />
      {/* Product Cards */}
      <ProductCardsSection />
      {/* Secondary CTAs below product cards */}
      <SecondaryCTAs
        onOpenPricing={() => setPricingOpen(true)}
        onOpenPreview={() => setPreviewOpen(true)}
      />
      {/* Modals */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} />
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setPreviewOpen(false)} />
    </main>
  );
};

export default DiscoveryHook;
