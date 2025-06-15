
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import StandardBackground from "@/components/StandardBackground";
import StandardCard from "@/components/StandardCard";
import { PageTitle, BodyText, CaptionText } from "@/components/StandardTypography";
import PageHeader from "@/components/PageHeader";

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

  return (
    <StandardBackground className="items-center justify-center">
      <PageHeader />
      
      <div className="w-full max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <PageTitle className="mb-4">Start Your Journey</PageTitle>
          <BodyText className="text-lg opacity-90">
            Tell us about your business challenge and we'll create the perfect plan for you.
          </BodyText>
        </div>

        <StandardCard variant="form" className="animate-scale-in">
          {/* Enhanced Progress bar */}
          <div className="flex items-center mb-8 gap-4">
            <div className="flex items-baseline gap-1">
              <CaptionText className="font-bold text-[#36d1fe]">Step</CaptionText>
              <span className="text-3xl font-black text-[#36d1fe]">{step}</span>
              <span className="text-xl font-medium text-[#E6F6FF]">/2</span>
            </div>
            <div className="flex-1 h-3 bg-[#19334a] rounded-full overflow-hidden">
              <div
                style={{
                  width: step === 1 ? "50%" : "100%",
                  background: "linear-gradient(90deg,#00f0ff 0%,#00CFFF 100%)",
                  boxShadow: "0 0 15px #00F0FF69"
                }}
                className="h-3 rounded-full transition-all duration-300"
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
            {/* STEP 1 */}
            <div className={cn("space-y-6", step !== 1 && "hidden")}>
              <div>
                <label htmlFor="business-type" className="block text-[#36d1fe] font-semibold mb-3 text-lg">
                  Business Type
                  <button
                    type="button"
                    className="ml-2 text-[#E6F6FF] hover:text-[#36d1fe] transition-colors"
                    title={getTooltip("type-tooltip")}
                  >
                    ?
                  </button>
                </label>
                <select
                  id="business-type"
                  name="businessType"
                  value={step1.businessType}
                  onChange={handleStep1Change}
                  required
                  className="w-full bg-[#142748e4] border-2 border-[#36d1fe]/50 rounded-xl px-4 py-4 text-lg text-[#E6F6FF] focus:border-[#36d1fe] focus:ring-2 focus:ring-[#36d1fe]/30 transition-all"
                >
                  <option value="">Select type...</option>
                  <option value="retail">Retail</option>
                  <option value="service">Service</option>
                  <option value="tech">Tech</option>
                  <option value="creative">Creative</option>
                  <option value="other">Other</option>
                </select>
                {step1.businessType === "other" && (
                  <div className="mt-4">
                    <label htmlFor="other-type" className="block text-[#36d1fe] font-semibold mb-2">Other Type</label>
                    <input
                      type="text"
                      id="other-type"
                      name="otherType"
                      maxLength={100}
                      value={step1.otherType}
                      onChange={handleStep1Change}
                      className="w-full bg-[#142748e4] border-2 border-[#36d1fe]/50 rounded-xl px-4 py-4 text-lg text-[#E6F6FF] focus:border-[#36d1fe] focus:ring-2 focus:ring-[#36d1fe]/30 transition-all"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="challenge-input" className="block text-[#36d1fe] font-semibold mb-3 text-lg">
                  Main Challenge
                  <button
                    type="button"
                    className="ml-2 text-[#E6F6FF] hover:text-[#36d1fe] transition-colors"
                    title={getTooltip("challenge-tooltip")}
                  >
                    ?
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
                  className="w-full bg-[#142748e4] border-2 border-[#36d1fe]/50 rounded-xl px-4 py-4 text-lg text-[#E6F6FF] placeholder:text-[#E6F6FF]/70 focus:border-[#36d1fe] focus:ring-2 focus:ring-[#36d1fe]/30 transition-all"
                />
              </div>

              <div className="flex items-center justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  ref={quizButtonRef}
                  onClick={handleQuizOpen}
                  className="border-[#36d1fe] text-[#36d1fe] hover:bg-[#36d1fe]/20 hover:border-[#00f0ff] hover:text-[#00f0ff] px-6 py-3 text-lg transition-all duration-200"
                >
                  Help Me Decide
                </Button>
                <Button
                  type="button"
                  variant="canai"
                  onClick={handleNext}
                  disabled={loading}
                  className="px-10 py-3 text-lg"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  Next
                </Button>
              </div>
            </div>

            {/* STEP 2 */}
            <div className={cn("space-y-6", step !== 2 && "hidden")}>
              <div>
                <label htmlFor="tone-select" className="block text-[#36d1fe] font-semibold mb-3 text-lg">
                  Preferred Tone
                  <button
                    type="button"
                    className="ml-2 text-[#E6F6FF] hover:text-[#36d1fe] transition-colors"
                    title={getTooltip("tone-tooltip")}
                  >
                    ?
                  </button>
                </label>
                <select
                  id="tone-select"
                  name="preferredTone"
                  value={step2.preferredTone}
                  onChange={handleStep2Change}
                  required
                  className="w-full bg-[#142748e4] border-2 border-[#36d1fe]/50 rounded-xl px-4 py-4 text-lg text-[#E6F6FF] focus:border-[#36d1fe] focus:ring-2 focus:ring-[#36d1fe]/30 transition-all"
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
                  <div className="mt-4">
                    <label htmlFor="custom-tone" className="block text-[#36d1fe] font-semibold mb-2">Custom Tone</label>
                    <input
                      type="text"
                      id="custom-tone"
                      name="customTone"
                      maxLength={50}
                      value={step2.customTone}
                      onChange={handleStep2Change}
                      className="w-full bg-[#142748e4] border-2 border-[#36d1fe]/50 rounded-xl px-4 py-4 text-lg text-[#E6F6FF] focus:border-[#36d1fe] focus:ring-2 focus:ring-[#36d1fe]/30 transition-all"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="outcome-select" className="block text-[#36d1fe] font-semibold mb-3 text-lg">
                  Desired Outcome
                  <button
                    type="button"
                    className="ml-2 text-[#E6F6FF] hover:text-[#36d1fe] transition-colors"
                    title={getTooltip("outcome-tooltip")}
                  >
                    ?
                  </button>
                </label>
                <select
                  id="outcome-select"
                  name="desiredOutcome"
                  value={step2.desiredOutcome}
                  onChange={handleStep2Change}
                  required
                  className="w-full bg-[#142748e4] border-2 border-[#36d1fe]/50 rounded-xl px-4 py-4 text-lg text-[#E6F6FF] focus:border-[#36d1fe] focus:ring-2 focus:ring-[#36d1fe]/30 transition-all"
                >
                  <option value="">Select outcome...</option>
                  <option value="secure funding">Secure Funding</option>
                  <option value="grow customers">Grow Customers</option>
                  <option value="improve operations">Improve Operations</option>
                  <option value="boost online presence">Boost Online Presence</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="border-[#36d1fe] text-[#36d1fe] hover:bg-[#36d1fe]/20 hover:border-[#00f0ff] hover:text-[#00f0ff] px-6 py-3 text-lg transition-all duration-200"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="canai"
                  disabled={loading}
                  className="px-10 py-3 text-lg"
                >
                  {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                  Submit
                </Button>
              </div>
            </div>

            {/* Feedback, trust score, contradiction, error */}
            {feedback && (
              <div className="mt-6 p-4 bg-[#36d1fe]/10 border border-[#36d1fe]/30 rounded-xl animate-fade-in">
                <BodyText className="text-[#36d1fe] font-medium">{feedback}</BodyText>
              </div>
            )}
            {(trustScore !== undefined && trustScore < 50) && (
              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
                <BodyText className="text-orange-400">
                  Trust Score: <span className="font-bold">{trustScore}%</span>
                  {trustTip && ` Try: '${trustTip}'`}
                </BodyText>
              </div>
            )}
            {contradiction && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in">
                <BodyText className="text-red-400 font-semibold">{contradiction}</BodyText>
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in">
                <BodyText className="text-red-400 font-semibold">{error}</BodyText>
              </div>
            )}
          </form>
        </StandardCard>
      </div>

      {/* Enhanced Quiz Modal */}
      {quizOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <StandardCard variant="glass" className="max-w-md w-full mx-4 text-center">
            <PageTitle className="text-2xl mb-6">Help Me Decide</PageTitle>
            <div className="mb-6">
              <BodyText className="mb-4 font-semibold">What's your biggest challenge?</BodyText>
              {quizOptions.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  className={cn(
                    "w-full border-2 px-4 py-3 rounded-xl my-2 text-left font-medium transition-all duration-200",
                    quizSelected === q.value
                      ? "border-[#36d1fe] bg-[#36d1fe]/20 text-[#36d1fe] shadow-[0_0_20px_rgba(54,209,254,0.3)]"
                      : "border-[#36d1fe]/30 text-[#E6F6FF] hover:bg-[#36d1fe]/10 hover:border-[#36d1fe]/60"
                  )}
                  onClick={() => handleQuizSelect(q.value)}
                >
                  {q.label}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <Button
                variant="canai"
                onClick={handleQuizSubmit}
                disabled={!quizSelected}
                className="w-full py-3"
              >
                Submit Quiz
              </Button>
              <Button
                variant="outline"
                onClick={handleQuizClose}
                className="w-full py-3 border-[#36d1fe] text-[#36d1fe] hover:bg-[#36d1fe]/10"
              >
                Cancel
              </Button>
            </div>
          </StandardCard>
        </div>
      )}
    </StandardBackground>
  );
}

export default DiscoveryFunnel;
