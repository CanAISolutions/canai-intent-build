
import React, { useState } from "react";
import CanAILogo from "@/components/CanAILogo";
import TrustIndicators from "@/components/TrustIndicators";
import PricingModal from "@/components/PricingModal";
import ProductCards from "@/components/ProductCards";
import PreviewModal from "@/components/PreviewModal";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

// NOTE: Replace this with your real auth check and user name when adding auth!
const useFakeAuth = () => {
  // Fake logged-in state for demo; set to false to revert
  const isLoggedIn = true;
  const userName = "Taylor";
  return { isLoggedIn, userName };
};

const DiscoveryHook = () => {
  const [isPricingOpen, setPricingOpen] = useState(false);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, userName } = useFakeAuth();

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
        <svg width="100%" height="100%" className="absolute inset-0 opacity-60" style={{ mixBlendMode: "screen" }}>
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
                r={Math.random() * 1.8 + 0.6}
                fill="#B4EFFF"
                opacity={Math.random() * 0.30 + 0.18}
              />
            ))}
          </g>
        </svg>
      </div>

      <main
        className="relative z-10 w-full flex flex-col items-center max-w-5xl mx-auto pt-32 pb-20 px-4
        bg-white/10 shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-3xl"
        style={{
          // Remove any visible border and replace with soft shadow and background
          border: "none",
          // Very subtle border only on focus/active/hover - done by class, not inline here
          background:
            "linear-gradient(135deg, rgba(20,54,87,0.10) 80%, rgba(54,209,254,0.12) 100%)",
          boxShadow: "0 6px 36px 0 #0a223377, 0 1.5px 4px #0002"
        }}
        tabIndex={0} // Ensure accessibility/focus styling works
      >
        {/* Logo and Tagline */}
        <CanAILogo size="lg" showTagline />

        {/* Hero Headline & Subtext */}
        <div className="mt-14 mb-12 w-full flex flex-col items-center text-center">
          <h1
            id="hero-headline"
            className="font-manrope font-extrabold tracking-wide animate-text-glow text-canai-luminescent drop-shadow-xl rounded-lg px-6 py-4 bg-gradient-to-br from-cyan-900/60 to-cyan-700/30 backdrop-blur-xl
              shadow-[0_2px_32px_#36d1fe44] ring-2 ring-canai-cyan/40 hover:ring-4 focus:ring-4 ring-offset-2 ring-offset-transparent transition-all duration-200"
            style={{
              fontSize: "clamp(2.8rem,6vw,3.5rem)",
              letterSpacing: "1px",
              lineHeight: 1.08,
              marginBottom: "0.8rem"
            }}
            tabIndex={0}
          >
            {isLoggedIn ? `Welcome back, ${userName}!` : 'Ignite Your Vision with CanAI'}
          </h1>
          <div
            id="hero-subtext"
            className="text-xl sm:text-2xl font-manrope font-semibold text-[#E6F6FF] animate-fade-in shadow-[0_1px_24px_#36d1fe88] drop-shadow-lg"
            style={{
              letterSpacing: "0.01em",
              lineHeight: 1.65,
              maxWidth: "35rem",
              textShadow: "0 0 10px #00F0FFcc, 0 2px 14px #002638cc, 0 0 10px #193c65cc"
            }}
            tabIndex={0}
          >
            Elevate your essence with{" "}
            <span
              className="font-bold"
              style={{
                color: "#E6F6FF",
                filter: "drop-shadow(0 0 8px #36d1fecc)",
                background: "linear-gradient(90deg, #00CFFF 55%, #36d1fe 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 10px #00CFFFcc, 0 2px 16px #002638cc"
              }}
            >
              AI-crafted solutions
            </span>{" "}
            that resonate.
          </div>
        </div>

        {/* Futuristic Button Row */}
        <div className="flex flex-col sm:flex-row gap-8 mt-10 mb-16 w-full max-w-3xl justify-center items-center">
          <Button
            id="ignite-btn"
            variant="canai"
            size="lg"
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow backdrop-blur-md shadow-lg font-bold"
            onClick={() => navigate("/discovery-funnel")}
            aria-label="Ignite Your Journey"
          >
            Ignite Your Journey
          </Button>
          <Button
            id="pricing-btn"
            variant="canai"
            size="lg"
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow backdrop-blur-md shadow-lg font-bold"
            onClick={() => setPricingOpen(true)}
            aria-haspopup="dialog"
            aria-controls="pricing-modal"
            aria-label="Reveal Pricing"
          >
            Reveal Pricing
          </Button>
          <Button
            id="sample-btn"
            variant="canai"
            size="lg"
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow backdrop-blur-md shadow-lg font-bold"
            onClick={() => navigate("/samples")}
            aria-label="Explore Samples"
          >
            Explore Samples
          </Button>
          <Button
            id="preview-btn"
            variant="canai"
            size="lg"
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow backdrop-blur-md shadow-lg font-bold"
            onClick={() => setPreviewOpen(true)}
            aria-haspopup="dialog"
            aria-controls="preview-modal"
            aria-label="Spark for Free"
          >
            Spark for Free
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

