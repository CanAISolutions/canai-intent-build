
import React from 'react';
import { FileText, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';

// Accent metric pill
const SampleMetric = ({
  label,
  value,
  color = "bg-gradient-to-r from-blue-400 to-cyan-500",
  emoji,
  className = "",
}: {
  label: string;
  value: string;
  color?: string;
  emoji?: string;
  className?: string;
}) => (
  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-semibold text-base ${color} shadow animate-fade-in font-manrope ${className}`}>
    {emoji && <span className="text-lg">{emoji}</span>}
    <span className="text-white/90">{label}</span>
    <span className="ml-1 text-white font-bold">{value}</span>
  </span>
);

// Sample output cards
const sampleCards = [
  {
    icon: <FileText className="text-canai-primary drop-shadow-lg" size={32} />,
    title: "Business Plan Sample",
    subtitle: "EcoClean Solutions (BUSINESS_BUILDER)",
    content: (
      <div>
        <h3 className="text-xl font-bold text-canai-cyan mb-2 font-playfair">
          Disrupting the $330B Cleaning Market
        </h3>
        <div className="space-y-2 text-canai-light">
          <p>
            <span className="font-semibold text-canai-primary">EcoClean Solutions</span> brings next-gen, sustainable cleaning powered by botanicals and IoT. Our <b className="text-canai-cyan">eco-first</b> technology delivers <b>89% less waste</b> with <b>40% less labor</b>, cutting costs <b>25%</b> for offices, retail, and healthcare.
          </p>
          <p>
            Founded in 2024, we're built for scale. <span className="font-semibold">Proprietary green agents</span> and smart sensors keep quality high <span className="text-canai-cyan">and the planet safe.</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 mb-3">
          <SampleMetric label="Year 1 Revenue" value="$2.4M" color="bg-gradient-to-r from-sky-500 to-blue-400" emoji="💰" />
          <SampleMetric label="Target Clients" value="150" color="bg-gradient-to-r from-fuchsia-600 to-pink-400" emoji="🎯" />
          <SampleMetric label="ROI" value="340%" color="bg-gradient-to-r from-green-500 to-lime-400" emoji="📈" />
        </div>
        <p className="text-canai-light/80 italic pt-1 text-sm">
          [Excerpt from a full plan: projections, analysis, next steps]
        </p>
      </div>
    ),
  },
  {
    icon: <MessageSquare className="text-canai-primary drop-shadow-lg" size={32} />,
    title: "Social & Email Campaign",
    subtitle: "For SMB Owners (SOCIAL_EMAIL)",
    content: (
      <div className="space-y-5">
        <div>
          <p className="uppercase text-xs text-canai-cyan tracking-wider font-semibold mb-1">LinkedIn Post</p>
          <div className="bg-[rgba(21,44,71,0.93)] border-l-4 border-canai-primary rounded-lg px-5 py-3">
            <span className="font-bold text-canai-primary">🌱 Small changes, big impact!</span>
            <span className="block text-canai-light/90">
              Switch to eco-cleaning for savings <b className="text-canai-cyan">25% lower costs</b> <span aria-hidden="true">|</span> <b className="text-canai-cyan">40% faster</b>.
              <br />Ready to make the change? <span className="opacity-70">#EcoFriendly #SMB</span>
            </span>
          </div>
        </div>
        <div>
          <p className="uppercase text-xs text-pink-400 tracking-wider font-semibold mb-1">Email Subject</p>
          <div className="bg-[rgba(44,21,71,0.92)] border-l-4 border-pink-400 rounded-lg px-5 py-3 text-canai-light font-medium">
            “How Sarah Cut Cleaning Costs <span className="text-canai-primary font-bold">25%</span> (and helped the planet)”
          </div>
        </div>
        <div>
          <span className="inline-flex items-center gap-1 text-canai-light/80 text-xs italic">
            [Includes 5 post templates & 3 persuasive emails]
          </span>
        </div>
      </div>
    ),
  },
  {
    icon: <Search className="text-canai-primary drop-shadow-lg" size={32} />,
    title: "Website Audit Results",
    subtitle: "Homepage (SITE_AUDIT)",
    content: (
      <div>
        <h3 className="text-lg font-bold text-canai-cyan mb-1">Performance At-a-Glance</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <SampleMetric label="Conversion Rate" value="2.1%" color="bg-gradient-to-r from-pink-600 to-rose-400" emoji="📉" />
          <SampleMetric label="Load Speed" value="4.2s" color="bg-gradient-to-r from-yellow-400 to-amber-500" emoji="⚠️" />
          <SampleMetric label="Mobile Friendly" value="95%" color="bg-gradient-to-r from-green-500 to-lime-400" emoji="✅" />
        </div>
        <div className="text-canai-light space-y-1">
          <p>
            <span className="font-semibold text-canai-primary">Key Opportunity:</span>
            <br />The main CTA is below-the-fold on mobile, reducing engagement up to <b>35%</b>. Moving it up could boost conversion to <span className="font-bold text-canai-cyan">3.4%</span>.
          </p>
          <p className="text-canai-light/80 italic pt-1 text-sm">
            [From a detailed 350-word audit, including actionable website fixes]
          </p>
        </div>
      </div>
    ),
  }
];

const Samples = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-tl from-[#0A0F1C] to-[#00B2E3]/25 flex flex-col">
      {/* Consistent page header */}
      <PageHeader showBackButton className="max-w-7xl mx-auto pt-8 pb-2 px-4" />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-16 pt-2">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Title & subtitle */}
          <div className="text-center pb-6">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-canai-light animate-fade-in mb-2 drop-shadow-xl">
              Explore CanAI Output Samples
            </h1>
            <p className="text-xl text-canai-light/95 animate-fade-in max-w-3xl mx-auto leading-relaxed font-medium" style={{ animationDelay: '0.13s' }}>
              These examples reflect the same design, polish, and intelligence your final deliverables receive.<br className="hidden md:block" />
              Full outputs are always custom and ready to use.
            </p>
          </div>
          {/* Gallery grid */}
          <div className="grid gap-9 md:grid-cols-2 lg:grid-cols-3">
            {sampleCards.map((card, idx) => (
              <div
                key={idx}
                className="flex flex-col h-full rounded-2xl canai-product-card border-canai-primary transition-transform hover:scale-102 hover:shadow-[0_0_40px_#36d1fee3] bg-[rgba(19,60,101,0.90)] animate-fade-in"
                style={{
                  minHeight: 470,
                  animationDelay: `${idx * 0.13 + 0.1}s`
                }}
              >
                <div className="flex items-center gap-3 mb-3 pt-7 px-7">
                  {card.icon}
                  <div>
                    <h2 className="font-manrope font-bold text-lg text-canai-primary tracking-wide leading-tight">{card.title}</h2>
                    <span className="block text-canai-light text-xs font-semibold">{card.subtitle}</span>
                  </div>
                </div>
                <div className="bg-[rgba(14,41,66,0.99)] rounded-xl p-7 mx-5 mb-5 text-white/90 flex-1 shadow-lg overflow-hidden border border-canai-primary/10">
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
                Get investor-ready plans, high-converting posts, or expert audits in hours.<br />
                See why 65% of users prefer CanAI outputs!
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
              <p className="text-base text-canai-light/80 font-semibold mt-2 sm:mt-0">
                ✨ 500+ plans created &nbsp;•&nbsp; 📈 65% prefer CanAI outputs
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Samples;
