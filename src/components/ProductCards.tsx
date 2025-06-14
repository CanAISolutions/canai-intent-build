
import React from 'react';
import { ArrowRight, FileText, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProductCards = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 'BUSINESS_BUILDER',
      title: 'Business Plans for Funding',
      description: 'Craft a 700–800-word plan for investors.',
      icon: FileText,
      href: '/business-builder'
    },
    {
      id: 'SOCIAL_EMAIL',
      title: 'Social Media Campaigns',
      description: 'Get 3–7 posts + 3–5 emails.',
      icon: MessageSquare,
      href: '/social-email'
    },
    {
      id: 'SITE_AUDIT',
      title: 'Website Audits',
      description: 'Receive a 300–400-word audit + recommendations.',
      icon: Search,
      href: '/site-audit'
    }
  ];

  return (
    <section className="py-20 container mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-canai-light mb-4 font-manrope" style={{textShadow:"0 0 15px #36d1fe77"}}>
          Tailored Solutions for Your Business
        </h2>
        <p className="text-xl text-canai-light opacity-80 font-manrope">
          Choose from our expertly crafted offerings designed to accelerate your growth
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => {
          const IconComponent = product.icon;
          return (
            <div 
              key={product.id}
              className="canai-product-card bg-[rgba(20,54,87,0.75)] border-2 border-transparent rounded-2xl px-8 py-10 shadow-[0_0_10px_rgba(54,209,254,0.6)] relative overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_32px_rgba(54,209,254,0.8)]"
              style={{
                borderImage: "linear-gradient(135deg, #36d1fe, #07c3fb) 1"
              }}
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#36d1fe] to-[#07c3fb] shadow-[0_0_16px_#36d1fe55]">
                  <IconComponent size={28} className="text-white drop-shadow" />
                </div>
                
                <h3 className="text-2xl font-bold text-canai-light font-manrope" style={{textShadow:"0 0 10px #36d1fe77"}}>
                  {product.title}
                </h3>
                
                <p className="text-canai-light opacity-80 font-manrope text-base text-center" style={{fontWeight:200}}>
                  {product.description}
                </p>
                
                <Button 
                  onClick={() => navigate(product.href)}
                  variant="canai"
                  className="w-full max-w-xs mt-2"
                  aria-label={`Learn more about ${product.title}`}
                >
                  Learn More
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ProductCards;

