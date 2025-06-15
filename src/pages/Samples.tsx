
import React from "react";
import { FileText, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import SampleMetricBadge from "@/components/Samples/SampleMetricBadge";

// Card data lives here so that it's scalable to future additions/changes.
const sampleCards = [
  {
    icon: <FileText className="text-canai-primary drop-shadow-xl" size={34} />,
    title: "Business Plan Sample",
    subtitle: "EcoClean Solutions (BUSINESS_BUILDER)",
    content: (
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-canai-light mb-2 font-playfair animate-fade-in">
          Disrupting the $330B Cleaning Market
        </h3>
        <div className="space-y-2 text-canai-light/95">
          <p>
            <b className="text-canai-cyan font-extrabold">EcoClean Solutions</b> brings next-gen, sustainable cleaning powered by botanicals and IoT. Our <span className="font-semibold text-canai-cyan">eco-first</span> technology delivers <b>89% less waste</b> with <b>40% less labor</b>, cutting costs <b>25%</b> for offices, retail, and healthcare.
          </p>
          <p>
            Founded in 2024, we're built for scale. <span className="font-bold">Proprietary green agents</span> and smart sensors keep quality high <span className="text-canai-cyan">and the planet safe.</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-6 mb-3">
          <SampleMetricBadge label="Year 1 Revenue" value="$2.4M" emoji="💰" color="from-sky-500 to-blue-400" />
          <SampleMetricBadge label="Target Clients" value="150" emoji="🎯" color="from-fuchsia-600 to-pink-400"/>
          <SampleMetricBadge label="ROI" value="340%" emoji="📈" color="from-green-500 to-lime-400"/>
        </div>
        <hr className="my-3 border-canai-primary/30" aria-hidden="true"/>
        <p className="text-canai-light/70 italic text-sm px-2">
          [Excerpt from a full plan: projections, analysis, next steps]
        </p>
      </div>
    ),
  },
  {
    icon: <MessageSquare className="text-canai-primary drop-shadow-xl" size={34} />,
    title: "Social & Email Campaign",
    subtitle: "For SMB Owners (SOCIAL_EMAIL)",
    content: (
      <div className="space-y-5">
        <div>
          <div className="uppercase text-xs text-canai-cyan tracking-wider font-semibold mb-1">LinkedIn Post</div>
          <div className="bg-[rgba(21,44,71,0.98)] border-l-4 border-canai-primary rounded-lg px-5 py-3 text-canai-light/95 shadow animate-fade-in">
            <span className="font-bold text-canai-primary">🌱 Small changes, big impact!</span>
            <span className="block text-canai-light/90">
              Switch to eco-cleaning for savings <b className="text-canai-cyan">25% lower costs</b> <span aria-hidden>|</span> <b className="text-canai-cyan">40% faster</b>.<br />
              Ready to make the change? <span className="opacity-70">#EcoFriendly #SMB</span>
            </span>
          </div>
        </div>
        <div>
          <div className="uppercase text-xs text-pink-400 tracking-wider font-semibold mb-1">Email Subject</div>
          <div className="bg-[rgba(44,21,71,0.97)] border-l-4 border-pink-400 rounded-lg px-5 py-3 text-canai-light/95 font-semibold shadow">
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
    icon: <Search className="text-canai-primary drop-shadow-xl" size={34} />,
    title: "Website Audit Results",
    subtitle: "Homepage (SITE_AUDIT)",
    content: (
      <div>
        <h3 className="text-lg font-bold text-canai-light mb-1 font-playfair animate-fade-in">Performance At-a-Glance</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          <SampleMetricBadge label="Conversion Rate" value="2.1%" emoji="📉" color="from-pink-600 to-rose-400"/>
          <SampleMetricBadge label="Load Speed" value="4.2s" emoji="⚠️" color="from-yellow-400 to-amber-500"/>
          <SampleMetricBadge label="Mobile Friendly" value="95%" emoji="✅" color="from-green-500 to-lime-400"/>
        </div>
        <div className="text-canai-light/95 space-y-1">
          <p>
            <span className="font-semibold text-canai-primary">Key Opportunity:</span>
            <br />The main CTA is below-the-fold on mobile, reducing engagement up to <b>35%</b>. Moving it up could boost conversion to <span className="font-bold text-canai-cyan">3.4%</span>.
          </p>
          <p className="text-canai-light/70 italic text-sm pt-1">
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
    <div className="min-h-screen w-full bg-gradient-to-tl from-[#0A0F1C] to-[#00B2E3]/20 flex flex-col">
      <PageHeader showBackButton className="max-w-7xl mx-auto pt-9 pb-2 px-4" />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 pb-20 pt-3">
        <section className="max-w-6xl mx-auto space-y-14">
          <header className="text-center pb-8">
            <h1 className="font-playfair text-5xl md:text-6xl font-extrabold text-canai-light animate-fade-in mb-3 drop-shadow-xl">
              Explore CanAI Output Samples
            </h1>
            <p className="text-xl text-canai-light/90 animate-fade-in max-w-3xl mx-auto leading-relaxed font-medium mt-2" style={{ animationDelay: '0.12s' }}>
              These examples reflect the same design, polish, and intelligence your final deliverables receive.
              <br className="hidden md:block" />
              Full outputs are always custom and ready to use.
            </p>
          </header>
          {/* Card Grid */}
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {sampleCards.map((card, idx) => (
              <article
                key={card.title}
                className="group flex flex-col h-full rounded-2xl canai-product-card border-canai-primary transition-transform bg-[rgba(19,60,101,0.96)] hover:scale-105 hover:shadow-[0_0_44px_#36d1fee3] animate-fade-in duration-200"
                style={{ minHeight: 480, animationDelay: `${idx * 0.15 + 0.02}s` }}
                tabIndex={0}
                role="region"
                aria-labelledby={`sample-title-${idx}`}
              >
                <header className="flex items-center gap-3 mb-2 pt-7 px-7">
                  <span className="rounded-lg bg-canai-deep p-2 flex items-center justify-center shadow ring-canai-primary ring-2">
                    {card.icon}
                  </span>
                  <div>
                    <h2 id={`sample-title-${idx}`} className="font-manrope font-bold text-lg text-canai-primary tracking-wide leading-tight">{card.title}</h2>
                    <span className="block text-canai-light text-xs font-semibold">{card.subtitle}</span>
                  </div>
                </header>
                <section className="bg-[rgba(14,41,66,1)] rounded-xl p-7 mx-5 mb-7 text-canai-light/95 flex-1 shadow-lg overflow-hidden border border-canai-primary/10 space-y-1">
                  {card.content}
                </section>
              </article>
            ))}
          </div>
          {/* CTA Section */}
          <footer className="text-center pt-10 pb-7">
            <div className="max-w-2xl mx-auto mb-8">
              <h2 className="text-3xl font-playfair font-extrabold text-canai-light mb-2 drop-shadow animate-fade-in">Ready for Your Custom Content?</h2>
              <p className="text-canai-light/85 leading-relaxed font-medium text-lg animate-fade-in" style={{ animationDelay: '0.09s' }}>
                Get investor-ready plans, high-converting posts, or expert audits in hours.
                <br />
                See why <span className="font-bold text-canai-cyan">65% of users prefer CanAI outputs!</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => navigate('/discovery-funnel')}
                size="lg"
                variant="canai"
                className="canai-button-primary text-lg px-11 py-6 shadow-md hover:scale-105 animate-glow-pop min-w-[220px]"
              >
                Start Your Project
              </Button>
              <span className="text-base text-canai-light/80 font-semibold mt-2 sm:mt-0">
                ✨ 500+ plans created &nbsp;•&nbsp; 📈 65% prefer CanAI outputs
              </span>
            </div>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default Samples;
