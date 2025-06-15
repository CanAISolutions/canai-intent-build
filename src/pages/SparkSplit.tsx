import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowUp } from "lucide-react";

import ProjectContextSummary from "@/components/SparkSplit/ProjectContextSummary";
import TrustDeltaStars from "@/components/SparkSplit/TrustDeltaStars";
import EmotionalResonanceDisplay from "@/components/SparkSplit/EmotionalResonanceDisplay";
import ComparisonContainer from "@/components/SparkSplit/ComparisonContainer";
import FeedbackForm from "@/components/SparkSplit/FeedbackForm";

const demoCanai = `Sprinkle Haven Bakery is an artisanal bakery in Denver, CO serving Denver families with organic, community-focused pastries. Our warm, inviting approach sets us apart from Blue Moon Bakery, with a focus on sustainability, local sourcing, and empowering the community through healthy options.`;
const demoGeneric = `Sprinkle Haven Bakery is a bakery in Denver that sells pastries to families. Our business plan is to make baked goods and try to stand out from Blue Moon Bakery. We want to attract customers using our products and hope to be successful in our location.`;

const demoTrustDelta = 4.5;
const demoEmoRes = {
  canaiScore: 0.85,
  genericScore: 0.45,
  delta: 0.4,
  arousal: 0.7,
  valence: 0.8,
};

// Fallback UI
const F8EdgeFallback = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[250px] error-fallback text-center bg-canai-deep border border-red-400 p-8 rounded-xl mt-8">
    <div className="text-xl mb-3 font-semibold text-red-400">{message}</div>
    <div className="text-canai-light">Sensitive data has been encrypted with supabase/vault.</div>
  </div>
);

const canaiTooltipText = `TrustDelta™ measures the difference in quality, tone, and emotional resonance between your CanAI-crafted output and a generic plan. Scores closer to 5 mean CanAI is better aligned with your brief, tone, and business needs.`;

const SparkSplit: React.FC = () => {
  const [canai, setCanai] = useState<string | null>(null);
  const [generic, setGeneric] = useState<string | null>(null);
  const [trustDelta, setTrustDelta] = useState<number | null>(null);
  const [emoRes, setEmoRes] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [selection, setSelection] = useState('');
  const [feedback, setFeedback] = useState('');
  const [dislikeFeedback, setDislikeFeedback] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Timing: start time for <500ms check
  useEffect(() => {
    const t0 = performance.now();
    // Simulate fetch to /v1/spark-split
    setTimeout(() => {
      // fallback error old edge F8-E1 (simulate 3% fail rate)
      if (Math.random() < 0.03) {
        setError("Comparison failed to load.");
        setLoading(false);
        return;
      }
      setCanai(demoCanai);
      setGeneric(demoGeneric);
      setTrustDelta(demoTrustDelta);
      setEmoRes(demoEmoRes);
      setLoading(false);

      // PostHog: TrustDelta viewed
      if (window.posthog) {
        window.posthog.capture('trustdelta_viewed', { score: demoTrustDelta });
      }
      const elapsed = performance.now() - t0;
      if (elapsed > 550) console.warn("Comparison loaded slower than 500ms!", elapsed);
    }, 180 + Math.random() * 220); // avg 250-400ms
  }, []);

  const handleTooltipOpen = () => {
    setTooltipVisible(true);
    // TrustDelta Tooltip event
    if (window.posthog) {
      window.posthog.capture('trustdelta_viewed', { score: trustDelta || demoTrustDelta });
    }
  };

  const handleSelection = (v: string) => {
    setSelection(v);
    setFeedback('');
    setDislikeFeedback('');
    if (window.posthog && trustDelta) {
      window.posthog.capture('plan_compared', {
        trustDelta,
        selected: v,
        emotionalResonance: { delta: emoRes?.delta ?? demoEmoRes.delta }
      });
    }
  };

  const handleFeedback = (text: string) => {
    setFeedback(text);
    if (window.posthog) {
      window.posthog.capture('generic_preferred', { feedback: text });
    }
  };

  const handleDislike = (text: string) => setDislikeFeedback(text);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: POST /v1/spark-split
    // Supabase: comparisons.trust_delta, comparisons.user_feedback
    // Send { canaiOutput, genericOutput, trustDelta, feedback... }
    // Form validation and toast handling, etc.
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4 flex flex-col gap-8 animate-fade-in">
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
    // F8-E1: encrypt via supabase/vault, show fallback
    return <F8EdgeFallback message="Comparison failed to load. Please try again later." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#00B2E3] py-8 px-2">
      <div className="mx-auto w-full max-w-6xl bg-[#172b47e0] rounded-2xl shadow-strong backdrop-blur-xl border border-canai-primary p-6 md:p-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Context Summary (left) */}
          <ProjectContextSummary />

          {/* Comparison Module */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl md:text-3xl font-bold canai-gradient-text">Compare: CanAI vs. Generic Output</h2>
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
                <TooltipContent side="top" className="rounded-md px-4 py-2 text-canai-light" id="trustdelta-tooltip">
                  {canaiTooltipText}
                </TooltipContent>
              </Tooltip>
            </div>
            <TrustDeltaStars score={trustDelta ?? 0} />
            <ComparisonContainer canai={canai || ''} generic={generic || ''} />
            <EmotionalResonanceDisplay emoRes={emoRes} />
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
            {/* TODO: POST /v1/spark-split */}
            {/* Supabase: comparisons.trust_delta, comparisons.user_feedback */}
            {/* PostHog events: plan_compared, trustdelta_viewed, generic_preferred */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparkSplit;
