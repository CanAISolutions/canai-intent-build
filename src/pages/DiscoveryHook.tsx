import React, { useState } from "react";
import CanAILogo from "@/components/CanAILogo";
import TrustIndicators from "@/components/TrustIndicators";
import PricingModal from "@/components/PricingModal";
import ProductCards from "@/components/ProductCards";
import PreviewModal from "@/components/PreviewModal";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Search } from 'lucide-react';

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
      {/* PHASE 3: Staggered, floating arrangement, organic spacing */}
      <section
        className="
        flex flex-row flex-wrap justify-center items-end 
        gap-x-0 gap-y-0 mt-16 mb-28 w-full max-w-3xl
        backdrop-blur-xl bg-gradient-to-br from-white/10 via-transparent to-canai-blue-card/25
        shadow-[0_6px_36px_#36d1fe36,0_2px_22px_#1e314f55]
        rounded-[2.2rem_1.1rem_2.6rem_1.5rem/1.8rem_2.8rem_1.5rem_2.5rem]
        px-2 py-5
        border-none ring-2 ring-canai-cyan/25
        relative z-20"
        style={{ minHeight: 140 }}
      >
        {/* Phase 3: Each button floats at a slightly different y-pos, x-pos, z, and rotation */}
        <div style={{transform: "translateY(-10px) rotate(-1deg) scale(1.02)", zIndex: 5, position: "relative"}}>
          <Button
            id="ignite-btn"
            variant="canai"
            size="lg"
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-2xl md:rounded-[20px_38px_24px_18px] transition-transform duration-200 hover:scale-110 shadow-[0_4px_36px_#36d1fe5a]"
            style={{boxShadow: "0 8px 48px #36d1fe56, 0 1.5px 8px #00f0ff24"}}
            onClick={() => navigate("/discovery-funnel")}
            aria-label="Ignite Your Journey"
          >
            Ignite Your Journey
          </Button>
        </div>
        <div style={{marginLeft: -18, marginRight: -18, transform: "translateY(24px) rotate(3deg) scale(0.97)", zIndex: 3, position: "relative"}}>
          <Button
            id="pricing-btn"
            variant="canai"
            size="lg"
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-2xl md:rounded-[32px_16px_40px_16px] transition-transform duration-200 hover:scale-105 shadow-[0_4px_28px_#36d1fe51]"
            style={{boxShadow: "0 4px 32px #36d1fe33, 0 1px 6px #00f0ff19"}}
            onClick={() => setPricingOpen(true)}
            aria-haspopup="dialog"
            aria-controls="pricing-modal"
            aria-label="Reveal Pricing"
          >
            Reveal Pricing
          </Button>
        </div>
        <div style={{transform: "translateY(-20px) rotate(-4deg) scale(0.99)", zIndex: 2, position: "relative"}}>
          <Button
            id="sample-btn"
            variant="canai"
            size="lg"
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-3xl md:rounded-[22px_11px_20px_28px] transition-transform duration-200 hover:scale-107 shadow-[0_4px_32px_#36d1fe46]"
            style={{boxShadow: "0 12px 32px #36d1fe29, 0 1.5px 7px #00f0ff18"}}
            onClick={() => navigate("/samples")}
            aria-label="Explore Samples"
          >
            Explore Samples
          </Button>
        </div>
        <div style={{transform: "translateY(14px) rotate(5deg) scale(1.01)", zIndex: 4, position: "relative"}}>
          <Button
            id="preview-btn"
            variant="canai"
            size="lg"
            className="canai-btn-glow canai-btn-ripple focus:canai-focus-glow font-bold rounded-[2.2rem_1.5rem_2.6rem_1.6rem] transition-transform duration-200 hover:scale-105 shadow-[0_4px_44px_#36d1fee3]"
            style={{boxShadow: "0 14px 56px #36d1fee2, 0 2.5px 15px #00f0ff55"}}
            onClick={() => setPreviewOpen(true)}
            aria-haspopup="dialog"
            aria-controls="preview-modal"
            aria-label="Spark for Free"
          >
            Spark for Free
          </Button>
        </div>
        {/* Subtle shimmer/gradient below buttons */}
        <div className="w-full h-12 mt-3 pointer-events-none absolute left-0 right-0 bottom-0">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-t from-[#143657]/85 via-[#36d1fe33] to-transparent opacity-80 rounded-b-[2.5rem_1.2rem] blur-[2px]"></div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      {/* Phase 3: soften borders, more shadow and varied radius/z for depth */}
      <section className="w-full mt-32 mb-20 px-2 relative" style={{zIndex: 11}}>
        <div 
          className="max-w-4xl mx-auto rounded-[2.4rem_2rem_2.6rem_2.6rem/2.3rem_2.7rem_1.5rem_2.7rem] backdrop-blur-2xl bg-gradient-to-br from-white/5 via-[#14365714] to-[#36d1fe1e] shadow-[0_8px_64px_#36d1fe2c,0_0_32px_#00f0ff27] px-4 py-10 border-0 ring-2 ring-canai-cyan/15 transition-all"
          style={{ boxShadow: "0 0 64px 8px #36d1fe22, 0 6px 22px #00f0ff29", zIndex: 11 }}
        >
          <TrustIndicators />
        </div>
        {/* Gradient for soft section transition */}
        <div className="w-full h-12 relative pointer-events-none -mb-2">
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-[#14365799] to-[#143657]/85 opacity-80 rounded-b-3xl blur-[3px]" />
        </div>
      </section>

      {/* PRODUCT CARDS */}
      {/* Phase 3: add subtle varied card heights, positions/rotations/depth */}
      <section className="w-full mt-32 pb-20 relative z-10">
        <div className="max-w-7xl mx-auto px-2 py-10 
            rounded-[2.4rem_1.7rem_2.8rem_2.1rem/2.1rem_2.7rem_1.4rem_2.8rem]
            shadow-[0_10px_52px_#36d1fe24,0_2px_24px_#00f0ff16]
            backdrop-blur-lg bg-gradient-to-br from-white/7 via-[#193c6540] to-[#36d1fe12] relative">
          {/* We'll override the ProductCards layout by layering custom styling/depth via product map children */}
          <div className="grid md:grid-cols-3 gap-14 max-w-6xl mx-auto">
            {[
              {
                key: 0,
                style: { 
                  transform: "translateY(-17px) rotate(-1.5deg) scale(1.01)", 
                  zIndex: 7, 
                  boxShadow: "0 12px 36px #36d1fe44, 0 2px 16px #193c650a"
                }
              },
              {
                key: 1,
                style: { 
                  transform: "translateY(10px) rotate(1.8deg) scale(0.98)", 
                  zIndex: 6, 
                  boxShadow: "0 14px 56px #36d1fe77, 0 1.5px 12px #193c6526"
                }
              },
              {
                key: 2,
                style: { 
                  transform: "translateY(-25px) rotate(-2.1deg) scale(1)", 
                  zIndex: 5, 
                  boxShadow: "0 20px 68px #36d1fea1, 0 3px 22px #193c651d"
                }
              },
            ].map(({ key, style }, idx) => (
              <div key={key} style={{ ...style, position: "relative" }}>
                {/* "Inject" the card by rendering ProductCards' children manually */}
                <ProductCardsCardIndex index={idx} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals (unchanged) */}
      <PricingModal isOpen={isPricingOpen} onClose={() => setPricingOpen(false)} />
      <PreviewModal isOpen={isPreviewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
};

// Helper: inject specific card from ProductCards array for manual arrangement
const productsData = [
  {
    id: 'BUSINESS_BUILDER',
    title: 'Business Plan',
    description: 'Investor-ready strategy in 700–800 words. Confidently attract funding with clear, compelling plans.',
    icon: "FileText",
    href: '/business-builder'
  },
  {
    id: 'SOCIAL_EMAIL',
    title: 'Social Launch Kit',
    description: 'Get 3–7 branded posts and 3–5 high-converting emails. Kickstart your social campaigns painlessly.',
    icon: "MessageSquare",
    href: '/social-email'
  },
  {
    id: 'SITE_AUDIT',
    title: 'Website Audit',
    description: 'Actionable 300–400 word analysis + next steps. Instantly boost your web presence.',
    icon: "Search",
    href: '/site-audit'
  }
];

function ProductCardsCardIndex({index}:{index:number}) {
  const product = productsData[index];
  const navigate = useNavigate();
  const IconComponent =
    product.icon === "FileText" ? FileText :
    product.icon === "MessageSquare" ? MessageSquare : Search;

  return (
    <button
      onClick={() => navigate(product.href)}
      className="group w-full focus:outline-none"
      aria-label={`View details for ${product.title}`}
      tabIndex={0}
      style={{ border: "none", background: "transparent" }}
    >
      <div
        className="canai-product-card relative transition-transform duration-300
          rounded-2xl px-8 py-[52px] shadow-[0_0_38px_rgba(25,60,101,0.18)] hover:scale-105 hover:shadow-[0_0_64px_rgba(25,60,101,0.33)] focus-visible:ring-4 focus-visible:ring-canai-primary"
        style={{
          border: "none",
          background: "var(--canai-blue-card)",
        }}
      >
        <span className="pointer-events-none absolute -inset-1.5 rounded-2xl z-0 group-hover:animate-glow-pop"
          style={{
            boxShadow: '0 0 60px 10px #193c6555, 0 0 0 2px #36d1fe44'
          }}
          aria-hidden
        />
        <div className="flex flex-col items-center space-y-6 relative z-10">
          <div className="canai-card-icon inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#233f66] to-[#193c65] shadow-[0_0_18px_#36d1fe77] mb-2">
            <IconComponent size={28} color="#e6f6ff" strokeWidth={2.2} />
          </div>
          <h3 className="text-xl font-extrabold text-canai-card-title font-manrope tracking-tight" style={{textShadow:"0 0 10px #36d1fe33"}}>
            {product.title}
          </h3>
          <p className="text-canai-light opacity-90 font-manrope text-base text-center" style={{fontWeight:300}}>
            {product.description}
          </p>
          <Button
            tabIndex={-1}
            variant="canai"
            className="w-full max-w-xs mt-6 transition-transform duration-200 group-hover:scale-105 font-bold"
            aria-label={`Learn more about ${product.title}`}
          >
            Learn More
            {/* ... icon ... */}
          </Button>
        </div>
      </div>
    </button>
  );
}

export default DiscoveryHook;
