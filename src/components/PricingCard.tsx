
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import StandardCard from "./StandardCard";

export interface PricingCardProps {
  product: string;
  price: string;
  title: string;
  features: string[];
  description: string;
  cta?: string;
  highlighted?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  product,
  price,
  title,
  features,
  description,
  cta = "Get Started",
  highlighted = false,
}) => (
  <StandardCard
    variant="product"
    padding="xl"
    className={cn(
      "relative flex flex-col items-center text-center",
      highlighted && "ring-4 ring-[#36d1fe]/40 animate-pulse"
    )}
  >
    <h3 className="text-[#36d1fe] text-lg font-bold font-manrope uppercase tracking-wider mb-2 drop-shadow-lg">
      {product}
    </h3>
    <span className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg font-manrope">
      {price}
    </span>
    <div className="text-xl text-white font-semibold mb-6 font-manrope">
      {title}
    </div>
    <ul className="mb-6 space-y-3 w-full text-left">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3 text-[#E6F6FF] text-base font-manrope">
          <span className="inline-block w-2 h-2 rounded-full bg-[#36d1fe] shadow-[0_0_8px_#36d1fe]" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <p className="mb-8 text-[#cce7fa] text-center font-manrope leading-relaxed">
      {description}
    </p>
    <Button variant="canai" className="w-full max-w-xs font-bold font-manrope">
      {cta}
    </Button>
  </StandardCard>
);

export default PricingCard;
