
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
        <h2 className="text-4xl font-bold text-canai-light mb-4">
          Tailored Solutions for Your Business
        </h2>
        <p className="text-xl text-canai-light opacity-80">
          Choose from our expertly crafted offerings designed to accelerate your growth
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {products.map((product) => {
          const IconComponent = product.icon;
          return (
            <div 
              key={product.id}
              className="bg-yellow-50 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-yellow-200"
            >
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-canai-primary rounded-full text-white">
                  <IconComponent size={28} />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900">
                  {product.title}
                </h3>
                
                <p className="text-gray-700 leading-relaxed">
                  {product.description}
                </p>
                
                <Button 
                  onClick={() => navigate(product.href)}
                  className="bg-gray-900 text-white hover:bg-gray-800 group"
                >
                  Learn More
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
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
