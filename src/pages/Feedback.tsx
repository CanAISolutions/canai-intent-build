
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/feedback/ShareButton";
import { StarRating } from "@/components/feedback/StarRating";
import { ReferModal } from "@/components/feedback/ReferModal";
import { DangerZone } from "@/components/feedback/DangerZone";
import { Followup } from "@/components/feedback/Followup";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";

const quickbooksLink = "https://quickbooks.intuit.com/";
const prompt_id = "SPRINKLE_PROMPT_ID"; // Get real prompt_id from context in future

const FeedbackPage: React.FC = () => {
  const {
    rating,
    setRating,
    comment,
    setComment,
    email,
    setEmail,
    referModalOpen,
    setReferModalOpen,
    showPurge,
    setShowPurge,
    showFollowup,
    handleSubmit,
    handleRefer,
    handlePurge,
    handleShare,
    openRefer,
  } = useFeedbackForm(prompt_id);

  return (
    <main
      className="min-h-[100vh] flex items-center justify-center bg-canai-deep"
      aria-label="Sprinkle Haven Bakery Feedback"
    >
      <div
        className="w-full max-w-lg mx-auto rounded-2xl shadow-strong p-0 bg-gradient-to-br from-[#284772ee] to-[#5fa9e355]
      border-[2.5px] border-[#36d1fe88] backdrop-blur-xl transition-all animate-fade-in"
      >
        <h1 className="font-playfair text-3xl sm:text-4xl text-canai-cyan pt-8 pb-4 px-10 animate-text-glow text-shadow-xl">
          Share Your Experience
        </h1>
        <form
          id="feedback-form"
          onSubmit={handleSubmit}
          className="p-7 pt-5 flex flex-col gap-4 bg-[#13395eE6] rounded-2xl mx-0 sm:mx-4 glassmorphism shadow-strong relative animate-fade-in"
        >
          <label htmlFor="rating-input" className="font-semibold text-base text-canai-cyan mb-0.5 leading-tight">
            How was your <span className="canai-gradient-text">SparkSplit experience?</span>
          </label>
          <div>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <label htmlFor="comment-input" className="font-semibold text-sm text-canai-cyan mt-2">
            Leave a comment
          </label>
          <Textarea
            id="comment-input"
            placeholder="What did you think of the business plan comparison? Suggestions welcome!"
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="bg-[#14284C] border-[1.7px] border-canai-primary focus-visible:ring-canai-primary transition-all text-canai-light shadow-inner rounded-lg placeholder:text-canai-light-softer"
            required
            minLength={5}
            maxLength={200}
            rows={4}
            style={{ fontSize: "1rem", fontFamily: "Inter, Manrope, sans-serif", fontWeight: 500 }}
          />
          <div id="feedback-note" className="text-xs text-canai-light-softer mt-1 mb-0.5">
            * Your honest feedback helps other founders and shapes the CanAI platform.<br />
            Need your invoice?{" "}
            <a
              id="quickbooks-link"
              href={quickbooksLink}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-canai-cyan hover:brightness-110 duration-200"
            >
              Get it from QuickBooks
            </a>
          </div>
          <div className="flex flex-wrap gap-3 items-center mt-1 mb-2 w-full">
            <ShareButton
              icon={<span className="text-lg" aria-label="Instagram">📸</span>}
              label="Instagram"
              id="share-btn-instagram"
              onClick={() => handleShare("instagram")}
            />
            <ShareButton
              icon={<span className="text-lg" aria-label="Facebook">📘</span>}
              label="Facebook"
              id="share-btn-facebook"
              onClick={() => handleShare("facebook")}
            />
            <Button
              id="refer-btn"
              type="button"
              variant="canai"
              onClick={openRefer}
              className="!py-2 !px-5 !bg-[linear-gradient(90deg,#00cfff_60%,#24e3ff_100%)] text-[#163065] font-bold shadow-[0_0_16px_#36d1fe99] hover:brightness-110 hover:scale-105 transition-all active:scale-100 border-0"
            >
              Refer a Friend
            </Button>
          </div>
          <Button
            variant="canai"
            type="submit"
            className="mt-3 !py-3 !text-lg w-full canai-btn-glow shadow-strong transition-all"
          >
            Submit
          </Button>
        </form>
        <div className="flex justify-end items-center w-full pr-9 pt-2">
          <span className="text-xs text-canai-light-softer">
            <button
              className="underline text-[#FF95AA] font-semibold hover:text-red-200 transition-all"
              type="button"
              onClick={() => setShowPurge(v => !v)}
            >
              Purge my data
            </button>
          </span>
        </div>
        <ReferModal
          email={email}
          setEmail={setEmail}
          handleRefer={handleRefer}
          onClose={() => setReferModalOpen(false)}
          open={referModalOpen}
        />
        <DangerZone showPurge={showPurge} setShowPurge={setShowPurge} handlePurge={handlePurge} />
        <Followup show={showFollowup} rating={rating} prompt_id={prompt_id} />
      </div>
    </main>
  );
};

export default FeedbackPage;

