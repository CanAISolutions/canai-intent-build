
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
    className={`relative w-full h-full rounded-2xl shadow-lg bg-white/95 px-8 py-8 flex flex-col items-center border-4
      ${highlighted
        ? "border-canai-primary animate-glow-pop"
        : "border-transparent"}
      before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none before:z-0
      before:shadow-[0_0_42px_5px_#36d1fe33]`}
    tabIndex={0}
  >
    {/* Animated border using a gradient */}
    <div className="absolute inset-0 rounded-2xl pointer-events-none z-0 border-2 border-transparent"
      style={{
        boxShadow: "0 0 32px 4px #36d1fe44, 0 0 0 2px #36d1fe66",
        borderImage: "linear-gradient(130deg, #36d1fe, #07c3fb) 1"
      }}
      aria-hidden
    />
    <div className="relative z-10 w-full flex flex-col items-center">
      <h3 className="text-canai-primary text-lg font-bold font-manrope uppercase tracking-wider mb-1">{product}</h3>
      <span className="text-3xl font-extrabold text-gray-900 mb-1">{price}</span>
      <div className="text-xl text-gray-800 font-semibold mb-4">{title}</div>
      <ul className="mb-4 space-y-2 w-full text-left max-w-xs">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-canai-light-blue text-base">
            <span className="inline-block w-2 h-2 bg-canai-cyan rounded-full mr-2" />
            <span className="text-gray-700">{f}</span>
          </li>
        ))}
      </ul>
      <p className="mb-6 text-gray-500 text-center font-manrope">{description}</p>
      <Button variant="canai" className="w-full max-w-xs">{cta}</Button>
    </div>
  </div>
);

export default PricingCard;
