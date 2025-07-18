
import React from 'react';
import { X } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import PricingCard from './PricingCard';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRICING_DATA = [
  {
    product: 'BUSINESS_BUILDER',
    title: "Business Plan Accelerator",
    price: '$99',
    features: [
      "700–800 words, investor-ready",
      "AI+expert crafted analysis",
      "Market positioning, competition, plan",
      "Fast 24h turnaround"
    ],
    description: "Get a beautiful, actionable business plan—delivered fast. Designed to impress investors and clarify your next winning moves.",
    highlighted: true,
  },
  {
    product: 'SOCIAL_EMAIL',
    title: "Social Launch Kit",
    price: '$49',
    features: [
      "3-7 social posts, branded",
      "3-5 conversion email drafts",
      "Tailored to your audience",
      "Messaging for launch or boost"
    ],
    description: "Jumpstart your brand buzz with social and emails written for max engagement—ideal for launches or campaign boosts.",
    highlighted: false,
  },
  {
    product: 'SITE_AUDIT',
    title: "Website Audit & Boost",
    price: '$79',
    features: [
      "300–400 word deep-dive audit",
      "Actionable recommendations",
      "Design, UX & copy insights",
      "Prioritized next steps"
    ],
    description: "Optimize your digital presence. Pinpoint improvements and get a roadmap to a site that finally converts and reflects your vision.",
    highlighted: false,
  }
];

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Accessibility: close with Escape
  React.useEffect(() => {
    if (!isOpen) return;
    const keyHandler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", keyHandler);
    return () => window.removeEventListener("keydown", keyHandler);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;

  return (
    <div
      id="pricing-modal"
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative bg-gradient-to-br from-[#193c65]/95 via-[#1e4a73]/95 to-[#12294a]/95 rounded-3xl px-4 py-8 max-w-2xl w-full flex flex-col items-center shadow-2xl border-4 border-[#36d1fe] backdrop-blur-md"
        style={{
          boxShadow: "0 0 48px 10px rgba(54, 209, 254, 0.4)"
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          id="pricing-close"
          onClick={onClose}
          className="absolute top-6 right-6 z-10 transition-colors bg-[#143657]/80 rounded-full p-2 hover:bg-[#36d1fe]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#36d1fe] text-white hover:text-[#36d1fe]"
          aria-label="Close Pricing Modal"
        >
          <X size={22} />
        </button>
        <div className="text-center mb-5">
          <h2 className="text-3xl font-bold text-white mb-2 font-manrope" id="modal-title" tabIndex={0}>
            CanAI Pricing
          </h2>
          <p className="text-[#cce7fa] font-medium font-manrope opacity-90">
            Choose the perfect solution for your business.
          </p>
        </div>
        {/* Carousel */}
        <Carousel className="w-full max-w-xl py-2 select-none">
          <CarouselContent>
            {PRICING_DATA.map((item, idx) => (
              <CarouselItem key={item.product} className="px-2 py-4">
                <PricingCard {...item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Styled Controls */}
          <CarouselPrevious className="left-1 top-1/2 -translate-y-1/2 border-none bg-[#36d1fe] shadow-lg hover:scale-110 focus:ring-[#36d1fe] text-white hover:bg-[#4ae3ff]" />
          <CarouselNext className="right-1 top-1/2 -translate-y-1/2 border-none bg-[#36d1fe] shadow-lg hover:scale-110 focus:ring-[#36d1fe] text-white hover:bg-[#4ae3ff]" />
        </Carousel>
      </div>
    </div>
  );
};

export default PricingModal;
