
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import ProjectContextSummary from "@/components/SparkSplit/ProjectContextSummary";
import RefinedComparisonContainer from "@/components/SparkSplit/RefinedComparisonContainer";
import EmotionalCompass from "@/components/SparkSplit/EmotionalCompass";
import TrustDeltaDisplay from "@/components/SparkSplit/TrustDeltaDisplay";
import RefinedFeedbackForm from "@/components/SparkSplit/RefinedFeedbackForm";

// Circuit breaker for negative engagement tracking
let negativeEngagementCount = 0;
const CIRCUIT_BREAKER_THRESHOLD = 50;

// Edge fallback UI (F8-E1)
const F8EdgeFallback = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[250px] error-fallback text-center bg-canai-deep border border-red-400 p-8 rounded-xl mt-8">
    <div className="text-xl mb-3 font-semibold text-red-400">{message}</div>
    <div className="text-canai-light">Sensitive data has been encrypted with supabase/vault.</div>
  </div>
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

  // Demo CanAI output based on Sprinkle Haven Bakery
  const demoCanaiOutput = useMemo(
    () =>
      `**Sprinkle Haven Bakery: A Sweet Investment Opportunity**

Sprinkle Haven Bakery represents more than just another bakery—we're crafting a community hub where Denver families discover the joy of truly organic, artisanal pastries. Our warm, family-first approach sets us apart in a market dominated by impersonal chains like Blue Moon Bakery.

**The Opportunity:**
Denver's growing health-conscious family demographic seeks authentic, organic options for their children. We're positioned to capture this $2.3M local market with our unique community-focused approach.

**Our Secret Sauce:**
- 100% organic, locally-sourced ingredients
- Warm, inviting atmosphere designed for families
- Community events that build lasting relationships
- Transparent baking process that parents trust

**Financial Projections:**
With our $50,000 investment and dedicated team of 3, we project:
- Year 1: $180,000 revenue (break-even month 8)
- Year 2: $340,000 revenue (28% profit margin)
- Year 3: $520,000 revenue, ready for second location

Our 6-month runway allows for careful market entry and relationship building—the foundation of sustainable growth in the artisanal bakery space.`,
    []
  );

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
        // <!-- TODO: POST /v1/spark-split -->
        // This would call the actual API endpoint
        // const response = await fetch("/v1/spark-split", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     canaiOutput: demoCanaiOutput,
        //     promptId,
        //   }),
        // });

        // MOCK API RESPONSE for demonstration
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

        const mockData = {
          canaiOutput: demoCanaiOutput,
          genericOutput: `Sprinkle Haven Bakery Business Plan

Sprinkle Haven Bakery is a bakery business located in Denver, Colorado. The business targets families in the Denver area and competes with Blue Moon Bakery.

Business Overview:
- Product: Pastries and baked goods
- Target Market: Local families
- Competition: Blue Moon Bakery
- Budget: $50,000
- Team: 3 people
- Timeline: 6 months

Revenue Model:
The business will generate revenue through direct sales and catering events.

Financial Requirements:
The business seeks funding to support startup costs and initial operations.

Business Goals:
The primary objective is to secure investor funding for business growth and expansion.`,
          trustDelta: 2.3,
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

        // Performance check (<2s requirement)
        const loadTime = performance.now() - startTime;
        if (loadTime > 2000) {
          console.warn(`SparkSplit load time exceeded 2s: ${loadTime}ms`);
        }

      } catch (err) {
        // F8-E1 edge case: Retry 3 times with exponential backoff
        if (retry < 3) {
          setTimeout(() => setRetryCount(count => count + 1), Math.pow(2, retry) * 1000);
          return;
        }
        
        setError("Comparison failed to load");
        setLoading(false);
        // Supabase: Log error and encrypt sensitive data with supabase/vault
        console.error("SparkSplit load failed:", err);
      }
    },
    [demoCanaiOutput, promptId]
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
      // <!-- TODO: POST /v1/spark-split feedback submission -->
      // Supabase: comparisons.user_feedback, comparisons.trust_delta
      // await fetch("/v1/spark-split/feedback", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     promptId,
      //     trustDelta,
      //     userFeedback: feedback,
      //     selection,
      //   }),
      // });

      // MOCK submission
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
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#00B2E3] py-8 px-4">
        <div className="mx-auto w-full max-w-7xl bg-[#172b47e0] rounded-2xl shadow-strong backdrop-blur-xl border border-canai-primary p-6 md:p-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-64 bg-gray-700 rounded-xl"></div>
              <div className="h-64 bg-gray-700 rounded-xl"></div>
            </div>
            <div className="h-32 bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#00B2E3] py-8 px-4">
        <div className="mx-auto w-full max-w-7xl">
          <F8EdgeFallback message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#00B2E3] py-8 px-4">
      <div className="mx-auto w-full max-w-7xl bg-[#172b47e0] rounded-2xl shadow-strong backdrop-blur-xl border border-canai-primary p-6 md:p-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold canai-gradient-text mb-4">
              Compare Your Personalized Plan
            </h1>
            <p className="text-canai-light text-lg">
              See how CanAI's personalized approach compares to generic AI outputs
            </p>
          </div>

          {/* Main comparison layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Left sidebar - Context Summary */}
            <div className="xl:col-span-1">
              <ProjectContextSummary />
            </div>

            {/* Main content area */}
            <div className="xl:col-span-3 space-y-8">
              {/* Comparison containers */}
              {canaiOutput && genericOutput && (
                <RefinedComparisonContainer
                  canaiOutput={canaiOutput}
                  genericOutput={genericOutput}
                />
              )}

              {/* Circuit breaker fallback - CanAI only */}
              {canaiOutput && !genericOutput && negativeEngagementCount >= CIRCUIT_BREAKER_THRESHOLD && (
                <div className="bg-gradient-to-br from-[#1E314F] to-[#2A4A6B] rounded-xl border-2 border-[#00CFFF] shadow-xl p-8">
                  <h3 className="text-xl font-bold text-[#00CFFF] mb-4">Your Personalized Plan</h3>
                  <div className="text-base leading-relaxed text-canai-light prose prose-invert max-w-none">
                    {canaiOutput}
                  </div>
                  <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-400">
                    <p className="text-sm text-blue-200">
                      📊 Based on user feedback, we're focusing on delivering your personalized plan. 
                      Generic comparison temporarily unavailable.
                    </p>
                  </div>
                </div>
              )}

              {/* Emotional Compass and Trust Delta */}
              {emotionalResonance && trustDelta !== null && (
                <div className="bg-[#172b47] rounded-xl border border-[#36d1fe66] p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <EmotionalCompass 
                      scores={emotionalResonance.compassScores}
                      title="CanAI Emotional Resonance"
                    />
                    <TrustDeltaDisplay 
                      delta={trustDelta}
                      onTooltipView={handleTrustDeltaView}
                    />
                  </div>
                  
                  {/* Hume AI validation warning */}
                  {emotionalResonance.isFlagged && (
                    <div className="mt-6 p-4 bg-yellow-900/30 rounded-lg border border-yellow-400">
                      <p className="text-yellow-200 text-sm">
                        ⚠️ Emotional resonance scores are below quality thresholds and flagged for review.
                      </p>
                    </div>
                  )}
                </div>
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
            </div>
          </div>

          {/* API Integration Comments */}
          {/* 
            Supabase Mapping:
            - comparisons.trust_delta -> trustDelta state
            - comparisons.emotional_resonance -> emotionalResonance state  
            - comparisons.user_feedback -> feedback state
            
            PostHog Events:
            - plan_compared: Triggered on load and selection change
            - trustdelta_viewed: Triggered on tooltip interaction
            - generic_preferred: Triggered when generic output selected
          */}

          {/* Footer note */}
          <div className="text-center text-xs text-canai-light pt-8 border-t border-[#36d1fe33]">
            CanAI excludes branding elements. Contact us for design partnership opportunities.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparkSplit;
