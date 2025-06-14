import React from 'react';
import { ArrowLeft, FileText, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import CanAILogo from '@/components/CanAILogo';

const sampleCards = [
  {
    icon: <FileText className="text-canai-primary" size={28} />,
    title: "Business Plan Sample (BUSINESS_BUILDER)",
    content: (
      <>
        <h3 className="text-xl font-bold mb-4">EcoClean Solutions - Executive Summary</h3>
        <p className="mb-4">
          EcoClean Solutions revolutionizes commercial cleaning through sustainable practices and 
          cutting-edge technology. Our eco-friendly approach reduces environmental impact while 
          delivering superior results for office buildings, retail spaces, and healthcare facilities.
        </p>
        <p className="mb-4">
          Founded in 2024, we address the growing demand for environmentally responsible cleaning 
          services in the $330 billion global commercial cleaning market. Our proprietary blend 
          of plant-based cleaning agents and IoT-enabled equipment monitoring sets us apart from 
          traditional cleaning companies.
        </p>
        <p className="text-sm text-gray-600 italic">
          [This is an anonymized excerpt from a 700-word business plan]
        </p>
      </>
    )
  },
  {
    icon: <MessageSquare className="text-canai-primary" size={28} />,
    title: "Social Media Post Sample (SOCIAL_EMAIL)",
    content: (
      <>
        <p className="text-lg mb-4">
          🌱 Small changes, big impact! Switching to eco-friendly cleaning isn't just better for the planet—it's better for your team's health and your bottom line. Ready to make the change? #EcoFriendly #SmallBusiness #SustainableCleaning
        </p>
        <p className="text-sm text-gray-600 italic">
          [Sample social media post - 40 words]
        </p>
      </>
    )
  },
  {
    icon: <Search className="text-canai-primary" size={28} />,
    title: "Website Audit Sample (SITE_AUDIT)",
    content: (
      <>
        <h3 className="text-lg font-bold mb-3">Homepage Analysis</h3>
        <p className="mb-4">
          Your homepage effectively communicates your value proposition, but the call-to-action placement 
          could be optimized. The hero section clearly states your services, however, the conversion 
          button is positioned below the fold on mobile devices, potentially reducing engagement rates.
        </p>
        <p className="text-sm text-gray-600 italic">
          [Sample website audit excerpt - 100 words from a 300-400 word analysis]
        </p>
      </>
    )
  }
];

const Samples = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canai-deep">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <CanAILogo size="md" />
        <Button 
          onClick={() => navigate('/discovery-hook')}
          variant="ghost"
          className="text-canai-light"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to Home
        </Button>
      </header>

      <main className="container mx-auto px-2 pb-12 pt-4">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-canai-light mb-4">
              Sample CanAI Outputs
            </h1>
            <p className="text-xl text-canai-light opacity-80">
              See the quality and depth of our AI-generated content
            </p>
          </div>

          {/* Responsive gallery grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {sampleCards.map((card, idx) => (
              <div
                key={idx}
                className="canai-card group flex flex-col p-7 h-full from-blue-100/60 to-cyan-100/80 rounded-2xl shadow-md 
                  transition-transform duration-200 hover:scale-[1.04] hover:shadow-[0_0_32px_#36d1fe99] border-2 border-transparent
                  hover:border-canai-primary/80 bg-gradient-to-br"
                style={{ minHeight: 330 }}
              >
                <div className="flex items-center space-x-3 mb-5">
                  {card.icon}
                  <h2 className="text-xl font-bold text-canai-light">{card.title}</h2>
                </div>
                <div className="bg-white rounded-lg p-6 text-gray-900 flex-1">
                  {card.content}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-8">
            <Button 
              onClick={() => navigate('/discovery-funnel')}
              size="lg" 
              className="canai-button-primary text-lg px-8 py-4 shadow-md hover:scale-105 animate-glow-pop"
            >
              Get Your Custom Content
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Samples;
