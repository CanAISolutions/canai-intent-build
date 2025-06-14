
import React, { useState } from "react";

// Utility placeholder for typing animation
const Typing = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block animate-typing whitespace-nowrap overflow-hidden">{children}</span>
);

const DiscoveryHook = () => {
  const [showLogin, setShowLogin] = useState(false);
  // Demo auth logic (customize later)
  const isLoggedIn = false;
  const userName = "Taylor";

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-[#0A0F1C] to-[#00B2E3]">
      <div className="max-w-7xl mx-auto px-0 py-20 sm:py-5">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center mb-12">
          <h1
            id="hero-headline"
            className="text-[40px] font-[800] font-manrope text-[#E6F6FF] animate-fade-in duration-200"
          >
            Welcome back, {isLoggedIn ? userName : "Founder"}!
          </h1>
          <p
            id="hero-subtext"
            className="text-base font-[400] font-manrope text-[#E6F6FF] mt-4 animate-typing duration-2000"
          >
            <Typing>Elevate your essence with AI-crafted solutions...</Typing>
          </p>
          <a
            id="begin-cta"
            className="cta-button font-[600] text-[16px] font-manrope bg-[#00CFFF] text-[#fff] px-[18px] py-[18px] rounded-lg mt-8 hover:bg-[#00F0FF] inline-block min-h-[44px] focus-visible:ring-4 focus-visible:ring-canai-cyan transition"
            aria-label="Begin your CanAI journey"
            href="/discovery-funnel"
          >
            Begin Your Journey
          </a>
        </section>
        {/* Trust Indicators */}
        <div
          id="trust-indicators"
          className="w-grid grid grid-cols-1 md:grid-cols-3 gap-4 text-[#E6F6FF] animate-fade-in duration-200 mb-10"
        >
          <div className="bg-[#14365719] rounded-xl px-5 py-6 shadow-sm">
            “CanAI launched my bakery!” – Jane
          </div>
          <div className="bg-[#14365719] rounded-xl px-5 py-6 shadow-sm">
            <span className="text-2xl font-bold">600+</span> Plans Created
          </div>
          <div className="bg-[#14365719] rounded-xl px-5 py-6 shadow-sm">
            <span className="text-2xl font-bold">98%</span> Success Uplift
          </div>
        </div>
        {/* Product Cards */}
        <div
          id="product-cards"
          className="w-grid grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
        >
          <div className="business-plan bg-white/10 rounded-lg p-8 flex flex-col items-center">
            <h3 className="font-bold text-lg text-[#00CFFF] mb-4">Business Plan</h3>
            <a className="learn-more underline font-semibold text-[#00CFFF]" href="/business-builder">
              Learn More
            </a>
          </div>
          <div className="social-launch-kit bg-white/10 rounded-lg p-8 flex flex-col items-center">
            <h3 className="font-bold text-lg text-[#00CFFF] mb-4">Social Launch Kit</h3>
            <a className="learn-more underline font-semibold text-[#00CFFF]" href="/social-email">
              Learn More
            </a>
          </div>
          <div className="website-audit bg-white/10 rounded-lg p-8 flex flex-col items-center">
            <h3 className="font-bold text-lg text-[#00CFFF] mb-4">Website Audit</h3>
            <a className="learn-more underline font-semibold text-[#00CFFF]" href="/site-audit">
              Learn More
            </a>
          </div>
        </div>
        {/* Secondary CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5 justify-center mb-10">
          <a
            id="pricing-cta"
            className="font-semibold rounded-xl border border-[#294a64] bg-[rgba(0,220,255,0.03)] text-white py-3 px-7 hover:bg-[rgba(0,220,255,0.10)] hover:border-[#36d1fe] focus-visible:ring-4 focus-visible:ring-canai-cyan min-w-[138px] transition"
            href="/pricing"
          >
            Pricing
          </a>
          <a
            id="samples-cta"
            className="font-semibold rounded-xl border border-[#294a64] bg-[rgba(0,220,255,0.03)] text-white py-3 px-7 hover:bg-[rgba(0,220,255,0.10)] hover:border-[#36d1fe] focus-visible:ring-4 focus-visible:ring-canai-cyan min-w-[138px] transition"
            href="/samples"
          >
            Samples
          </a>
          <a
            id="spark-cta"
            className="font-bold rounded-xl border border-[#00cfff] bg-[rgba(0,220,255,0.09)] text-white py-3 px-7 shadow-[0_0_22px_2px_#00f0ff66] hover:bg-[rgba(0,220,255,0.18)] hover:shadow-[0_0_36px_8px_#00f0ff77] focus-visible:ring-4 focus-visible:ring-canai-cyan min-w-[158px] transition"
            href="/spark"
          >
            Spark for Free
          </a>
        </div>
        {/* LOGIN MODAL PLACEHOLDER */}
        <div
          id="login-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-modal-heading"
          tabIndex={-1}
          className={`fixed inset-0 z-50 bg-black/60 flex items-center justify-center transition-opacity ${showLogin ? "block" : "hidden"}`}
        >
          {/* TODO: Memberstack integration */}
          <div className="bg-white rounded-xl p-8 shadow-xl text-center w-[350px] max-w-[90vw]">
            <h2 id="login-modal-heading" className="text-xl font-bold mb-2 text-canai-dark">
              Login Required
            </h2>
            <p className="mb-4 text-canai-dark">Please log in to continue.</p>
            <button
              className="bg-[#00CFFF] text-white font-semibold px-8 py-3 rounded-lg min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-canai-cyan hover:bg-[#00F0FF] transition"
              aria-label="Log In"
              onClick={() => setShowLogin(false)}
              autoFocus
            >
              Log In
            </button>
          </div>
        </div>
        {/* Show "login" modal button for demo */}
        {!isLoggedIn && (
          <div className="flex justify-center mt-6">
            <button
              type="button"
              className="underline text-[#00CFFF] font-semibold"
              onClick={() => setShowLogin(true)}
            >
              Show Login Modal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoveryHook;
