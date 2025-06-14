
import React from "react";
import CanAILogo from "@/components/CanAILogo";

const Hero = ({ userName }: { userName?: string }) => (
  <section className="flex flex-col items-center pb-3 pt-20 w-full" style={{ zIndex: 2 }}>
    <div className="mb-5 flex flex-col items-center">
      <div className="backdrop-blur-md bg-white/10 rounded-xl px-6 py-3 shadow-lg border border-transparent">
        <CanAILogo size="lg" showTagline />
      </div>
    </div>
    <h1
      className="text-center font-manrope font-extrabold text-canai-light drop-shadow-lg rounded-lg px-6 py-4 text-4xl sm:text-5xl transition-all mb-4"
      style={{
        background: "linear-gradient(135deg, rgba(0,207,255,0.04), rgba(54,209,254,0.09))",
      }}
      tabIndex={0}
    >
      {userName ? `Welcome back, ${userName}!` : "Ignite Your Vision with CanAI"}
    </h1>
    <p
      className="text-center text-lg sm:text-xl font-manrope font-semibold text-[#E6F6FF] bg-white/5 px-5 py-3 rounded-lg max-w-xl mx-auto"
      style={{
        textShadow: "0 0 8px #00F0FFcc, 0 2px 10px #002638cc",
        opacity: 0.97,
      }}
      tabIndex={0}
    >
      Elevate your essence with{" "}
      <span className="font-bold bg-gradient-to-r from-[#00CFFF] to-[#36d1fe] bg-clip-text text-transparent">
        AI-crafted solutions
      </span>
      {" "}that resonate.
    </p>
  </section>
);

export default Hero;
