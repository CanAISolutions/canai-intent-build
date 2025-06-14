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
        background: "radial-gradient(ellipse at 50% 38%, #143657 0%, #071727 100%)"
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

      {/* FIRST SECTION - Logo, Headline, Subtext */}
      {/* Apply organic Fibonacci spacing: pt-20, mt-8, etc. */}
      <section className="w-full flex flex-col items-center pt-20" style={{zIndex:2}}>
        <div className="flex flex-col items-center" style={{marginTop: '-2.5rem'}}>
          <div className="shadow-[0_0_36px_#36d1fe33] rounded-full px-3 py-1 bg-white/5 backdrop-blur-xl mb-1">
            <CanAILogo size="lg" showTagline />
          </div>
        </div>
        <div className="mt-8 mb-13 w-full flex flex-col items-center text-center">
          <h1
            id="hero-headline"
            className="
              font-manrope font-extrabold tracking-wide animate-text-glow text-canai-luminescent drop-shadow-xl 
              rounded-[2rem] px-4 py-4 bg-gradient-to-br from-cyan-900/60 to-cyan-700/20
              shadow-[0_2px_32px_#36d1fe26] ring-2 ring-canai-cyan/30 hover:ring-4 focus:ring-4 ring-offset-4 ring-offset-transparent 
              transition-all duration-200
              backdrop-blur-2xl
            "
            style={{
              fontSize: "clamp(2.8rem,6vw,3.5rem)",
              letterSpacing: "1px",
              lineHeight: 1.08,
              marginBottom: "0.8rem",
              border: "none",
              background: "linear-gradient(135deg, rgba(0,207,255,0.10), rgba(54,209,254,0.07))"
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
        {/* Gradient transition shimmer bottom */}
        <div className="w-full h-12 flex-shrink-0 pointer-events-none -mb-2 relative z-10">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent to-[#143657]/80 opacity-80"></div>
        </div>
      </section>

      {/* ORGANIC BUTTON GROUP - less blocky/rigid: even spacing & staggered grouping */}
      <section
        className="
          flex flex-wrap justify-center items-center gap-y-8 gap-x-10 mt-8 mb-20 w-full max-w-3xl
          rounded-[2rem]
          bg-gradient-to-br from-white/5 via-transparent to-canai-blue-card/30
          shadow-[0_2px_18px_#36d1fe23]
          px-4 py-3
          "
        style={{border: "none", zIndex: 2}}
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
        {/* Subtle layer gradient shimmer below buttons */}
        <div className="w-full h-8 mt-4 pointer-events-none relative col-span-full">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-[#143657]/80 to-transparent opacity-70"></div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      {/* Fibonacci natural spacing: mt-14 */}
      <section className="w-full mt-14 mb-9 px-2 relative z-10">
        <TrustIndicators />
        {/* Transition gradient overlay for flow to next section */}
        <div className="w-full h-10 relative pointer-events-none -mb-2">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent to-[#143657]/85 opacity-75" />
        </div>
      </section>

      {/* PRODUCT CARDS - more breathing room */}
      <section className="w-full mt-16 pb-20 relative z-10">
        <ProductCards />
      </section>

      {/* Modals (unchanged) */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} />
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
};

export default DiscoveryHook;
