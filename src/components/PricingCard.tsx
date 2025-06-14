
import React from "react";
import { Button } from "@/components/ui/button";

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
  <div
    className={`canai-pricing-card relative w-full h-full rounded-2xl shadow-xl px-8 py-10 flex flex-col items-center border-4
      ${highlighted
        ? "border-canai-primary animate-glow-pop ring-2 ring-canai-primary/40"
        : "border-transparent"}
      before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none before:z-0
      before:shadow-[0_0_42px_8px_#36d1fe33]`}
    tabIndex={0}
    style={{ backdropFilter: "blur(8px)" }}
  >
    {/* Animated border using a gradient */}
    <div className="absolute inset-0 rounded-2xl pointer-events-none z-0 border-2 border-transparent"
      style={{
        boxShadow: "0 0 38px 8px #193c6555, 0 0 0 2px #36d1fe44",
        borderImage: "linear-gradient(130deg, #36d1fe, #193c65) 1"
      }}
      aria-hidden
    />
    <div className="relative z-10 w-full flex flex-col items-center">
      <h3 className="text-canai-card-title text-lg font-bold font-manrope uppercase tracking-wider mb-2">{product}</h3>
      <span className="text-3xl font-extrabold text-canai-primary mb-1 drop-shadow-lg">{price}</span>
      <div className="text-xl text-canai-light font-semibold mb-4">{title}</div>
      <ul className="mb-4 space-y-2 w-full text-left max-w-xs">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-canai-light-blue text-base">
            <span className="inline-block w-2 h-2 bg-canai-cyan rounded-full mr-2" />
            <span className="text-canai-light">{f}</span>
          </li>
        ))}
      </ul>
      <p className="mb-7 text-canai-light text-center font-manrope">{description}</p>
      <Button variant="canai" className="w-full max-w-xs font-bold">{cta}</Button>
    </div>
  </div>
);

export default PricingCard;
