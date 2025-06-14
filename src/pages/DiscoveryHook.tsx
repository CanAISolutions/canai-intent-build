
import React, { useState } from "react";
import CanAILogo from "@/components/CanAILogo";
import TrustIndicators from "@/components/TrustIndicators";
import PricingModal from "@/components/PricingModal";
import ProductCards from "@/components/ProductCards";
import PreviewModal from "@/components/PreviewModal";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const DiscoveryHook = () => {
  const [isPricingOpen, setPricingOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center overflow-hidden relative"
      style={{
        background: "radial-gradient(ellipse at 50% 38%, #143657 0%, #071727 100%)",
      }}
      aria-label="CanAI Emotional Sovereignty Platform Landing"
    >
      {/* Cosmic star dots */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="absolute inset-0 opacity-50" style={{ mixBlendMode: "screen" }}>
          <defs>
            <radialGradient id="star" r="60%" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#36d1fe" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#071727" stopOpacity="0.00" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#star)" />
          <g>
            {Array.from({ length: 40 }).map((_, i) => (
              <circle
                key={i}
                cx={`${Math.random() * 100}%`}
                cy={`${Math.random() * 100}%`}
                r={Math.random() * 1.22 + 0.35}
                fill="#B4EFFF"
                opacity={Math.random() * 0.24 + 0.13}
              />
            ))}
          </g>
        </svg>
      </div>

      <main className="relative z-10 w-full flex flex-col items-center max-w-5xl mx-auto pt-32 pb-20 px-4">
        {/* Logo and Tagline */}
        <CanAILogo size="lg" showTagline />

        {/* Button Row */}
        <div className="flex flex-col sm:flex-row gap-7 mt-14 mb-14 w-full max-w-3xl justify-center items-center">
          <Button
            id="begin-btn"
            variant="canai"
            className="drop-shadow-xl"
            onClick={() => navigate("/discovery-funnel")}
            aria-label="Begin Your Journey"
          >
            Begin Your Journey
          </Button>
          <Button
            id="pricing-btn"
            variant="canai"
            className="drop-shadow-xl"
            onClick={() => setPricingOpen(true)}
            aria-haspopup="dialog"
            aria-controls="pricing-modal"
          >
            View Pricing
          </Button>
          <Button
            id="sample-btn"
            variant="canai"
            className="drop-shadow-xl"
            onClick={() => navigate("/samples")}
            aria-label="See a Sample"
          >
            See a Sample
          </Button>
          <Button
            id="preview-btn"
            variant="canai"
            className="drop-shadow-xl"
            onClick={() => setPreviewOpen(true)}
            aria-haspopup="dialog"
            aria-controls="preview-modal"
          >
            Try a Free Spark
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="w-full mt-6">
          <TrustIndicators />
        </div>

        {/* Product Cards */}
        <div className="w-full mt-10">
          <ProductCards />
        </div>
      </main>

      {/* Pricing Modal */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} />

      {/* Preview Modal */}
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
};

export default DiscoveryHook;

