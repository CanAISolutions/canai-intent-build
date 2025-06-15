
import React from 'react';
import { FileText, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

const SampleMetric = ({
  label,
  value,
  color = "bg-gray-700",
  emoji,
  className = "",
}: {
  label: string;
  value: string;
  color?: string;
  emoji?: string;
  className?: string;
}) => (
  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-base ${color} bg-opacity-85 shadow font-manrope ${className}`}>
    {emoji && <span className="text-lg">{emoji}</span>}
    <span className="text-white">{label}:</span>
    <span className="ml-1 text-white font-bold">{value}</span>
  </span>
);

const sampleCards = [
  {
    icon: <FileText className="text-canai-primary drop-shadow-lg" size={30} />,
    title: "Business Plan Sample (BUSINESS_BUILDER)",
    content: (
      <div>
        <h3 className="text-2xl font-extrabold mb-3 text-white drop-shadow font-playfair">
          EcoClean Solutions – Executive Summary
        </h3>
        <p className="mb-3 text-white/90 text-base">
          <strong className="font-semibold text-canai-cyan">EcoClean Solutions</strong> revolutionizes commercial cleaning through sustainable practices and technology. Our eco-first approach reduces environmental impact by <span className="font-bold text-canai-primary">89%</span>, delivering superior results for offices, retailers, and healthcare facilities.
        </p>
        <p className="mb-2 text-white/85 text-base">
          Founded in 2024, we address demand for truly responsible cleaning in the <span className="font-semibold">global $330B market</span>. Our proprietary botanical agents & IoT-enabled monitoring cut time by <span className="font-bold text-canai-primary">40%</span> and reduce costs by <span className="font-bold text-canai-primary">25%</span>.
        </p>
        <div className="flex flex-wrap gap-2 my-5">
          <SampleMetric label="Projected Revenue (Year 1)" value="$2.4M" color="bg-gradient-to-r from-cyan-600 to-blue-400" emoji="📊" />
          <SampleMetric label="Target Clients" value="150" color="bg-gradient-to-r from-fuchsia-600 to-pink-400" emoji="🎯" />
          <SampleMetric label="ROI" value="340%" color="bg-gradient-to-r from-green-500 to-lime-400" emoji="💡" />
        </div>
        <p className="text-sm text-canai-light/80 italic pt-1">
          [Excerpt from a full 750-word plan including projections, market analysis & next steps]
        </p>
      </div>
    )
  },
  {
    icon: <MessageSquare className="text-canai-primary drop-shadow-lg" size={30} />,
    title: "Social Media Posts (SOCIAL_EMAIL)",
    content: (
      <div className="flex flex-col gap-5">
        <div className="mb-1">
          <p className="uppercase text-xs text-canai-cyan/70 tracking-wider mb-1">LinkedIn Post</p>
          <div className="bg-[rgba(21,44,71,0.9)] border-l-4 border-canai-primary/70 rounded-xl px-4 py-3 mb-1">
            <p className="text-white font-medium text-base mb-1">
              🌱 <span className="font-extrabold text-canai-primary">Small changes, big impact!</span>
              <br />
              Switching to eco-friendly cleaning isn’t just better for the planet—it’s better for your team’s health and your bottom line.
              <span className="block mt-1">
                Clients see <span className="font-semibold text-canai-cyan">25% cost savings</span> + <span className="font-semibold text-canai-cyan">40% faster results</span>.
                Ready to make the change? <span className="opacity-80">#EcoFriendly #SmallBusiness</span>
              </span>
            </p>
          </div>
        </div>
        <div>
          <p className="uppercase text-xs text-pink-400 tracking-wider mb-1">Email Subject</p>
          <div className="bg-[rgba(44,21,71,0.89)] border-l-4 border-pink-400/70 rounded-xl px-4 py-3">
            <span className="text-white font-medium">
              “How Sarah Cut Her Cleaning Costs by <span className="font-semibold text-canai-primary">25%</span> (and helped save the planet)”
            </span>
          </div>
        </div>
        <p className="text-sm text-canai-light/80 italic pt-1 font-medium">
          [Sample from 5 posts + 3 targeted emails with eye-catching CTAs]
        </p>
      </div>
    )
  },
  {
    icon: <Search className="text-canai-primary drop-shadow-lg" size={30} />,
    title: "Website Audit Sample (SITE_AUDIT)",
    content: (
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-white mb-1">Homepage Performance Analysis</h3>
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex gap-2">
            <span className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-600 to-red-400 text-white font-bold text-base shadow-md">
              Conversion Rate <span className="ml-2 text-red-200">2.1% 📉</span>
            </span>
            <span className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold text-base shadow-md">
              Page Load Speed <span className="ml-2 text-yellow-100">4.2s ⚠️</span>
            </span>
            <span className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-green-400 to-lime-400 text-white font-bold text-base shadow-md">
              Mobile Friendly <span className="ml-2 text-green-50">95% ✅</span>
            </span>
          </div>
        </div>
        <p className="text-white text-base">
          <span className="font-semibold text-canai-primary">Key Issue:</span>{" "}
          CTA button is below the fold on mobile, potentially reducing engagement by <b>35%</b>.
          Moving it up could increase conversions to <span className="font-semibold text-canai-primary">3.4%</span>.
        </p>
        <p className="text-sm text-canai-light/80 italic pt-1 font-medium">
          [Sample from a detailed 350-word audit with actionable recommendations]
        </p>
      </div>
    )
  }
];

const Samples = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-tl from-[#0A0F1C] to-[#00B2E3]/20 flex flex-col">
      {/* Consistent page header with logo and back button */}
      <PageHeader 
        showBackButton={true} 
        className="max-w-7xl mx-auto pt-7 pb-3 px-4" 
      />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-16 pt-2">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Title & subtitle */}
          <div className="text-center pb-7">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-canai-light animate-fade-in mb-2 drop-shadow-lg">
              Sample CanAI Outputs
            </h1>
            <p className="text-xl text-canai-light/95 animate-fade-in max-w-3xl mx-auto leading-relaxed font-medium" style={{ animationDelay: '0.12s' }}>
              Experience the quality, depth, and intelligence of our AI-generated content.<br className="hidden md:block"/> 
              Each output is personalized, professionally crafted, and ready to use.
            </p>
          </div>
          {/* Gallery grid */}
          <div className="grid gap-10 lg:grid-cols-3 md:grid-cols-2">
            {sampleCards.map((card, idx) => (
              <div
                key={idx}
                className="flex flex-col h-full rounded-2xl shadow-lg border-2 border-canai-primary/80 transition-transform duration-200 hover:scale-[1.025] hover:shadow-[0_0_42px_#36d1fecc] bg-[rgba(19,60,101,0.82)] animate-fade-in"
                style={{ 
                  minHeight: 520,
                  animationDelay: `${idx * 0.1 + 0.1}s`
                }}
              >
                <div className="flex items-center space-x-3 mb-5 pt-6 px-7">
                  {card.icon}
                  <h2 className="font-manrope font-extrabold text-base md:text-lg text-canai-primary text-glow-hero tracking-wide leading-tight">
                    {card.title}
                  </h2>
                </div>
                <div className="bg-[rgba(14,41,66,0.96)] rounded-xl p-7 mx-5 mb-6 text-white/90 flex-1 shadow-lg overflow-hidden border border-canai-primary/10">
                  {card.content}
                </div>
              </div>
            ))}
          </div>
          {/* CTA Section */}
          <div className="text-center pt-12 pb-8">
            <div className="max-w-2xl mx-auto mb-8">
              <h2 className="text-2xl font-playfair font-bold text-canai-light mb-3 drop-shadow">
                Ready for Your Custom Content?
              </h2>
              <p className="text-canai-light opacity-90 leading-relaxed font-medium">
                Get personalized, investor-ready content tailored to your goals.<br />
                Choose business plans, social content, or site audits – delivered in hours.
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
              <p className="text-base text-canai-light/80 font-semibold">
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
