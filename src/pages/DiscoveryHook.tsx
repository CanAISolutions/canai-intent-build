
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

      {/* Remove "block" panel by letting content float and layering subtle glows instead */}
      <main
        className="
          relative z-10 w-full flex flex-col items-center max-w-5xl mx-auto 
          pt-32 pb-20 px-2 sm:px-6 
          rounded-[3rem] sm:rounded-[2.5rem] 
          shadow-[0_8px_56px_0_#36d1fe26] 
          transition-shadow duration-500 
        "
        style={{
          background: "linear-gradient(140deg,rgba(23,43,71,0.82)_68%,rgba(36,209,254,0.10)_100%)",
          boxShadow: "0 18px 56px 0 #36d1fea8, 0 1.5px 4px #0002" // so soft, not intrusive!
        }}
        tabIndex={0}
      >
        {/* Logo and Tagline - float up visually, organic */}
        <div className="w-full flex flex-col items-center" style={{marginTop: '-2.5rem'}}>
          <div className="shadow-[0_0_36px_#36d1fe33] rounded-full px-3 py-1 bg-white/5 backdrop-blur-xl mb-1">
            <CanAILogo size="lg" showTagline />
          </div>
        </div>

        {/* Hero Headline & Subtext with more organic spacing */}
        <div className="mt-10 mb-12 w-full flex flex-col items-center text-center">
          <h1
            id="hero-headline"
            className="
              font-manrope font-extrabold tracking-wide animate-text-glow text-canai-luminescent drop-shadow-xl 
              rounded-[2rem] px-6 py-4 bg-gradient-to-br from-cyan-900/60 to-cyan-700/20
              shadow-[0_2px_32px_#36d1fe26] ring-2 ring-canai-cyan/30 hover:ring-4 focus:ring-4 ring-offset-4 ring-offset-transparent 
              transition-all duration-200
              backdrop-blur-2xl
            "
            style={{
              fontSize: "clamp(2.8rem,6vw,3.5rem)",
              letterSpacing: "1px",
              lineHeight: 1.08,
              marginBottom: "0.8rem",
              border: "none"
            }}
            tabIndex={0}
          >
            {isLoggedIn ? `Welcome back, ${userName}!` : 'Ignite Your Vision with CanAI'}
          </h1>
          <div
            id="hero-subtext"
            className="text-xl sm:text-2xl font-manrope font-semibold text-[#E6F6FF] animate-fade-in shadow-[0_1px_24px_#36d1fe55] drop-shadow-lg"
            style={{
              letterSpacing: "0.01em",
              lineHeight: 1.65,
              maxWidth: "37rem",
              textShadow: "0 0 10px #00F0FFcc, 0 2px 14px #002638cc, 0 0 10px #193c65cc",
              opacity: 0.97,
              filter: "drop-shadow(0 5px 22px #36d1fe22)"
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

        {/* Curved, organic button row with natural gap, no hard grouping */}
        <div
          className="
            flex flex-wrap sm:flex-row gap-6 sm:gap-8 mt-8 mb-16 w-full max-w-3xl justify-center items-center
            rounded-[2rem] p-3 sm:p-4
            bg-gradient-to-br from-white/5 to-canai-blue-card/30 blur-0
            shadow-[0_2px_18px_#36d1fe33]
          "
          style={{border: 'none'}}
        >
          <Button
            id="ignite-btn"
            variant="canai"
            size="lg"
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-xl transition-transform duration-200 hover:scale-105"
            onClick={() => navigate("/discovery-funnel")}
            aria-label="Ignite Your Journey"
          >
            Ignite Your Journey
          </Button>
          <Button
            id="pricing-btn"
            variant="canai"
            size="lg"
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-xl transition-transform duration-200 hover:scale-105"
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
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-xl transition-transform duration-200 hover:scale-105"
            onClick={() => navigate("/samples")}
            aria-label="Explore Samples"
          >
            Explore Samples
          </Button>
          <Button
            id="preview-btn"
            variant="canai"
            size="lg"
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-xl transition-transform duration-200 hover:scale-105"
            onClick={() => setPreviewOpen(true)}
            aria-haspopup="dialog"
            aria-controls="preview-modal"
            aria-label="Spark for Free"
          >
            Spark for Free
          </Button>
        </div>

        {/* Trust Indicators */}
        <div className="w-full mt-8 mb-6">
          <TrustIndicators />
        </div>

        {/* Product Cards - extra breathing room, less blocky paddings */}
        <div className="w-full mt-8">
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
