
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import ProjectContextSummary from "@/components/SparkSplit/ProjectContextSummary";
import RefinedComparisonContainer from "@/components/SparkSplit/RefinedComparisonContainer";
import EmotionalCompass from "@/components/SparkSplit/EmotionalCompass";
import TrustDeltaDisplay from "@/components/SparkSplit/TrustDeltaDisplay";
import RefinedFeedbackForm from "@/components/SparkSplit/RefinedFeedbackForm";
import SparkleIcon from "@/components/SparkSplit/SparkleIcon";
import StandardBackground from "@/components/StandardBackground";
import StandardCard from "@/components/StandardCard";
import { PageTitle, BodyText } from "@/components/StandardTypography";

// Circuit breaker for negative engagement tracking
let negativeEngagementCount = 0;
const CIRCUIT_BREAKER_THRESHOLD = 50;

// Edge fallback UI (F8-E1)
const F8EdgeFallback = ({ message }: { message: string }) => (
  <StandardCard variant="form" className="text-center border-red-400/50">
    <div className="text-xl mb-3 font-semibold text-red-400">{message}</div>
    <div className="text-[#E6F6FF]">Sensitive data has been encrypted with supabase/vault.</div>
  </StandardCard>
);

// Constants for PRD alignment - Sprinkle Haven Bakery example
const EXAMPLE_BUSINESS = {
  businessName: "Sprinkle Haven Bakery",
  targetAudience: "Denver families",
  primaryGoal: "funding",
  competitiveContext: "Blue Moon Bakery",
  brandVoice: "warm",
  resourceConstraints: "$50k budget; team of 3; 6 months",
  currentStatus: "Planning phase",
  businessDescription: "Artisanal bakery offering organic pastries",
  revenueModel: "Sales, events",
  planPurpose: "investor",
  location: "Denver, CO",
  uniqueValue: "Organic, community-focused pastries",
};

type EmotionalResonance = {
  canaiScore: number;
  genericScore: number;
  delta: number;
  arousal: number;
  valence: number;
  compassScores: {
    awe: number;
    ownership: number;
    wonder: number;
    calm: number;
    power: number;
  };
  isFlagged?: boolean;
};

const getPromptId = (search: URLSearchParams) =>
  search.get("prompt_id") || search.get("promptId") || "demo-prompt";

// Enhanced demo data from the example provided
const EXAMPLE_CANAI_OUTPUT = `Sprinkle Haven Bakery is more than a place to buy pastries—it's a heartfelt invitation to reconnect, savor, and belong. Located in the heart of Denver, this cozy haven blends the aroma of artisan baking with the warmth of neighborhood camaraderie. The dream is bold yet deeply rooted: to secure $75,000 in funding to open a flagship store that welcomes families, inspires young professionals, and becomes the soul of the local community.

With a mission anchored in handcrafted excellence and human connection, Sprinkle Haven will serve as a canvas for shared stories—through flaky croissants, personalized cakes, and intimate coffee conversations. Behind this vision is a passionate team of three, determined to create a space where every visit feels like coming home.

Denver's evolving demographic presents a powerful market opportunity. With an influx of young professionals and a strong emphasis on supporting local businesses, the city is primed for a boutique bakery that offers more than just food—it offers belonging. Competitors like Starbucks dominate through convenience, and The Denver Brew leverages a hipster vibe with strong loyalty programs. But neither captures the homegrown, emotionally resonant experience Sprinkle Haven delivers.

We will differentiate through hyper-local sourcing, event-driven engagement (story time for kids, latte art nights), and exceptional product personalization. Regulatory costs in Denver include a $1,000 retail food establishment license and approximately $2,500 in permitting and health inspection fees.

Our growth strategy is designed to scale trust as fast as it scales traffic. We'll allocate $3,000 to targeted social media campaigns showcasing our unique offerings, behind-the-scenes baking, and community events. Another $2,000 will go to offline initiatives like farmer's market pop-ups and branded sampling days.

With the right partner, we'll bring this dream—and its flavor—to life.`;

const EXAMPLE_GENERIC_OUTPUT = `Sprinkle Haven Bakery aims to launch a local retail bakery in Denver, Colorado, targeting families and professionals. The primary objective is to secure $75,000 in angel funding to open a physical storefront. The bakery will offer artisan pastries, custom cakes, and coffee, and intends to engage the community through hosted events.

Currently in pre-launch, the team of three is building a pitch deck and preparing operations under a $50,000 internal budget, with a six-month launch timeline.

Denver's market shows a steady demand for boutique food experiences, with an emerging trend toward local, community-focused eateries. Target demographics include families seeking wholesome experiences and professionals seeking high-quality quick service. The competitive landscape includes Starbucks, with strong brand presence and loyalty programs, and The Denver Brew, a popular independent café with a strong following.

Regulatory costs include health permits ($2,500) and a business license ($1,000). Positioning will rely on product quality, local engagement, and competitive pricing.

To grow, Sprinkle Haven will invest $3,000 in digital advertising, and $2,000 in local offline campaigns including pop-ups and promotions. The business intends to build brand recognition before launch through a 1,500-member email list and $20,000 in pre-orders.

Milestones include securing funding, lease signing, buildout completion, team hiring, and grand opening. Contingency plans include offering mobile services or modifying menu scope in case of capital or supply constraints. This business plan serves as a basis for funding consideration.`;

const SparkSplit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // State management
  const [canaiOutput, setCanaiOutput] = useState<string | null>(null);
  const [genericOutput, setGenericOutput] = useState<string | null>(null);
  const [trustDelta, setTrustDelta] = useState<number | null>(null);
  const [emotionalResonance, setEmotionalResonance] = useState<EmotionalResonance | null>(null);
  const [loading, setLoading] = useState(true);
  const [selection, setSelection] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [retryCount, setRetryCount] = useState<number>(0);

  const promptId = getPromptId(searchParams);

  // Demo data with enhanced examples
  const demoCanaiOutput = useMemo(() => EXAMPLE_CANAI_OUTPUT, []);
  const demoGenericOutput = useMemo(() => EXAMPLE_GENERIC_OUTPUT, []);

  // Fetch comparison data with circuit breaker logic
  const fetchSparkSplit = useCallback(
    async (retry = 0) => {
      setLoading(true);
      setError(null);
      
      // Circuit breaker check
      if (negativeEngagementCount >= CIRCUIT_BREAKER_THRESHOLD) {
        console.warn("Circuit breaker activated - showing CanAI output only");
        setCanaiOutput(demoCanaiOutput);
        setGenericOutput(null);
        setTrustDelta(null);
        setEmotionalResonance(null);
        setLoading(false);
        return;
      }

      const startTime = performance.now();
      
      try {
        // TODO: POST /v1/spark-split
        await new Promise(resolve => setTimeout(resolve, 300));

        const mockData = {
          canaiOutput: demoCanaiOutput,
          genericOutput: demoGenericOutput,
          trustDelta: 4.1,
          emotionalResonance: {
            canaiScore: 0.89,
            genericScore: 0.42,
            delta: 0.47,
            arousal: 0.75,
            valence: 0.82,
            compassScores: {
              awe: 0.85,
              ownership: 0.92,
              wonder: 0.78,
              calm: 0.65,
              power: 0.88
            }
          }
        };

        setCanaiOutput(mockData.canaiOutput);
        setGenericOutput(mockData.genericOutput);
        setTrustDelta(mockData.trustDelta);
        setEmotionalResonance(mockData.emotionalResonance);
        setLoading(false);

        // PostHog: plan_compared event
        if (window.posthog) {
          window.posthog.capture("plan_compared", {
            trustDelta: mockData.trustDelta,
            selected: null,
            emotionalResonance: { delta: mockData.emotionalResonance.delta },
          });
        }

        const loadTime = performance.now() - startTime;
        if (loadTime > 2000) {
          console.warn(`SparkSplit load time exceeded 2s: ${loadTime}ms`);
        }

      } catch (err) {
        if (retry < 3) {
          setTimeout(() => setRetryCount(count => count + 1), Math.pow(2, retry) * 1000);
          return;
        }
        
        setError("Comparison failed to load");
        setLoading(false);
        console.error("SparkSplit load failed:", err);
      }
    },
    [demoCanaiOutput, demoGenericOutput, promptId]
  );

  // Retry trigger
  useEffect(() => {
    fetchSparkSplit(retryCount);
  }, [retryCount, fetchSparkSplit]);

  // Handle user selection
  const handleSelection = (value: string) => {
    setSelection(value);
    setFeedback("");
    
    // Track negative engagement for circuit breaker
    if (value === 'generic' || value === 'neither') {
      negativeEngagementCount++;
    }

    // PostHog: plan_compared with selection
    if (window.posthog && trustDelta && emotionalResonance) {
      window.posthog.capture("plan_compared", {
        trustDelta,
        selected: value,
        emotionalResonance: { delta: emotionalResonance.delta },
      });
    }

    // PostHog: generic_preferred
    if (value === 'generic' && window.posthog) {
      window.posthog.capture("generic_preferred", { feedback: "" });
    }
  };

  // Handle Trust Delta tooltip view
  const handleTrustDeltaView = () => {
    if (window.posthog && trustDelta) {
      window.posthog.capture("trustdelta_viewed", { score: trustDelta });
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: POST /v1/spark-split feedback submission
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: "Thank you for your feedback!",
        description: "Your preferences help us improve our AI to better match your vision.",
      });

      // Reset form
      setSelection("");
      setFeedback("");

    } catch (err) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <StandardBackground>
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <StandardCard variant="form">
            <div className="animate-pulse space-y-12">
              <div className="h-12 bg-gradient-to-r from-[#36d1fe]/30 to-[#00B2E3]/30 rounded-2xl w-2/3 mx-auto"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-80 bg-gradient-to-br from-[#36d1fe]/20 to-[#00B2E3]/20 rounded-3xl"></div>
                <div className="h-80 bg-gradient-to-br from-gray-600/20 to-gray-500/20 rounded-3xl"></div>
              </div>
              <div className="h-48 bg-gradient-to-r from-[#36d1fe]/20 to-[#00B2E3]/20 rounded-3xl"></div>
            </div>
          </StandardCard>
        </div>
      </StandardBackground>
    );
  }

  if (error) {
    return (
      <StandardBackground>
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <F8EdgeFallback message={error} />
        </div>
      </StandardBackground>
    );
  }

  return (
    <StandardBackground>
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <StandardCard variant="form">
          <div className="space-y-14">
            {/* Header */}
            <div className="text-center space-y-4 animate-fade-in">
              <PageTitle className="animate-text-glow mb-4">
                Side-by-Side Plan Comparison
              </PageTitle>
              <BodyText className="text-xl max-w-4xl mx-auto leading-relaxed">
                Discover how <span className="font-semibold text-[#36d1fe]">CanAI's personalized magic</span> stacks up against the average AI suggestion for your business.
              </BodyText>
            </div>

            {/* Main comparison layout */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 relative">
              {/* Left sidebar - Context Summary */}
              <div className="xl:col-span-1 space-y-8">
                <ProjectContextSummary />
              </div>

              {/* Main content area */}
              <div className="xl:col-span-3 space-y-14">
                {/* Comparison containers */}
                {canaiOutput && genericOutput && (
                  <RefinedComparisonContainer
                    canaiOutput={canaiOutput}
                    genericOutput={genericOutput}
                  />
                )}

                {/* Circuit breaker fallback - CanAI only */}
                {canaiOutput && !genericOutput && negativeEngagementCount >= CIRCUIT_BREAKER_THRESHOLD && (
                  <StandardCard variant="product">
                    <h3 className="text-2xl font-bold text-[#36d1fe] mb-6">Your Personalized Plan</h3>
                    <div className="text-lg leading-relaxed text-[#E6F6FF] prose prose-invert max-w-none break-words" style={{ whiteSpace: 'pre-wrap' }}>
                      {canaiOutput}
                    </div>
                    <StandardCard variant="glass" padding="md" className="mt-8">
                      <BodyText className="mb-0">
                        📊 Based on user feedback, we're focusing on delivering your personalized plan. 
                        Generic comparison temporarily unavailable.
                      </BodyText>
                    </StandardCard>
                  </StandardCard>
                )}

                {/* Emotional Compass & Trust Delta */}
                {emotionalResonance && trustDelta !== null && (
                  <StandardCard variant="content" className="animate-fade-in">
                    <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-0">
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="md:mb-0 mb-8">
                          <EmotionalCompass 
                            scores={emotionalResonance.compassScores}
                            title="CanAI Emotional Resonance"
                          />
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col items-center justify-center">
                        <TrustDeltaDisplay 
                          delta={trustDelta}
                          onTooltipView={handleTrustDeltaView}
                        />
                      </div>
                    </div>
                  </StandardCard>
                )}

                {/* Feedback Form */}
                {!loading && canaiOutput && (
                  <RefinedFeedbackForm
                    selection={selection}
                    onSelection={handleSelection}
                    feedback={feedback}
                    onFeedback={setFeedback}
                    onSubmit={handleFormSubmit}
                    isSubmitting={isSubmitting}
                  />
                )}

                {/* Footer: Social Proof / Divider */}
                <div className="pt-12 border-t border-[#36d1fe]/30 flex flex-col items-center gap-2">
                  <div className="font-playfair text-[#36d1fe] text-lg animate-countup-glow font-semibold tracking-wider">
                    <SparkleIcon className="scale-110 mr-1" />
                    500+ founders trust CanAI to compare & refine their plans
                  </div>
                  <div className="text-[#cce7fa] text-xs opacity-70 text-center">
                    CanAI excludes branding elements. Contact us for design partnership opportunities.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </StandardCard>
      </div>
    </StandardBackground>
  );
};

export default SparkSplit;
