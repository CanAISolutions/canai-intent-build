
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
    <section className="flex justify-center w-full mt-2 mb-6 px-4">
      <nav
        className="flex flex-col sm:flex-row gap-3 sm:gap-5 px-4 sm:px-6 py-4 rounded-2xl bg-[rgba(25,60,101,0.4)] backdrop-blur-lg border border-[#36d1fe]/30 shadow-[0_0_30px_rgba(54,209,254,0.2)] animate-fade-in max-w-2xl w-full justify-center items-stretch sm:items-center"
        aria-label="Secondary actions"
        tabIndex={-1}
      >
        <Button
          variant="ghost"
          size="lg"
          onClick={onOpenPricing}
          aria-haspopup="dialog"
          aria-controls="pricing-modal"
          className="w-full sm:w-auto min-w-[140px] text-[#E6F6FF] font-semibold border border-[rgba(54,209,254,0.3)] bg-[rgba(54,209,254,0.05)] hover:bg-[rgba(54,209,254,0.15)] hover:border-[#36d1fe] focus-visible:ring-4 focus-visible:ring-[#36d1fe]/50 rounded-xl transition-all duration-200"
        >
          Pricing
        </Button>
        
        <Button
          id="sample-btn"
          variant="ghost"
          size="lg"
          onClick={() => navigate("/samples")}
          className="w-full sm:w-auto min-w-[140px] text-[#E6F6FF] font-semibold border border-[rgba(54,209,254,0.3)] bg-[rgba(54,209,254,0.05)] hover:bg-[rgba(54,209,254,0.15)] hover:border-[#36d1fe] focus-visible:ring-4 focus-visible:ring-[#36d1fe]/50 rounded-xl transition-all duration-200"
        >
          Samples
        </Button>
        
        <Button
          variant="canai"
          size="lg"
          className="w-full sm:w-auto min-w-[160px] font-bold shadow-[0_0_20px_rgba(54,209,254,0.4)] hover:shadow-[0_0_30px_rgba(54,209,254,0.6)] focus-visible:ring-4 focus-visible:ring-[#36d1fe]/50 rounded-xl transition-all duration-200"
          onClick={onOpenPreview}
          aria-haspopup="dialog"
        >
          Spark for Free
        </Button>
      </nav>
    </section>
  );
};

export default SecondaryCTAs;
