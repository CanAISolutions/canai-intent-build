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
    <section id="product-cards" className="py-16 container mx-auto px-4">
      {/* TODO: Webflow/Make.com/Product integration goes here */}
      <div className="text-center mb-14">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#cfefff] via-[#00cfff] to-[#54c1fe] text-transparent bg-clip-text animate-countup-glow drop-shadow-[0_2px_35px_#008cff88] font-manrope mb-2" style={{
          filter: 'drop-shadow(0 0 17px #36d1fecc)',
          letterSpacing: '0.01em'
        }}>
          Tailored Solutions For Every Vision
        </h2>
        <p className="text-lg md:text-xl font-manrope text-canai-light opacity-90 max-w-2xl mx-auto" style={{
          textShadow: '0 4px 18px #36d1fe44'
        }}>
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
                className="relative rounded-2xl px-9 py-12 bg-[rgba(14,36,56,0.92)] overflow-hidden canai-product-card border border-[#22bcfa] hover:scale-105 transition-all duration-300 shadow-[0_0_58px_0_#00cfff33] focus-visible:ring-4 focus-visible:ring-canai-cyan"
                style={{
                  boxShadow: "0 0 36px 0 #00cfff7c, 0 2px 22px #091023bb",
                  border: '2px solid #00cfff',
                }}
              >
                {/* Neon blue outline glow */}
                <span
                  className="absolute -inset-1 pointer-events-none rounded-[18px] z-0"
                  style={{
                    boxShadow: '0 0 40px 7px #00cfff90, 0 0px 0 #36d1fe00',
                  }}
                  aria-hidden
                />
                <div className="flex flex-col items-center gap-8 relative z-10">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[rgba(35,63,102,0.81)] neon-glow"
                    style={{
                      boxShadow: '0 0 32px 0 #00cfff80,0 0 0 #36d1fe00'
                    }}>
                    <IconComponent size={36} color="#E6F6FF" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-extrabold text-canai-light font-manrope tracking-tight mb-2"
                    style={{ textShadow: "0 0 24px #00cfff50, 0 3px 12px #171b36" }}
                  >
                    {product.title}
                  </h3>
                  <p className="text-canai-light text-base font-manrope text-center opacity-80"
                    style={{ fontWeight: 300, minHeight: 68 }}
                  >
                    {product.description}
                  </p>
                  <Button
                    tabIndex={-1}
                    variant="ghost"
                    className="group/button w-full max-w-xs py-4 mt-2 font-bold rounded-xl text-base text-white bg-[rgba(0,220,255,0.07)] border border-[#41e3fd] transition-all duration-200
                      shadow-[0_0_22px_4px_#00cfff32] hover:bg-[rgba(0,220,255,0.11)] hover:shadow-[0_0_32px_10px_#00f0ff55] hover:border-[#00f0ff] focus-visible:ring-4 focus-visible:ring-canai-cyan"
                    style={{
                      boxShadow: "0 0 16px #00f0ff66",
                    }}
                  >
                    <span className="font-semibold">Learn More</span>
                    <ArrowRight className="ml-2 group-hover/button:translate-x-1 transition-all" size={22} color="#DFF6FF" />
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
