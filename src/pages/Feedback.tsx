
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/feedback/ShareButton";
import { StarRating } from "@/components/feedback/StarRating";
import { ReferModal } from "@/components/feedback/ReferModal";
import { DangerZone } from "@/components/feedback/DangerZone";
import { Followup } from "@/components/feedback/Followup";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import { Instagram, Facebook } from "lucide-react";

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
      className="min-h-[100vh] flex items-center justify-center bg-canai-deep py-8 px-2 md:px-0"
      aria-label="Sprinkle Haven Bakery Feedback"
    >
      <div
        className="
          w-full max-w-lg mx-auto 
          rounded-2xl 
          bg-[linear-gradient(135deg,#14274E_80%,#12294a_100%)]
          border-[2.5px] border-[#36d1fe] 
          glassmorphism 
          shadow-strong 
          p-0 
          backdrop-blur-xl 
          transition-all 
          animate-fade-in"
        style={{
          boxShadow: "0 18px 48px 4px #00CFFF22, 0 1.5px 14px #36d1fe55"
        }}
      >
        <div className="px-0 sm:px-8 pt-7">
          <h1 className="font-playfair text-4xl sm:text-5xl text-canai-cyan pb-0.5 animate-text-glow text-shadow-xl">
            Share Your Experience
          </h1>
          <p className="text-canai-light-softer text-base sm:text-lg mt-0.5 mb-4 font-manrope">
            Help us improve CanAI for founders everywhere.
          </p>
        </div>
        <form
          id="feedback-form"
          onSubmit={handleSubmit}
          className="
            px-3 sm:px-8 pb-8 pt-4
            flex flex-col gap-5
            bg-[rgba(19,57,94,0.90)]
            rounded-2xl
            mx-0 glassmorphism
            shadow-none
            relative
            animate-fade-in
          "
        >
          <label
            htmlFor="rating-input"
            className="font-bold text-base text-canai-cyan leading-tight font-manrope"
          >
            How was your <span className="canai-gradient-text">SparkSplit experience?</span>
          </label>
          <div className="mb-1">
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <label
            htmlFor="comment-input"
            className="font-semibold text-canai-light text-sm mt-1 font-manrope"
          >
            Leave a comment
          </label>
          <Textarea
            id="comment-input"
            placeholder="What did you think of the business plan comparison? Suggestions welcome!"
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="bg-[#223a6166] border-[1.7px] border-canai-primary focus-visible:ring-canai-primary transition-all text-canai-light shadow-inner rounded-lg placeholder:text-canai-light-softer min-h-[106px] font-medium"
            required
            minLength={5}
            maxLength={200}
            rows={4}
            style={{
              fontSize: "1rem",
              fontFamily: "Inter, Manrope, sans-serif",
              fontWeight: 500
            }}
          />
          <div id="feedback-note" className="text-xs text-canai-light-softer mt-1 mb-0.5 font-manrope">
            * Your feedback helps shape CanAI's next phase.<br />
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
              icon={<Instagram size={20} />}
              label="Instagram"
              id="share-btn-instagram"
              onClick={() => handleShare("instagram")}
            />
            <ShareButton
              icon={<Facebook size={20} />}
              label="Facebook"
              id="share-btn-facebook"
              onClick={() => handleShare("facebook")}
            />
            <Button
              id="refer-btn"
              type="button"
              variant="canai"
              onClick={openRefer}
              className="!py-2 !px-5 bg-[linear-gradient(90deg,#00cfff_60%,#24e3ff_100%)] text-[#163065] font-bold shadow-[0_0_16px_#36d1fe99] hover:brightness-110 hover:scale-105 transition-all border-0"
            >
              Refer a Friend
            </Button>
          </div>
          <Button
            variant="canai"
            type="submit"
            className="mt-2 !py-3 !text-lg w-full canai-btn-glow shadow-strong transition-all font-manrope font-bold"
          >
            Submit
          </Button>
        </form>
        <div className="flex justify-end items-center w-full pr-8 pt-2 pb-2">
          <button
            className="underline text-[#FF95AA] font-semibold hover:text-red-200 transition-all text-xs font-manrope"
            type="button"
            onClick={() => setShowPurge(v => !v)}
          >
            Purge my data
          </button>
        </div>
        <div className="px-2 sm:px-8 pb-4">
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
      </div>
    </main>
  );
};

export default FeedbackPage;

