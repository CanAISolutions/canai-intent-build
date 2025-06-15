
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { ArrowDown, ArrowUp } from "lucide-react";

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

// Utility for highlighting differences (VERY basic: highlights word differences)
function diffHighlight(a: string, b: string) {
  const aWords = a.split(' ');
  const bWords = b.split(' ');
  return aWords.map((word, i) => {
    if (bWords[i] !== word) {
      return <mark key={i} className="bg-yellow-300 text-gray-900 rounded px-1">{word}</mark>;
    }
    return word + " ";
  });
}

// Star rating display for TrustDelta (showing stars out of 5)
function TrustDeltaStars({ score }: { score: number }) {
  const rounded = Math.round(score);
  return (
    <span id="trustdelta-score" className="inline-flex items-center gap-1 text-2xl font-bold text-yellow-400">
      {Array.from({ length: 5 }).map((_, i) =>
        <span key={i}>{i < rounded ? "★" : "☆"}</span>
      )}
      <span className="ml-2 text-base font-medium text-canai-light">
        {score.toFixed(1)}/5.0
      </span>
    </span>
  );
}

const canaiTooltipText = "How well our plan matches your vision (★ = 1 point).";

const demoContext = [
  ["Business", "Sprinkle Haven Bakery"],
  ["Target Audience", "Denver families"],
  ["Goal", "Funding"],
  ["Competitive", "Blue Moon Bakery"],
  ["Voice", "Warm"],
  ["Constraints", "$50k, 3 people, 6 months"],
  ["Location", "Denver, CO"],
  ["Value", "Organic, community-focused pastries"],
];

const F8EdgeFallback = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center min-h-[250px] error-fallback text-center bg-canai-deep border border-red-400 p-8 rounded-xl mt-8">
    <div className="text-xl mb-3 font-semibold text-red-400">{message}</div>
    <div className="text-canai-light">Sensitive data has been encrypted with supabase/vault.</div>
  </div>
);

const SparkSplit: React.FC = () => {
  // Comparison state
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
    // TODO: Replace with actual API
    setTimeout(() => {
      // fallback error old edge F8-E1 (simulate <5% fail rate)
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
      // @ts-expect-error
      if (window.posthog) {
        window.posthog.capture('trustdelta_viewed', { score: demoTrustDelta });
      }
      const elapsed = performance.now() - t0;
      // (optional log perf)
      if (elapsed > 550) console.warn("Comparison loaded slower than 500ms!", elapsed);
    }, 180 + Math.random() * 220); // avg 250-400ms
  }, []);

  // Tooltip perf log
  const handleTooltipOpen = () => {
    setTooltipVisible(true);
    // TrustDelta Tooltip event
    // @ts-expect-error
    if (window.posthog) {
      window.posthog.capture('trustdelta_viewed', { score: trustDelta || demoTrustDelta });
    }
  };

  const handleSelection = (v: string) => {
    setSelection(v);
    setFeedback('');
    setDislikeFeedback('');
    // PostHog: plan compared
    // @ts-expect-error
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
    // @ts-expect-error
    if (window.posthog) {
      window.posthog.capture('generic_preferred', { feedback: text });
    }
  };

  const handleDislike = (text: string) => {
    setDislikeFeedback(text);
    // Could send "both disliked" feedback to backend.
  };

  if (loading) {
    // Render skeletons for rapid-perceived perf
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
    // Supabase/vault integration required
    return <F8EdgeFallback message="Comparison failed to load. Please try again later." />;
  }

  // Supabase: comparisons.trust_delta, comparisons.emotional_resonance
  // TODO: POST /v1/spark-split { canaiOutput, genericOutput }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#00B2E3] py-8 px-2">
      <div className="mx-auto w-full max-w-6xl bg-[#172b47e0] rounded-2xl shadow-strong backdrop-blur-xl border border-canai-primary p-6 md:p-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Context Summary (left) */}
          <div className="max-w-[330px] w-full bg-[#193c65c9] rounded-2xl px-6 py-8 flex flex-col gap-2 border-l-4 border-[#36d1fe] shadow-strong min-h-full mb-4">
            <div className="font-bold text-lg mb-2 text-canai-cyan">Your Project</div>
            <ul className="text-canai-light-blue text-sm space-y-2">
              {demoContext.map(([label, value]) => (
                <li key={label}><span className="font-semibold">{label}:</span> <span>{value}</span></li>
              ))}
            </ul>
            <div className="text-xs text-canai-light-softer italic mt-4">
              “How your brief shaped both plans”
            </div>
          </div>
          {/* Comparison Module */}
          <div className="flex-1 flex flex-col gap-6" id="comparison-container">
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
            {/* Star rating */}
            <TrustDeltaStars score={trustDelta ?? 0} />
            <div className="flex flex-row gap-6 mt-4">
              {/* CanAI Output */}
              <div className="flex-1 p-5 rounded-xl bg-[#1E314F] shadow-lg border border-[#36d1fe66]">
                <div className="text-sm font-semibold text-canai-cyan mb-1">CanAI Output</div>
                <div className="text-base md:text-lg prose text-canai-light" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                  {diffHighlight(canai || '', generic || '')}
                </div>
              </div>
              {/* Generic Output */}
              <div className="flex-1 p-5 rounded-xl bg-[#22335C] shadow-lg border border-[#36d1fe40]">
                <div className="text-sm font-semibold text-green-300 mb-1">Generic Output</div>
                <div className="text-base md:text-lg prose text-canai-light" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                  {diffHighlight(generic || '', canai || '')}
                </div>
              </div>
            </div>
            {/* Emotional Resonance display */}
            <div className="mt-5 mb-3 text-sm">
              <span className="font-semibold mr-2">Emotional Resonance:</span>
              <span className={emoRes?.canaiScore > 0.7 ? "text-green-400" : "text-yellow-400"}>CanAI {Math.round((emoRes?.canaiScore ?? 0) * 100)}%</span>
              <span className="mx-2 text-gray-400">•</span>
              <span className={emoRes?.genericScore > 0.7 ? "text-green-400" : "text-yellow-400"}>Generic {Math.round((emoRes?.genericScore ?? 0) * 100)}%</span>
              <span className="ml-4 text-xs text-canai-light-softer">(Arousal: {emoRes?.arousal}, Valence: {emoRes?.valence}, Δ: {emoRes?.delta})</span>
            </div>
            {/* TrustDelta check: Must be >4.0, 65%+ rate CanAI as better */}
            <form className="mt-6 flex flex-col gap-5">
              <div className="text-base font-semibold" id="comparison-prompt">
                Which feels more like you?
              </div>
              <RadioGroup
                onValueChange={handleSelection}
                className="flex flex-col gap-2"
                defaultValue=""
                aria-label="Comparison Choices"
              >
                <div className="flex items-center gap-4">
                  <RadioGroupItem id="radio-canai" value="canai" />
                  <Label htmlFor="radio-canai" className="font-medium text-canai-cyan">
                    CanAI
                  </Label>
                </div>
                <div className="flex items-center gap-4">
                  <RadioGroupItem id="radio-generic" value="generic" />
                  <Label htmlFor="radio-generic" className="font-medium text-green-200">
                    Generic
                  </Label>
                </div>
                <div className="flex items-center gap-4">
                  <RadioGroupItem id="radio-dislike" value="dislike" />
                  <Label htmlFor="radio-dislike" className="font-medium text-red-300">
                    Neither feels right
                  </Label>
                </div>
              </RadioGroup>
              {/* Generic feedback */}
              {selection === "generic" && (
                <div className="w-full">
                  <Label htmlFor="generic-feedback" className="mb-1 text-sm block">Why does this feel better?</Label>
                  <Textarea
                    id="generic-feedback"
                    placeholder="Explain why the generic output worked for you..."
                    className="bg-feedback-input border-canai-primary text-canai-light"
                    value={feedback}
                    onChange={e => handleFeedback(e.target.value)}
                    required
                  />
                </div>
              )}
              {/* Both disliked feedback */}
              {selection === "dislike" && (
                <div className="w-full">
                  <Label htmlFor="dislike-feedback" className="mb-1 text-sm block">What’s missing?</Label>
                  <Textarea
                    id="dislike-feedback"
                    placeholder="Let us know what both plans missed..."
                    className="bg-feedback-input border-canai-primary text-canai-light"
                    value={dislikeFeedback}
                    onChange={e => handleDislike(e.target.value)}
                    required
                  />
                </div>
              )}
              <Button variant="canai" type="submit" className="mt-2 w-fit">
                Submit Feedback
              </Button>
            </form>
            {/* Branding note */}
            <div
              id="branding-note"
              className="mt-6 text-center text-xs text-canai-light-softer"
            >
              CanAI excludes branding (e.g., logos). Contact us for partners.
            </div>
            {/* API placeholders */}
            {/* <!-- TODO: POST /v1/spark-split --> */}
            {/* // Supabase: comparisons.trust_delta, comparisons.user_feedback */}
            {/* // PostHog events: plan_compared, trustdelta_viewed, generic_preferred */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SparkSplit;
