
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
    <section
      className="relative flex flex-col items-center w-full pt-20 pb-9 z-10"
    >
      {/* Large logo front and center */}
      <div className="mb-3 flex flex-col items-center">
        <CanAILogo size="xl" showTagline />
      </div>
      {/* Greeting and subtitle, lighter and less blocky */}
      <div className="flex flex-col items-center gap-3 mt-4">
        {userName && (
          <h1
            className="font-manrope font-semibold text-canai-light text-3xl sm:text-4xl text-center transition-all bg-transparent shadow-none px-0 py-0"
            style={{
              background: "none",
              border: "none",
              textShadow: "0 2px 10px #36d1fe33, 0 1px 2px #fff",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
            tabIndex={0}
          >
            Welcome back, <span className="font-extrabold">{userName}!</span>
          </h1>
        )}
        <p
          className="text-center text-lg sm:text-xl font-manrope text-canai-light"
          style={{
            fontWeight: 400,
            background: "none",
            opacity: 0.96,
            textShadow: "0 2px 11px #0a2538, 0 0 4px #36d1fe22",
            maxWidth: 560,
            lineHeight: 1.5,
            borderRadius: 0,
            padding: 0,
          }}
          tabIndex={0}
        >
          Elevate your essence with{" "}
          <span className="font-bold canai-gradient-text whitespace-nowrap">AI-crafted solutions</span>
          {" "}that resonate.
        </p>
      </div>
      {/* Main CTA button solo, prominent */}
      <button
        className="mt-9 px-16 py-5 rounded-[16px] bg-gradient-to-tr from-[#36d1fe] to-[#00B2E3] font-manrope font-bold text-lg text-white shadow-[0_2px_32px_#36d1fe55] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_52px_#00cffdcc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-canai-primary active:scale-98"
        onClick={onStart}
        aria-label="Start your journey with CanAI"
      >
        Start Your Journey
      </button>
    </section>
  );
};

export default Hero;
