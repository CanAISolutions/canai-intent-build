
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
    <section className="w-full flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 my-8">
      <Button
        variant="canai"
        size="lg"
        className="flex-1 min-w-[190px] max-w-xs"
        onClick={() => navigate("/discovery-funnel")}
        aria-label="Ignite Your Journey"
      >
        Get Started
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="flex-1 min-w-[140px] max-w-xs border-canai-cyan text-canai-light"
        onClick={onOpenPricing}
        aria-haspopup="dialog"
        aria-controls="pricing-modal"
      >
        Pricing
      </Button>
      <Button
        variant="ghost"
        size="lg"
        className="flex-1 min-w-[140px] max-w-xs text-canai-cyan"
        onClick={() => navigate("/samples")}
      >
        Samples
      </Button>
      <Button
        variant="canai"
        size="lg"
        className="flex-1 min-w-[150px] max-w-xs"
        onClick={onOpenPreview}
        aria-haspopup="dialog"
      >
        Spark for Free
      </Button>
    </section>
  );
};

export default CTAButtons;
