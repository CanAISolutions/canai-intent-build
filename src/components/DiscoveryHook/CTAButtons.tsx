
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type CTAButtonsProps = {
  onOpenPricing: () => void;
  onOpenPreview: () => void;
};

const CTAButtons: React.FC<CTAButtonsProps> = ({ onOpenPricing, onOpenPreview }) => {
  const navigate = useNavigate();
  
  return (
    <section className="w-full flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6 my-8 px-4">
      <Button
        variant="canai"
        size="lg"
        className="w-full sm:w-auto min-w-[200px] max-w-xs animate-fade-in"
        onClick={() => navigate("/discovery-funnel")}
        aria-label="Start your CanAI journey"
      >
        Get Started
      </Button>
      
      <Button
        variant="outline"
        size="lg"
        className="w-full sm:w-auto min-w-[160px] max-w-xs border-[#36d1fe] text-[#E6F6FF] hover:bg-[rgba(54,209,254,0.1)] hover:border-[#36d1fe] focus-visible:ring-4 focus-visible:ring-[#36d1fe]/50 transition-all duration-200"
        onClick={onOpenPricing}
        aria-haspopup="dialog"
        aria-controls="pricing-modal"
      >
        Pricing
      </Button>
      
      <Button
        variant="ghost"
        size="lg"
        className="w-full sm:w-auto min-w-[160px] max-w-xs text-[#36d1fe] hover:bg-[rgba(54,209,254,0.1)] focus-visible:ring-4 focus-visible:ring-[#36d1fe]/50 transition-all duration-200"
        onClick={() => navigate("/samples")}
      >
        Samples
      </Button>
      
      <Button
        variant="canai"
        size="lg"
        className="w-full sm:w-auto min-w-[180px] max-w-xs animate-fade-in"
        onClick={onOpenPreview}
        aria-haspopup="dialog"
      >
        Spark for Free
      </Button>
    </section>
  );
};

export default CTAButtons;
