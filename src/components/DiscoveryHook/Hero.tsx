
import React from "react";
import CanAILogo from "@/components/CanAILogo";

const Hero = ({
  userName,
  onStart,
}: {
  userName?: string;
  onStart: () => void;
}) => {
  return (
    <section className="relative flex flex-col items-center w-full pt-20 pb-12 sm:pb-14 z-10">
      {/* Logo up top, sized large */}
      <div className="mb-5 flex flex-col items-center">
        <CanAILogo size="xl" showTagline />
      </div>
      {/* Greeting + subtitle, now softer, less blocky */}
      <div className="flex flex-col items-center gap-2 mt-0 mb-2">
        {userName && (
          <h1
            className="font-manrope font-semibold text-canai-light drop-shadow-xl text-3xl sm:text-4xl text-center bg-transparent px-0 py-0 tracking-tight"
            style={{
              background: "none",
              border: "none",
              textShadow: "0 2px 14px #36d1fe44",
              fontWeight: 500,
              letterSpacing: "0.01em",
              lineHeight: 1.16,
              opacity: 0.97,
            }}
            tabIndex={0}
          >
            <span className="font-extrabold canai-gradient-text">{`Welcome back, ${userName}!`}</span>
          </h1>
        )}
        <p
          className="text-center text-lg sm:text-xl font-manrope text-canai-light max-w-xl mx-auto px-1"
          style={{
            fontWeight: 400,
            opacity: 0.92,
            textShadow: "0 2px 14px #0a2538b0, 0 0 4px #36d1fe22",
            lineHeight: 1.5,
            borderRadius: 0,
            padding: 0,
          }}
          tabIndex={0}
        >
          <span>
            Elevate your essence with&nbsp;
            <span className="font-bold canai-gradient-text whitespace-nowrap">AI-crafted solutions</span>
            &nbsp;that resonate.
          </span>
        </p>
      </div>
      {/* Enormous standalone CTA button, magnetically styled */}
      <button
        className="mt-11 sm:mt-12 px-20 py-6 rounded-[18px] text-lg sm:text-xl font-manrope font-bold bg-gradient-to-tr from-[#36d1fe] via-[#16B9EC] to-[#00B2E3] text-white shadow-[0_2px_48px_#36d1fe66] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_62px_#00cffdcc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-canai-primary active:scale-98 animate-glow-pop"
        style={{
          letterSpacing: ".01em",
          boxShadow: "0 2px 52px 0 #36d1fe80",
          filter: "drop-shadow(0 0 24px #00B2E3aa)"
        }}
        onClick={onStart}
        aria-label="Start your journey with CanAI"
      >
        Start Your Journey
      </button>
    </section>
  );
};

export default Hero;
