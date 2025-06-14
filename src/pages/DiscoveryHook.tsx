
import React, { useState } from "react";
import PricingModal from "@/components/PricingModal";
import PreviewModal from "@/components/PreviewModal";
import Hero from "@/components/DiscoveryHook/Hero";
import CTAButtons from "@/components/DiscoveryHook/CTAButtons";
import TrustIndicatorsSection from "@/components/DiscoveryHook/TrustIndicatorsSection";
import ProductCardsSection from "@/components/DiscoveryHook/ProductCardsSection";

// Demo auth logic (customize later)
const useFakeAuth = () => ({ isLoggedIn: true, userName: "Taylor" });

const DiscoveryHook = () => {
  const [isPricingOpen, setPricingOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const { isLoggedIn, userName } = useFakeAuth();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1535] via-[#143657] to-[#0A192F] w-full"
      aria-label="CanAI Emotional Sovereignty Platform Landing"
    >
      {/* Hero Section */}
      <Hero userName={isLoggedIn ? userName : undefined} />
      {/* CTAs */}
      <CTAButtons
        onOpenPricing={() => setPricingOpen(true)}
        onOpenPreview={() => setPreviewOpen(true)}
      />
      {/* Trust/Stats */}
      <TrustIndicatorsSection />
      {/* Product Cards */}
      <ProductCardsSection />
      {/* Modals */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} />
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setPreviewOpen(false)} />
    </main>
  );
};

export default DiscoveryHook;
