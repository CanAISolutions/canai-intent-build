
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, DollarSign, FileText, Sparkles, Star, Users, Award } from "lucide-react";
import CanAILogo from "@/components/CanAILogo";
import CanAICube from "@/components/CanAICube";
import PricingModal from "@/components/PricingModal";
import PreviewModal from "@/components/PreviewModal";

const DiscoveryHook = () => {
  const navigate = useNavigate();
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Inline style for gradient background (for full-bleed effect)
  const gradient = "linear-gradient(135deg, #00CFFF 0%, #00B2E3 100%)";

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: gradient, padding: "100px 0" }}
    >
      {/* ANIMATED, PULSING 3D CUBE - CENTER MOTIF */}
      <div
        className="absolute left-1/2 top-1/2 z-0 animate-cube-pulse"
        style={{ transform: "translate(-50%, -50%)", filter: "drop-shadow(var(--glow-cube))" }}
        aria-hidden
      >
        <CanAICube size={220} className="animate-cube-rotate" />
      </div>

      {/* MAIN CONTAINER, LAYERED OVER CUBE */}
      <div className="relative z-10 w-full max-w-5xl px-6 py-16 text-center space-y-12 flex flex-col items-center animate-fade-in">
        <CanAILogo size="xl" />
        <p
          className="text-canai-light"
          style={{
            fontFamily: "Manrope, 'Helvetica Neue', sans-serif",
            fontWeight: 200,
            fontSize: "21px",
            letterSpacing: "0.12em",
          }}
        >
          Empowerment Through Ease
        </p>
        <h1
          className="text-canai-light"
          style={{
            fontFamily: "Manrope, 'Helvetica Neue', sans-serif",
            fontWeight: 700,
            fontSize: "48px",
            lineHeight: "1.1",
          }}
        >
          Unlock Your Vision with CanAI
        </h1>
        <p
          className="text-canai-light max-w-xl mx-auto"
          style={{
            fontFamily: "Manrope, 'Helvetica Neue', sans-serif",
            fontWeight: 200,
            fontSize: "20px",
            opacity: 0.93,
          }}
        >
          Craft solutions that feel like you, elevated.
        </p>

        {/* BUTTON GROUP */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center pt-2">
          {/* Primary CTA */}
          <Button
            id="begin-btn"
            onClick={() => navigate("/discovery-funnel")}
            className="canai-button-primary text-2xl px-8 py-5 rounded-xl font-bold shadow-lg focus-visible:ring-4 focus-visible:ring-[--canai-primary-blue] transition-all duration-300"
            style={{ boxShadow: "0 0 32px 7px #00CFFF, var(--glow-intense, 0 0 40px #00CFFF)" }}
            aria-label="Begin your CanAI journey"
          >
            <ArrowRight className="mr-3 -ml-2 drop-shadow-[0_0_8px_#00F0FF]" size={28} />
            Begin Your Journey
          </Button>

          {/* Secondary CTAs */}
          <Button
            variant="outline"
            onClick={() => setIsPricingModalOpen(true)}
            className="border-2 border-canai-primary text-canai-light hover:bg-canai-cyan/20 text-xl px-6 py-4 rounded-lg font-bold transition-all duration-300 focus-visible:ring-4 focus-visible:ring-[--canai-primary-blue] group"
            style={{ boxShadow: "var(--glow-soft, 0 0 10px #00F0FF)" }}
            aria-label="View CanAI pricing"
          >
            <DollarSign className="mr-2 text-canai-primary drop-shadow-[0_0_5px_#00F0FF]" size={22} />
            View Pricing
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/samples")}
            className="border-2 border-canai-primary text-canai-light hover:bg-canai-cyan/20 text-xl px-6 py-4 rounded-lg font-bold transition-all duration-300 focus-visible:ring-4 focus-visible:ring-[--canai-primary-blue] group"
            style={{ boxShadow: "var(--glow-soft, 0 0 10px #00F0FF)" }}
            aria-label="See a CanAI sample"
          >
            <FileText className="mr-2 text-canai-primary drop-shadow-[0_0_5px_#00F0FF]" size={22} />
            See a Sample
          </Button>

          <Button
            variant="outline"
            onClick={() => setIsPreviewModalOpen(true)}
            className="border-2 border-canai-primary text-canai-light hover:bg-canai-cyan/20 text-xl px-6 py-4 rounded-lg font-bold transition-all duration-300 focus-visible:ring-4 focus-visible:ring-[--canai-primary-blue] group"
            style={{ boxShadow: "var(--glow-soft, 0 0 10px #00F0FF)" }}
            aria-label="Try a free CanAI spark"
          >
            <Sparkles className="mr-2 text-canai-primary drop-shadow-[0_0_5px_#00F0FF]" size={22} />
            Try a Free Spark
          </Button>
        </div>

        {/* TRUST INDICATORS - 3 COLUMN GLOWING BLOCK */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-14">
          <div className="flex items-center gap-3 bg-canai-deep/50 rounded-lg px-4 py-6 backdrop-blur-md shadow"
               style={{ boxShadow: "0 0 18px 2px #00F0FF77" }}>
            <Star size={30} className="text-yellow-400 drop-shadow-[0_0_6px_#FFD800]" />
            <span
              className="text-canai-light"
              style={{
                fontFamily: "Manrope, 'Helvetica Neue', sans-serif",
                fontWeight: 200,
                fontSize: "18px",
              }}>
              "CanAI launched my bakery!"<br />
              <span className="opacity-80">– Jane, Sweet Dreams Bakery</span>
            </span>
          </div>
          <div className="flex items-center gap-3 bg-canai-deep/50 rounded-lg px-4 py-6 backdrop-blur-md shadow"
               style={{ boxShadow: "0 0 18px 2px #00F0FF77" }}>
            <Users size={30} className="text-canai-primary drop-shadow-[0_0_7px_#00CFFF]" />
            <span
              className="text-canai-light"
              style={{
                fontFamily: "Manrope, 'Helvetica Neue', sans-serif",
                fontWeight: 200,
                fontSize: "18px",
              }}>
              <span className="font-bold text-canai-primary" style={{ fontWeight: 700, fontSize: "24px" }}>
                500+
              </span>{" "}
              Plans Created
            </span>
          </div>
          <div className="flex items-center gap-3 bg-canai-deep/50 rounded-lg px-4 py-6 backdrop-blur-md shadow"
               style={{ boxShadow: "0 0 18px 2px #00F0FF77" }}>
            <Award size={30} className="text-canai-primary drop-shadow-[0_0_7px_#00CFFF]" />
            <span
              className="text-canai-light"
              style={{
                fontFamily: "Manrope, 'Helvetica Neue', sans-serif",
                fontWeight: 200,
                fontSize: "18px",
              }}>
              <span className="font-bold text-canai-primary" style={{ fontWeight: 700, fontSize: "24px" }}>
                98%
              </span>{" "}
              Success Rate
            </span>
          </div>
        </div>
      </div>

      {/* Modals */}
      <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
      <PreviewModal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} />

      {/* ANIMATIONS - INJECT IF NOT GLOBAL */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.2s cubic-bezier(.6,0,.36,1);
        }
        @keyframes cube-pulse {
          0% { filter: drop-shadow(0 0 20px #00F0FF) drop-shadow(0 0 40px #00CFFF); }
          50% { filter: drop-shadow(0 0 30px #00F0FF) drop-shadow(0 0 80px #00CFFF); }
          100% { filter: drop-shadow(0 0 20px #00F0FF) drop-shadow(0 0 40px #00CFFF); }
        }
        .animate-cube-pulse {
          animation: cube-pulse 2s infinite;
        }
        @keyframes cube-rotate {
          0%   { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(360deg) rotateY(360deg); }
        }
        .animate-cube-rotate {
          animation: cube-rotate 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default DiscoveryHook;
