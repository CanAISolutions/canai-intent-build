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
      {/* More floating, glassy/organic: extra shadow and soft-glow, backdrop blur */}
      <section
        className="w-full flex flex-col items-center pt-20"
        style={{ zIndex: 2 }}
      >
        <div
          className="flex flex-col items-center"
          style={{ marginTop: '-2.5rem' }}
        >
          <div className="backdrop-blur-xl shadow-[0_0_48px_16px_#36d1fe33,0_2px_32px_#36d1fe40] rounded-[36px_20px_44px_30px] px-5 py-2 bg-white/7 mb-2 border-none ring-0 transition-all duration-300">
            <CanAILogo size="lg" showTagline />
          </div>
        </div>
        <div className="mt-8 mb-13 w-full flex flex-col items-center text-center">
          <h1
            id="hero-headline"
            className="
              font-manrope font-extrabold tracking-wide animate-text-glow text-canai-luminescent drop-shadow-xl 
              rounded-[1.8rem_2.4rem_2rem_1.4rem] px-6 py-5
              shadow-[0_4px_64px_#36d1fe44,0_2px_44px_#00f0ff33]
              bg-gradient-to-br from-cyan-900/60 to-cyan-700/15
              ring-2 ring-canai-cyan/40 hover:ring-4 focus:ring-4 ring-offset-4 ring-offset-transparent 
              transition-all duration-200
              backdrop-blur-2xl
            "
            style={{
              fontSize: "clamp(2.8rem,6vw,3.5rem)",
              letterSpacing: "1px",
              lineHeight: 1.08,
              marginBottom: "0.8rem",
              border: "none",
              background: "linear-gradient(135deg, rgba(0,207,255,0.07), rgba(54,209,254,0.11))"
            }}
            tabIndex={0}
          >
            {isLoggedIn ? `Welcome back, ${userName}!` : 'Ignite Your Vision with CanAI'}
          </h1>
          <div
            id="hero-subtext"
            className="text-xl sm:text-2xl font-manrope font-semibold text-[#E6F6FF] animate-fade-in
            drop-shadow-lg rounded-[1.6rem_1.1rem_2rem_2.7rem] backdrop-blur-[6px]
            bg-white/5 px-4 py-3 mx-auto"
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
        <div className="w-full h-14 flex-shrink-0 pointer-events-none -mb-2 relative z-10">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-[#143657CC] to-[#143657]/80 opacity-90"></div>
        </div>
      </section>

      {/* ORGANIC BUTTON GROUP */}
      <section
        className="
        flex flex-wrap justify-center items-center gap-y-8 gap-x-10 mt-10 mb-20 w-full max-w-3xl
        backdrop-blur-xl bg-gradient-to-br from-white/10 via-transparent to-canai-blue-card/25
        shadow-[0_6px_36px_#36d1fe36,0_2px_22px_#1e314f55]
        rounded-[2.2rem_1.1rem_2.6rem_1.5rem/1.8rem_2.8rem_1.5rem_2.5rem]
        px-5 py-5
        border-none ring-2 ring-canai-cyan/25
        "
        style={{ zIndex: 2 }}
      >
        <Button
          id="ignite-btn"
          variant="canai"
          size="lg"
          className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-2xl md:rounded-[20px_38px_24px_18px] transition-transform duration-200 hover:scale-105 shadow-[0_4px_32px_#36d1fe33]"
          onClick={() => navigate("/discovery-funnel")}
          aria-label="Ignite Your Journey"
        >
          Ignite Your Journey
        </Button>
        <Button
          id="pricing-btn"
          variant="canai"
          size="lg"
          className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-2xl md:rounded-[32px_16px_40px_16px] transition-transform duration-200 hover:scale-105 shadow-[0_4px_32px_#36d1fe33]"
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
          className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-3xl md:rounded-[22px_11px_20px_28px] transition-transform duration-200 hover:scale-105 shadow-[0_4px_32px_#36d1fe33]"
          onClick={() => navigate("/samples")}
          aria-label="Explore Samples"
        >
          Explore Samples
        </Button>
        <Button
          id="preview-btn"
          variant="canai"
          size="lg"
          className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-[2.2rem_1.5rem_2.6rem_1.6rem] transition-transform duration-200 hover:scale-105 shadow-[0_4px_32px_#36d1fe33]"
          onClick={() => setPreviewOpen(true)}
          aria-haspopup="dialog"
          aria-controls="preview-modal"
          aria-label="Spark for Free"
        >
          Spark for Free
        </Button>
        {/* Subtle shimmer/gradient below buttons */}
        <div className="w-full h-10 mt-4 pointer-events-none relative col-span-full">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-[#143657]/85 via-[#36d1fe33] to-transparent opacity-80 rounded-b-[2.5rem_1.2rem] blur-[2px]"></div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="w-full mt-20 mb-12 px-2 relative z-10">
        <div className="max-w-4xl mx-auto rounded-[2.4rem_2.4rem_1.6rem_2.9rem/2.5rem_2.7rem_1.2rem_3rem] backdrop-blur-xl bg-gradient-to-br from-white/7 via-[#14365714] to-[#36d1fe1e] shadow-[0_2px_28px_#36d1fe1d,0_0_16px_#00f0ff33] px-4 py-8">
          <TrustIndicators />
        </div>
        {/* Gradient for soft section transition */}
        <div className="w-full h-10 relative pointer-events-none -mb-2">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-[#14365799] to-[#143657]/85 opacity-80 rounded-b-3xl blur-[2px]" />
        </div>
      </section>

      {/* PRODUCT CARDS */}
      <section className="w-full mt-20 pb-20 relative z-10">
        {/* Add backdrop-blur and glow for section base */}
        <div className="max-w-7xl mx-auto px-2 py-10 
            rounded-[2.4rem_1.7rem_2.8rem_2.1rem/2.1rem_2.7rem_1.4rem_2.8rem]
            shadow-[0_6px_42px_#36d1fe24,0_2px_22px_#00f0ff1a]
            backdrop-blur-lg bg-gradient-to-br from-white/6 via-[#193c6540] to-[#36d1fe12]">
          <ProductCards />
        </div>
      </section>

      {/* Modals (unchanged) */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} />
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
};

export default DiscoveryHook;
