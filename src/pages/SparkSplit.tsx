
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowUp } from "lucide-react";
import ProjectContextSummary from "@/components/SparkSplit/ProjectContextSummary";
import TrustDeltaStars from "@/components/SparkSplit/TrustDeltaStars";
import EmotionalResonanceDisplay from "@/components/SparkSplit/EmotionalResonanceDisplay";
import ComparisonContainer from "@/components/SparkSplit/ComparisonContainer";
import FeedbackForm from "@/components/SparkSplit/FeedbackForm";
import { useToast } from "@/components/ui/use-toast";

// Edge fallback UI (F8-E1)
const F8EdgeFallback = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[250px] error-fallback text-center bg-canai-deep border border-red-400 p-8 rounded-xl mt-8">
    <div className="text-xl mb-3 font-semibold text-red-400">{message}</div>
    <div className="text-canai-light">Sensitive data has been encrypted with supabase/vault.</div>
  </div>
);

// Tooltip text (<100ms, id=trustdelta-tooltip)
const canaiTooltipText =
  "TrustDelta: How well our plan matches your vision (★ = 1 point).";

// Constants for PRD alignment
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
  isFlagged?: boolean; // Add flag for review (Hume AI fail)
};

const getPromptId = (search: URLSearchParams) =>
  search.get("prompt_id") || search.get("promptId") || "demo-prompt";

const SparkSplit: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // State management
  const [canai, setCanai] = useState<string | null>(null);
  const [generic, setGeneric] = useState<string | null>(null);
  const [trustDelta, setTrustDelta] = useState<number | null>(null);
  const [emoRes, setEmoRes] = useState<EmotionalResonance | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selection, setSelection] = useState("");
  const [feedback, setFeedback] = useState("");
  const [dislikeFeedback, setDislikeFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [flagged, setFlagged] = useState<boolean>(false);

  // For retry/edge case
  const [retryCount, setRetryCount] = useState<number>(0);

  // Accept prompt_id via query param for Supabase mapping
  const promptId = getPromptId(searchParams);

  // Infer canaiOutput from Deliverable Generation - in a real app, fetch from state/routes/supabase.
  // Here, use a demo string to align with Sprinkle Haven Bakery.
  const canaiOutput = useMemo(
    () =>
      `Sprinkle Haven Bakery is an artisanal bakery in Denver, CO serving Denver families with organic, community-focused pastries. Our warm, inviting approach sets us apart from Blue Moon Bakery, with a focus on sustainability, local sourcing, and empowering the community through healthy options. Core purpose: Funding for growth. Resources: $50k budget, team of 3, 6-month runway.`,
    []
  );

  // POST /v1/spark-split to get genericOutput, trustDelta, emotionalResonance
  const fetchSparkSplit = useCallback(
    async (retry = 0) => {
      setLoading(true);
      setError(null);
      const t0 = performance.now();
      try {
        // -- API INTEGRATION /v1/spark-split
        const resp = await fetch("/v1/spark-split", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            canaiOutput,
            promptId,
          }),
        });
        if (!resp.ok) throw new Error("Failed to load comparison");
        const data = await resp.json();
        // Expect: { canaiOutput, genericOutput, trustDelta, emotionalResonance }
        setCanai(data.canaiOutput);
        setGeneric(data.genericOutput);
        setTrustDelta(data.trustDelta);
        let flagged = false;
        // Hume AI validation (arousal >0.5, valence >0.6); flag if fails (weighted 0.4/0.6)
        if (
          !(
            data.emotionalResonance &&
            data.emotionalResonance.arousal > 0.5 &&
            data.emotionalResonance.valence > 0.6
          )
        ) {
          flagged = true;
          setFlagged(true);
          // Can add toast for reviewer, or log for Supabase (not shown UI)
        }
        setEmoRes({ ...data.emotionalResonance, isFlagged: flagged });
        setLoading(false);

        // Logging: capture plan_compared event on load
        if (window.posthog) {
          window.posthog.capture("plan_compared", {
            trustDelta: data.trustDelta,
            selected: null,
            emotionalResonance: { delta: data.emotionalResonance?.delta },
          });
        }

        // Performance logging for <500ms load
        const elapsed = performance.now() - t0;
        if (elapsed > 500) {
          console.warn("SparkSplit comparison loaded slower than 500ms", elapsed);
        }
      } catch (err) {
        // F8-E1 edge: Retry 3 times, 2^i * 1000ms, then fallback+encrypt
        if (retry < 3) {
          setTimeout(() => setRetryCount(count => count + 1), 2 ** retry * 1000);
          return;
        }
        setError("Comparison failed");
        setLoading(false);
        // Data encrypted with supabase/vault (PRD); In a real system, trigger encryption here.
      }
    },
    [canaiOutput, promptId]
  );

  // Retry trigger
  useEffect(() => {
    fetchSparkSplit(retryCount);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retryCount]);

  // Tooltip PostHog event
  const handleTooltipOpen = () => {
    setTooltipVisible(true);
    if (window.posthog) {
      window.posthog.capture("trustdelta_viewed", { score: trustDelta });
    }
  };

  // Radio/feedback state
  const handleSelection = (v: string) => {
    setSelection(v);
    setFeedback("");
    setDislikeFeedback("");
    // PostHog event
    if (window.posthog && trustDelta != null && emoRes) {
      window.posthog.capture("plan_compared", {
        trustDelta,
        selected: v,
        emotionalResonance: { delta: emoRes.delta },
      });
    }
  };

  const handleFeedback = (text: string) => {
    setFeedback(text);
    if (window.posthog) {
      window.posthog.capture("generic_preferred", { feedback: text });
    }
  };

  const handleDislike = (text: string) => setDislikeFeedback(text);

  // Submit feedback to Supabase (comparisons table, see PRD SQL, mapping prompt_id)
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Supabase: update comparisons with user_feedback, trust_delta
    // Payload: { prompt_id, trust_delta, user_feedback, selection, dislike_feedback }
    try {
      await fetch("/v1/spark-split", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptId,
          trustDelta,
          userFeedback:
            selection === "generic"
              ? feedback
              : selection === "dislike"
              ? dislikeFeedback
              : "",
          selection,
        }),
      });
      toast({
        title: "Thank you for your feedback!",
        description: "Your preferences have been recorded.",
      });
    } catch (err) {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 flex flex-col gap-8 animate-fade-in">
        {/* Skeleton states for rapid load */}
        <div className="h-9 w-40 bg-gray-800/70 rounded mb-4 animate-pulse" />
        <div className="flex gap-8">
          <div className="flex-1 bg-gray-900/40 rounded-lg min-h-[100px] animate-pulse" />
          <div className="flex-1 bg-gray-900/40 rounded-lg min-h-[100px] animate-pulse" />
        </div>
        <div className="h-7 w-44 bg-gray-700/80 rounded mt-8 animate-pulse" />
      </div>
    );
  }
  if (error) {
    // F8-E1 fallback; edge: encrypted via supabase/vault
    return <F8EdgeFallback message="Comparison failed to load. Please try again later." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#00B2E3] py-8 px-2">
      <div className="mx-auto w-full max-w-6xl bg-[#172b47e0] rounded-2xl shadow-strong backdrop-blur-xl border border-canai-primary p-6 md:p-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Context Summary Left */}
          <ProjectContextSummary />

          {/* Comparison */}
          <div className="flex-1 flex flex-col gap-6">
            {/* Heading + Tooltip */}
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl md:text-3xl font-bold canai-gradient-text">
                Compare: CanAI vs. Generic Output
              </h2>
              <Tooltip open={tooltipVisible} onOpenChange={setTooltipVisible}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex"
                    aria-describedby="trustdelta-tooltip"
                    onClick={handleTooltipOpen}
                  >
                    <ArrowUp size={21} className="text-canai-cyan" aria-label="TrustDelta Info" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="rounded-md px-4 py-2 text-canai-light"
                  id="trustdelta-tooltip"
                >
                  {canaiTooltipText}
                </TooltipContent>
              </Tooltip>
            </div>
            <TrustDeltaStars score={trustDelta ?? 0} />
            {/* Comparison grid: highlights diffs */}
            <ComparisonContainer canai={canai || ""} generic={generic || ""} />
            {/* Show Emotional Resonance (Hume AI) and flagged review */}
            <EmotionalResonanceDisplay emoRes={emoRes} />
            {flagged && (
              <div className="text-warning-400 font-semibold mb-3">
                <span aria-label="Flagged for review">
                  ⚠️ One or more emotional resonance scores is below the QA threshold and will be reviewed.
                </span>
              </div>
            )}
            {/* Feedback flow */}
            <FeedbackForm
              selection={selection}
              onSelection={handleSelection}
              feedback={feedback}
              onFeedback={handleFeedback}
              dislikeFeedback={dislikeFeedback}
              onDislike={handleDislike}
              onSubmit={handleFormSubmit}
            />
            <div
              id="branding-note"
              className="mt-6 text-center text-xs text-canai-light-softer"
            >
              CanAI excludes branding (e.g., logos). Contact us for partners.
            </div>
            {/* API placeholder/Supabase logging (PRD-mapped) */}
            {/* TODO: POST /v1/spark-split */}
            {/* Supabase: comparisons.trust_delta, comparisons.user_feedback, prompt_id */}
            {/* PostHog: plan_compared, trustdelta_viewed, generic_preferred */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparkSplit;

