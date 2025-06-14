
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type SecondaryCTAsProps = {
  onOpenPricing: () => void;
  onOpenPreview: () => void;
};

const SecondaryCTAs: React.FC<SecondaryCTAsProps> = ({
  onOpenPricing,
  onOpenPreview,
}) => {
  const navigate = useNavigate();

  return (
    <section className="w-full flex flex-col items-center mt-8 mb-6">
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        <Button
          variant="outline"
          size="lg"
          className="min-w-[142px] max-w-xs border-canai-cyan text-canai-light px-7"
          onClick={onOpenPricing}
          aria-haspopup="dialog"
          aria-controls="pricing-modal"
        >
          Pricing
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="min-w-[142px] max-w-xs text-canai-cyan px-7"
          onClick={() => navigate("/samples")}
        >
          Samples
        </Button>
        <Button
          variant="canai"
          size="lg"
          className="min-w-[160px] max-w-xs px-7"
          onClick={onOpenPreview}
          aria-haspopup="dialog"
        >
          Spark for Free
        </Button>
      </div>
    </section>
  );
};

export default SecondaryCTAs;
