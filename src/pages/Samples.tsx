
import React from 'react';
import { FileText, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

const sampleCards = [
  {
    icon: <FileText className="text-canai-primary" size={28} />,
    title: "Business Plan Sample (BUSINESS_BUILDER)",
    content: (
      <>
        <h3 className="text-xl font-bold mb-4 text-gray-800">EcoClean Solutions - Executive Summary</h3>
        <p className="mb-4 text-gray-700 leading-relaxed">
          EcoClean Solutions revolutionizes commercial cleaning through sustainable practices and 
          cutting-edge technology. Our eco-friendly approach reduces environmental impact by 89% while 
          delivering superior results for office buildings, retail spaces, and healthcare facilities.
        </p>
        <p className="mb-4 text-gray-700 leading-relaxed">
          Founded in 2024, we address the growing demand for environmentally responsible cleaning 
          services in the $330 billion global commercial cleaning market. Our proprietary blend 
          of plant-based cleaning agents and IoT-enabled equipment monitoring delivers 40% faster 
          results while reducing costs by 25%.
        </p>
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border-l-4 border-canai-primary">
          <p className="text-sm text-gray-600 font-medium italic">
            📊 Projected Revenue: $2.4M Year 1 | 🎯 Target: 150 clients | 💡 ROI: 340%
          </p>
        </div>
        <p className="text-xs text-gray-500 italic mt-3">
          [Sample excerpt from a comprehensive 750-word business plan with financial projections, market analysis, and growth strategy]
        </p>
      </>
    )
  },
  {
    icon: <MessageSquare className="text-canai-primary" size={28} />,
    title: "Social Media Posts (SOCIAL_EMAIL)",
    content: (
      <>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border-l-4 border-pink-400">
            <p className="text-base font-medium text-gray-800 mb-2">LinkedIn Post:</p>
            <p className="text-gray-700 leading-relaxed">
              🌱 <strong>Small changes, big impact!</strong> Switching to eco-friendly cleaning isn't just better for the planet—it's better for your team's health and your bottom line. Our clients see 25% cost savings + 40% faster results. Ready to make the change? #EcoFriendly #SmallBusiness
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-400">
            <p className="text-base font-medium text-gray-800 mb-2">Email Subject:</p>
            <p className="text-gray-700 leading-relaxed font-semibold">
              "How Sarah Cut Her Cleaning Costs by 25% (and helped save the planet)"
            </p>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 italic mt-4">
          [Sample from 5 social posts + 3 targeted emails with CTAs and engagement hooks]
        </p>
      </>
    )
  },
  {
    icon: <Search className="text-canai-primary" size={28} />,
    title: "Website Audit Sample (SITE_AUDIT)",
    content: (
      <>
        <h3 className="text-lg font-bold mb-3 text-gray-800">Homepage Performance Analysis</h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
            <span className="text-gray-700 font-medium">Conversion Rate</span>
            <span className="text-red-600 font-bold">2.1% 📉</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <span className="text-gray-700 font-medium">Page Load Speed</span>
            <span className="text-yellow-600 font-bold">4.2s ⚠️</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <span className="text-gray-700 font-medium">Mobile Friendly</span>
            <span className="text-green-600 font-bold">95% ✅</span>
          </div>
        </div>
        
        <p className="text-gray-700 leading-relaxed mb-3">
          <strong>Key Issue:</strong> Your call-to-action button is positioned below the fold on mobile devices, 
          potentially reducing engagement by 35%. Moving it above the fold could increase conversions to 3.4%.
        </p>
        
        <p className="text-xs text-gray-500 italic">
          [Sample from detailed 350-word audit with actionable recommendations and performance metrics]
        </p>
      </>
    )
  }
];

const Samples = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canai-deep flex flex-col">
      {/* Consistent page header with logo and back button */}
      <PageHeader 
        showBackButton={true} 
        className="max-w-7xl mx-auto pt-7 pb-3 px-4" 
      />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-16 pt-2">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Title & subtitle */}
          <div className="text-center pb-6">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-canai-light animate-fade-in mb-4">
              Sample CanAI Outputs
            </h1>
            <p className="text-xl text-canai-light opacity-90 animate-fade-in max-w-3xl mx-auto leading-relaxed" style={{ animationDelay: '0.12s' }}>
              Experience the quality, depth, and intelligence of our AI-generated content. 
              Each output is personalized, professionally crafted, and ready to use.
            </p>
          </div>

          {/* Responsive gallery grid */}
          <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2">
            {sampleCards.map((card, idx) => (
              <div
                key={idx}
                className="canai-product-card flex flex-col h-full rounded-2xl shadow-strong border-2 border-canai-primary/75 transition-transform duration-200 hover:scale-[1.02] hover:shadow-[0_0_32px_#36d1fe99] bg-gradient-to-br from-[rgba(25,60,101,0.76)] to-[rgba(21,43,71,0.93)] animate-fade-in"
                style={{ 
                  minHeight: 450,
                  animationDelay: `${idx * 0.1}s`
                }}
              >
                <div className="flex items-center space-x-3 mb-6 pt-6 px-6">
                  {card.icon}
                  <h2 className="text-lg font-bold text-canai-light text-glow-hero leading-tight">
                    {card.title}
                  </h2>
                </div>
                <div className="bg-white rounded-xl p-6 mx-5 mb-6 text-gray-900 flex-1 shadow-lg overflow-hidden">
                  {card.content}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced CTA section */}
          <div className="text-center pt-12 pb-8">
            <div className="max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-canai-light mb-4">
                Ready for Your Custom Content?
              </h2>
              <p className="text-canai-light opacity-80 leading-relaxed">
                Get personalized, professional-grade content tailored to your business goals. 
                Choose from business plans, social content, or website audits.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                onClick={() => navigate('/discovery-funnel')}
                size="lg" 
                variant="canai"
                className="canai-button-primary text-lg px-10 py-5 shadow-md hover:scale-105 animate-glow-pop min-w-[220px]"
              >
                Start Your Project
              </Button>
              
              <p className="text-sm text-canai-light opacity-70">
                ✨ 500+ plans created • 📈 65% prefer CanAI outputs
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Samples;
