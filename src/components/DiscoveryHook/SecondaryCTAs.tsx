
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
    <section
      className="w-full flex flex-col items-center"
      aria-label="Secondary call-to-action group"
    >
      {/* New: shadowed card-like group for better prominence */}
      <div
        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-7 px-6 py-7 rounded-2xl bg-[rgba(30,49,79,0.94)] shadow-strong border border-canai-primary mt-7 mb-9 max-w-2xl w-full"
        style={{
          boxShadow: "0 4px 48px 0 #36d1fe33, 0 0px 0 #36d1fe00",
          backdropFilter: "blur(8px) saturate(1.2)",
        }}
        tabIndex={-1}
      >
        <Button
          variant="outline"
          size="lg"
          className="flex-1 min-w-[120px] max-w-xs border-canai-primary text-canai-light font-semibold hover:border-canai-cyan hover:text-canai-cyan transition"
          onClick={onOpenPricing}
          aria-haspopup="dialog"
          aria-controls="pricing-modal"
        >
          Pricing
        </Button>
        <Button
          variant="ghost"
          size="lg"
          className="flex-1 min-w-[120px] max-w-xs text-canai-cyan font-semibold hover:bg-[#12294a]/60 hover:text-white transition"
          onClick={() => navigate("/samples")}
        >
          Samples
        </Button>
        <Button
          variant="canai"
          size="lg"
          className="flex-1 min-w-[150px] max-w-xs font-bold shadow-strong hover:scale-105 transition"
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
