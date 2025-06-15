
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
    <main className="max-w-lg mx-auto mt-10 p-6 rounded-xl bg-gradient-to-br from-[#1a2740] to-[#28578b71] shadow-lg flex flex-col gap-6" aria-label="Sprinkle Haven Bakery Feedback">
      <h1 className="font-playfair text-3xl text-canai-cyan mb-2">Share Your Experience</h1>
      <form
        id="feedback-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-[#18304fdd] rounded-lg p-5 shadow"
      >
        <label htmlFor="rating-input" className="font-semibold text-sm text-canai-cyan">How was your SparkSplit experience?</label>
        <StarRating rating={rating} setRating={setRating} />
        <label htmlFor="comment-input" className="font-semibold text-sm text-canai-cyan mt-2">Leave a comment</label>
        <Textarea
          id="comment-input"
          placeholder="What did you think of the business plan comparison? Suggestions welcome!"
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="bg-[#13395799] border-canai-primary text-canai-light"
          required
          minLength={5}
          maxLength={200}
        />
        <div id="feedback-note" className="text-xs text-canai-light-softer mt-2 mb-1">
          * Your honest feedback helps other founders and shapes the CanAI platform.<br />
          Need your invoice? <a id="quickbooks-link" href={quickbooksLink} target="_blank" rel="noopener noreferrer" className="underline text-canai-cyan">Get it from QuickBooks</a>
        </div>
        <div className="flex gap-3 items-center">
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
            variant="secondary"
            onClick={openRefer}
            className="px-3 py-2"
          >
            Refer a Friend
          </Button>
        </div>
        <Button variant="canai" type="submit" className="mt-2 w-fit">
          Submit
        </Button>
      </form>

      <ReferModal
        email={email}
        setEmail={setEmail}
        handleRefer={handleRefer}
        onClose={() => setReferModalOpen(false)}
        open={referModalOpen}
      />

      <DangerZone showPurge={showPurge} setShowPurge={setShowPurge} handlePurge={handlePurge} />

      <Followup show={showFollowup} rating={rating} prompt_id={prompt_id} />
    </main>
  );
};

export default FeedbackPage;
