
import React from 'react';
import { ArrowRight, FileText, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: 'BUSINESS_BUILDER',
    title: 'Business Plan',
    description: 'Investor-ready strategy in 700–800 words. Confidently attract funding with clear, compelling plans.',
    icon: FileText,
    href: '/business-builder'
  },
  {
    id: 'SOCIAL_EMAIL',
    title: 'Social Launch Kit',
    description: 'Get 3–7 branded posts and 3–5 high-converting emails. Kickstart your social campaigns painlessly.',
    icon: MessageSquare,
    href: '/social-email'
  },
  {
    id: 'SITE_AUDIT',
    title: 'Website Audit',
    description: 'Actionable 300–400 word analysis + next steps. Instantly boost your web presence.',
    icon: Search,
    href: '/site-audit'
  }
];

const ProductCards = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 container mx-auto px-4">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-bold text-canai-light mb-4 font-manrope drop-shadow-lg" style={{textShadow:"0 0 18px #36d1fecc"}}>
          Tailored Solutions For Every Vision
        </h2>
        <p className="text-xl text-canai-light opacity-90 font-manrope">
          Choose your spark – each product delivers expert results, instantly.
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {products.map((product) => {
          const IconComponent = product.icon;
          return (
            <button
              key={product.id}
              onClick={() => navigate(product.href)}
              className="group w-full focus:outline-none"
              aria-label={`View details for ${product.title}`}
              tabIndex={0}
            >
              <div
                className="relative canai-product-card transition-transform duration-300 bg-white/80 backdrop-blur-xl
                  border border-canai-primary/70 rounded-2xl px-8 py-10 shadow-[0_0_24px_rgba(54,209,254,0.28)] hover:scale-105 hover:shadow-[0_0_38px_rgba(54,209,254,0.38)] focus-visible:ring-4 focus-visible:ring-canai-primary"
                style={{
                  borderImage: "linear-gradient(135deg, #36d1fe, #07c3fb) 1"
                }}
              >
                {/* Glowing animated border gradient (overlay) */}
                <span className="pointer-events-none absolute -inset-0.5 rounded-2xl z-0 group-hover:animate-glow-pop"
                  style={{
                    boxShadow: '0 0 42px 8px #36d1fe77, 0 0 0 2px #36d1fe66'
                  }}
                  aria-hidden
                />
                <div className="flex flex-col items-center space-y-6 relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#36d1fe] to-[#07c3fb] shadow-[0_0_18px_#36d1fe77] mb-2">
                    <IconComponent size={28} className="text-white drop-shadow" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 font-manrope tracking-tight" style={{textShadow:"0 0 6px #36d1fe22"}}>
                    {product.title}
                  </h3>
                  <p className="text-gray-700 opacity-90 font-manrope text-base text-center" style={{fontWeight:300}}>
                    {product.description}
                  </p>
                  <Button
                    tabIndex={-1}
                    variant="canai"
                    className="w-full max-w-xs mt-6 transition-transform duration-200 group-hover:scale-105 font-bold"
                    aria-label={`Learn more about ${product.title}`}
                  >
                    Learn More
                    <ArrowRight className="ml-2" size={18} />
                  </Button>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ProductCards;
