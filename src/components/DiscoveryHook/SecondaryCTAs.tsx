
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type SecondaryCTAsProps = {
  onOpenPricing: () => void;
  onOpenPreview: () => void;
};

const SecondaryCTAs: React.FC<SecondaryCTAsProps> = ({
  onOpenPricing,
  onOpenPreview
}) => {
  const navigate = useNavigate();
  return (
    <section className="flex justify-center w-full mt-2 mb-6">
      <nav
        className="flex gap-5 px-6 py-4 rounded-2xl bg-[rgba(13,35,53,0.54)] 
          backdrop-blur-lg shadow-[0_0_36px_0_#00f0ff19] border border-[#36d1fe44]
          animate-fade-in max-w-2xl w-full justify-center items-center"
        aria-label="Secondary actions"
        tabIndex={-1}
      >
        <Button
          variant="ghost"
          size="lg"
          onClick={onOpenPricing}
          aria-haspopup="dialog"
          aria-controls="pricing-modal"
          className="min-w-[138px] text-white font-semibold border border-[#294a64] bg-[rgba(0,220,255,0.03)] hover:bg-[rgba(0,220,255,0.10)] hover:border-[#36d1fe] focus-visible:ring-4 focus-visible:ring-canai-cyan rounded-xl transition-all duration-200"
        >
          Pricing
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={() => navigate("/samples")}
          className="min-w-[138px] text-white font-semibold border border-[#294a64] bg-[rgba(0,220,255,0.03)] hover:bg-[rgba(0,220,255,0.10)] hover:border-[#36d1fe] focus-visible:ring-4 focus-visible:ring-canai-cyan rounded-xl transition-all duration-200"
        >
          Samples
        </Button>
        <Button
          variant="canai"
          size="lg"
          className="min-w-[158px] font-bold border border-[#00cfff] bg-[rgba(0,220,255,0.09)] text-white shadow-[0_0_22px_2px_#00f0ff66] hover:bg-[rgba(0,220,255,0.18)] hover:shadow-[0_0_36px_8px_#00f0ff77] focus-visible:ring-4 focus-visible:ring-canai-cyan rounded-xl transition-all duration-200"
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
