import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Tooltips will load dynamically (simulate API call)
async function fetchTooltip(field: string): Promise<string> {
  // TODO: Replace with real POST /v1/generate-tooltip API call
  switch(field) {
    case "businessType": return "E.g., artisanal bakery.";
    case "primaryChallenge": return "Your top hurdle (e.g., need $75k).";
    case "preferredTone": return "How your plan sounds (e.g., warm = heartfelt).";
    case "desiredOutcome": return "Your goal (e.g., secure funding).";
    default: return "";
  }
}

// Supabase auto-save (via Make.com) stub
const autosaveInputs = (inputs: Record<string, any>) => {
  // TODO: send data to Make.com scenario to store in Supabase.initial_prompt_logs
  // ... schema: see table initial_prompt_logs (see prompt)
};

const defaultStep1 = {
  businessType: "",
  otherType: "",
  primaryChallenge: ""
};
const defaultStep2 = {
  preferredTone: "professional",
  customTone: "",
  desiredOutcome: ""
};

const tooltipFields = [
  { field: "businessType", id: "type-tooltip" },
  { field: "primaryChallenge", id: "challenge-tooltip" },
  { field: "preferredTone", id: "tone-tooltip" },
  { field: "desiredOutcome", id: "outcome-tooltip" },
];

// Regex validation rules (per requirements)
const REGEX = {
  primaryChallenge: /^[a-zA-Z0-9\s]{5,50}$/,
  otherType: /^[a-zA-Z0-9\s,.]{1,100}$/,
  customTone: /^[a-zA-Z0-9\s]{1,50}$/
};

const quizOptions = [
  { value: "funding", label: "A) Funding", challenge: "Need funding for my business", outcome: "secure funding" },
  { value: "growth", label: "B) Growth", challenge: "Want to grow sales", outcome: "grow customers" },
  { value: "operations", label: "C) Operations", challenge: "Streamline my operations", outcome: "improve operations" },
  { value: "online", label: "D) Online Presence", challenge: "Boost my website presence", outcome: "boost online presence" },
];

function DiscoveryFunnel() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: businessType, otherType, primaryChallenge
  const [step1, setStep1] = useState(defaultStep1);

  // Step 2: preferredTone, customTone, desiredOutcome
  const [step2, setStep2] = useState(defaultStep2);

  // UI/validation states
  const [feedback, setFeedback] = useState("");
  const [trustScore, setTrustScore] = useState<number>();
  const [trustTip, setTrustTip] = useState("");
  const [contradiction, setContradiction] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Tooltips loaded dynamically
  const [tooltips, setTooltips] = useState<Record<string, string>>({});
  // Quiz modal state
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizSelected, setQuizSelected] = useState<string | null>(null);

  // For accessibility focus return
  const quizButtonRef = useRef<HTMLButtonElement | null>(null);

  // Load tooltips on mount
  React.useEffect(() => {
    (async () => {
      for (let { field, id } of tooltipFields) {
        const val = await fetchTooltip(field);
        setTooltips(prev => ({ ...prev, [id]: val }));
      }
    })();
  }, []);

  // Autosave on input change
  React.useEffect(() => {
    autosaveInputs({ ...step1, ...step2 });
  }, [step1, step2]);

  // Handle tooltips live
  const getTooltip = (id: string) => tooltips[id] || "...";

  // Step navigation and validation logic
  const handleNext = async () => {
    setError(null);
    setFeedback("");
    setTrustScore(undefined);
    setContradiction("");
    // Validate step 1
    if (!step1.businessType) return setFeedback("Please select your business type.");
    if (step1.businessType === "other" && !REGEX.otherType.test(step1.otherType.trim()))
      return setFeedback('Please enter a valid "Other Type".');
    if (!REGEX.primaryChallenge.test(step1.primaryChallenge.trim()))
      return setFeedback("Main challenge must be 5-50 letters or numbers.");
    // Call validation API for trust score/feedback
    setLoading(true);
    try {
      // TODO: POST /v1/validate-input (step 1 only)
      const resp = await fetch("/v1/validate-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessType: step1.businessType,
          otherType: step1.otherType,
          primaryChallenge: step1.primaryChallenge,
          preferredTone: "",
          customTone: "",
          desiredOutcome: "",
        }),
      });
      const data = await resp.json();
      setFeedback(data.feedback || "Looks good!");
      setTrustScore(data.trustScore || 0);
      setTrustTip(data.feedback || "");
      // PostHog: funnel_step
      if (window.posthog) window.posthog.capture("funnel_step", { stepName: "discovery_funnel", completed: false, dropoffReason: null });
    } catch {
      setError("Validation failed");
      return;
    } finally {
      setLoading(false);
    }
    setTimeout(() => setStep(2), 400);
  };

  const handleBack = () => {
    setFeedback("");
    setTrustScore(undefined);
    setTrustTip("");
    setContradiction("");
    setStep(1);
  };

  // Submission (step 2)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setFeedback(""); setTrustScore(undefined); setContradiction("");
    // Validation
    if (!step2.preferredTone) return setFeedback("Choose your preferred tone.");
    if (step2.preferredTone === "custom" && !REGEX.customTone.test(step2.customTone.trim()))
      return setFeedback("Custom tone must be letters/numbers, max 50.");
    if (!step2.desiredOutcome) return setFeedback("Please select your desired outcome.");

    setLoading(true);
    try {
      // TODO: POST /v1/validate-input (all fields)
      const resp = await fetch("/v1/validate-input", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...step1,
          ...step2,
        }),
      });
      const data = await resp.json();
      if (!data.valid) {
        setFeedback(data.feedback || "Invalid submission");
        setTrustScore(data.trustScore || 0);
        setTrustTip(data.feedback || "");
        return;
      }
      setFeedback(data.feedback || "Inputs look great!");
      setTrustScore(data.trustScore || 0);
      setTrustTip(data.feedback || "");
      // Contradiction detection (POST /v1/detect-contradiction)
      const contra = await fetch("/v1/detect-contradiction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredTone: step2.preferredTone,
          desiredOutcome: step2.desiredOutcome,
        }),
      });
      const contrRes = await contra.json();
      if (contrRes.contradiction && contrRes.message) {
        setContradiction(contrRes.message);
        // PostHog: contradiction_flagged
        if (window.posthog) window.posthog.capture("contradiction_flagged", { reason: "tone_goal_mismatch" });
        return;
      }
      // PostHog: funnel_step
      if (window.posthog) window.posthog.capture("funnel_step", { stepName: "discovery_funnel", completed: true, dropoffReason: null });
      // TODO: Hume AI validation here

      // TODO: Route to spark-layer on success
      setTimeout(() => window.location.assign("/spark-layer"), 510);
    } catch {
      setError("Validation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleQuizOpen = () => {
    setQuizOpen(true);
    setQuizSelected(null);
  };
  const handleQuizClose = () => {
    setQuizOpen(false);
    setQuizSelected(null);
    quizButtonRef.current?.focus();
  };
  const handleQuizSelect = (val: string) => setQuizSelected(val);
  const handleQuizSubmit = () => {
    if (!quizSelected) return;
    // Map quiz to fields
    const option = quizOptions.find(q => q.value === quizSelected)!;
    setStep1(s => ({
      ...s,
      primaryChallenge: option.challenge,
    }));
    setStep2(s => ({
      ...s,
      desiredOutcome: option.outcome,
    }));
    setQuizOpen(false);
    setQuizSelected(null);
    // PostHog
    if (window.posthog) window.posthog.capture("quiz_used", { completed: true });
  };

  // Input handlers with auto-save
  const handleStep1Change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStep1(s => ({ ...s, [name]: value }));
    setFeedback(""); setError(null);
  };
  const handleStep2Change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStep2(s => ({ ...s, [name]: value }));
    setFeedback(""); setError(null);
    // Custom tone entered
    if (name === "preferredTone" && value === "custom" && window.posthog) {
      window.posthog.capture("custom_tone_entered", { tone: "custom" });
    }
  };

  // Branding: DiscoveryHook style - MODERNIZED
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-radial from-[#101f33] via-[#12294a] to-[#052947] animate-fade-in"
      style={{
        fontFamily: "Manrope, Arial, sans-serif",
      }}
    >
      {/* Modern glassmorphism card with neon border and shadow */}
      <div
        className="w-full max-w-md px-4 py-10 rounded-3xl bg-glass-modal shadow-strong border-2 border-canai-cyan 
        ring-2 ring-[#00f0ff44] backdrop-blur-xl animate-scale-in"
        style={{
          boxShadow: '0 0 60px 0 #00CFFF33, 0 2px 32px 0 #193c65bb',
        }}
      >
        {/* Animated/fading headline */}
        <h1
          className="font-playfair font-bold text-3xl text-center mb-7 text-canai-light drop-shadow-xl animate-text-glow"
        >
          Start Your Journey
        </h1>
        {/* Progress bar with neon, rounded look */}
        <div className="flex items-center mb-6 gap-2">
          <span className="text-canai-cyan font-bold text-base md:text-lg" id="progress-bar">
            Step <span className="text-xl font-black">{step}</span>/2
          </span>
          <div className="flex-1 h-2 ml-2 bg-[#19334a] rounded-full overflow-hidden">
            <div
              style={{
                width: step === 1 ? "44%" : "100%",
                background: "linear-gradient(90deg,#00f0ff 0%,#00CFFF 100%)",
                boxShadow: "0 0 15px #00F0FF69"
              }}
              className="h-2 rounded-full transition-all duration-300"
              id="progress-bar-fill"
            />
          </div>
        </div>
        {/* --- STEP 1 --- */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
          <div className={cn("flex flex-col gap-4", step !== 1 && "hidden")}>
            <label htmlFor="business-type" className="font-semibold text-canai-cyan text-base flex items-center gap-1">
              Business Type
              <button
                type="button"
                className="ml-1 focus:outline-none text-canai-light"
                tabIndex={0}
                aria-label="Show tooltip"
                title={getTooltip("type-tooltip")}
                style={{ fontWeight: 700 }}
              >?
                <span className="tooltip-text">{getTooltip("type-tooltip")}</span>
              </button>
            </label>
            <select
              id="business-type"
              name="businessType"
              value={step1.businessType}
              onChange={handleStep1Change}
              required
              className="w-full bg-[#142748e4] border border-canai-cyan rounded-xl px-4 py-3 text-base font-medium text-canai-light focus:ring-2 focus:ring-canai-cyan transition-all shadow-strong"
              autoComplete="off"
            >
              <option value="">Select type...</option>
              <option value="retail">Retail</option>
              <option value="service">Service</option>
              <option value="tech">Tech</option>
              <option value="creative">Creative</option>
              <option value="other">Other</option>
            </select>
            {step1.businessType === "other" && (
              <div>
                <label htmlFor="other-type" className="font-semibold text-canai-cyan">Other Type</label>
                <input
                  type="text"
                  id="other-type"
                  name="otherType"
                  maxLength={100}
                  value={step1.otherType}
                  onChange={handleStep1Change}
                  className="w-full bg-[#142748e4] border border-canai-cyan rounded-xl px-4 py-3 text-base font-medium text-canai-light focus:ring-2 focus:ring-canai-cyan transition"
                  autoComplete="off"
                />
              </div>
            )}
            <label htmlFor="challenge-input" className="font-semibold text-canai-cyan flex items-center gap-1">
              Main Challenge
              <button
                type="button"
                className="ml-1 focus:outline-none text-canai-light"
                tabIndex={0}
                aria-label="Show tooltip"
                title={getTooltip("challenge-tooltip")}
                style={{ fontWeight: 700 }}
              >?
                <span className="tooltip-text">{getTooltip("challenge-tooltip")}</span>
              </button>
            </label>
            <input
              type="text"
              id="challenge-input"
              name="primaryChallenge"
              maxLength={50}
              value={step1.primaryChallenge}
              onChange={handleStep1Change}
              required
              placeholder="E.g. Need funding for bakery"
              className="w-full bg-[#142748e4] border border-canai-cyan rounded-xl px-4 py-3 text-base font-medium text-canai-light placeholder:text-canai-light/70 focus:ring-2 focus:ring-canai-cyan transition"
              autoComplete="off"
            />
            <div className="flex items-center mt-5 space-x-3 justify-between">
              <Button
                type="button"
                variant="outline"
                id="help-quiz"
                className="canai-btn-glow btn-outline px-6 py-2 rounded-lg text-canai-cyan font-semibold border-canai-cyan shadow-strong text-base hover:scale-105 transition-all"
                ref={quizButtonRef}
                onClick={handleQuizOpen}
              >
                Help Me Decide
              </Button>
              <Button
                type="button"
                id="to-step-2"
                variant="canai"
                className="btn-canai px-10 py-3 rounded-lg animate-glow-pop drop-shadow-xl hover:scale-105 ring-canai-primary"
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                Next
              </Button>
            </div>
          </div>
          {/* --- STEP 2 --- */}
          <div className={cn("flex flex-col gap-4", step !== 2 && "hidden")}>
            <label htmlFor="tone-select" className="font-semibold text-canai-cyan flex items-center gap-1">
              Preferred Tone
              <button
                type="button"
                className="ml-1 focus:outline-none text-canai-light"
                tabIndex={0}
                aria-label="Show tooltip"
                title={getTooltip("tone-tooltip")}
                style={{ fontWeight: 700 }}
              >?
                <span className="tooltip-text">{getTooltip("tone-tooltip")}</span>
              </button>
            </label>
            <select
              id="tone-select"
              name="preferredTone"
              value={step2.preferredTone}
              onChange={handleStep2Change}
              required
              className="w-full bg-[#142748e4] border border-canai-cyan rounded-xl px-4 py-3 text-base font-medium text-canai-light focus:ring-2 focus:ring-canai-cyan transition shadow-strong"
            >
              <option value="professional">Professional</option>
              <option value="warm">Warm</option>
              <option value="bold">Bold</option>
              <option value="optimistic">Optimistic</option>
              <option value="playful">Playful</option>
              <option value="inspirational">Inspirational</option>
              <option value="custom">Custom (type below)</option>
            </select>
            {step2.preferredTone === "custom" && (
              <div>
                <label htmlFor="custom-tone" className="font-semibold text-canai-cyan">Custom Tone</label>
                <input
                  type="text"
                  id="custom-tone"
                  name="customTone"
                  maxLength={50}
                  value={step2.customTone}
                  onChange={handleStep2Change}
                  className="w-full bg-[#142748e4] border border-canai-cyan rounded-xl px-4 py-3 text-base font-medium text-canai-light focus:ring-2 focus:ring-canai-cyan transition"
                  autoComplete="off"
                />
              </div>
            )}
            <label htmlFor="outcome-select" className="font-semibold text-canai-cyan flex items-center gap-1">
              Desired Outcome
              <button
                type="button"
                className="ml-1 focus:outline-none text-canai-light"
                tabIndex={0}
                aria-label="Show tooltip"
                title={getTooltip("outcome-tooltip")}
                style={{ fontWeight: 700 }}
              >?
                <span className="tooltip-text">{getTooltip("outcome-tooltip")}</span>
              </button>
            </label>
            <select
              id="outcome-select"
              name="desiredOutcome"
              value={step2.desiredOutcome}
              onChange={handleStep2Change}
              required
              className="w-full bg-[#142748e4] border border-canai-cyan rounded-xl px-4 py-3 text-base font-medium text-canai-light focus:ring-2 focus:ring-canai-cyan transition shadow-strong"
            >
              <option value="">Select outcome...</option>
              <option value="secure funding">Secure Funding</option>
              <option value="grow customers">Grow Customers</option>
              <option value="improve operations">Improve Operations</option>
              <option value="boost online presence">Boost Online Presence</option>
            </select>
            <div className="flex items-center mt-5 space-x-3 justify-between">
              <Button type="button" variant="outline" onClick={handleBack} className="canai-btn-glow btn-outline px-6 py-2 rounded-lg text-canai-cyan font-semibold border-canai-cyan shadow-strong text-base hover:scale-105 transition-all">Back</Button>
              <Button type="submit" variant="canai" className="btn-canai px-10 py-3 rounded-lg animate-glow-pop drop-shadow-xl hover:scale-105 ring-canai-primary" id="submit-funnel" disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                Submit
              </Button>
            </div>
          </div>
          {/* Feedback, trust score, contradiction, error */}
          {feedback && (
            <div id="feedback-text" className="feedback-message mt-4 font-medium text-base text-canai-cyan animate-fade-in">{feedback}</div>
          )}
          {(trustScore !== undefined && trustScore < 50) && (
            <div id="trust-score-row" className="trust-score-row text-base text-orange-400 mt-2">
              Trust Score: <span id="trust-score" className="trust-score-low font-bold animate-countup-glow">{trustScore}%</span>
              <span id="trust-score-tip"> {trustTip && ` Try: '${trustTip}'`}</span>
            </div>
          )}
          {contradiction && (
            <div id="contradiction-prompt" className="contradiction-prompt mt-2 text-orange-400 font-bold animate-shake">{contradiction}</div>
          )}
          {error && (
            <div className="error-fallback mt-2 text-red-500 font-semibold animate-shake" id="validation-error">{error}</div>
          )}
        </form>
      </div>
      {/* --- QUIZ MODAL (untouched, already modern) --- */}
      {quizOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
        >
          <div className="bg-glass-modal rounded-2xl shadow-strong p-8 text-center max-w-xs w-[325px]" style={{ boxShadow: '0 0 32px #00f0ff33' }}>
            <h2 className="text-xl font-bold text-canai-cyan mb-4 font-playfair animate-text-glow">Help Me Decide</h2>
            <div id="quiz-challenge" className="mb-6">
              <div className="mb-3 font-semibold text-canai-light/90">Biggest challenge?</div>
              {quizOptions.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  className={cn(
                    "quiz-option w-full border px-3 py-3 rounded-xl my-1 text-left font-medium transition text-canai-light bg-[#12294ae7] hover:bg-canai-cyan/10 focus:ring-2 focus:ring-canai-cyan",
                    quizSelected === q.value
                      ? "border-canai-cyan bg-[#163251] text-canai-cyan font-semibold ring-2 ring-canai-cyan"
                      : "border-[#36d1fe44]"
                  )}
                  onClick={() => handleQuizSelect(q.value)}
                  aria-selected={quizSelected === q.value}
                >
                  {q.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <Button className="btn-canai canai-btn-glow px-7 py-3 rounded-xl text-lg animate-glow-pop" id="quiz-submit" onClick={handleQuizSubmit} disabled={!quizSelected}>
                Submit Quiz
              </Button>
              <Button variant="outline" id="quiz-close" className="canai-btn-glow btn-outline px-7 py-3 rounded-xl text-canai-cyan border-canai-cyan border-2 text-lg" onClick={handleQuizClose}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default DiscoveryFunnel;
