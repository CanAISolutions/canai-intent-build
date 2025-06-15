
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
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0A0F1C 0%, #14274E 50%, #0A0F1C 100%)"
      }}
      aria-label="Sprinkle Haven Bakery Feedback"
    >
      <div className="w-full max-w-2xl mx-auto">
        {/* Main Card */}
        <div
          className="
            rounded-3xl 
            bg-gradient-to-br from-[#193c65] via-[#1e4a73] to-[#12294a]
            border-2 border-[#36d1fe] 
            shadow-[0_0_40px_rgba(54,209,254,0.3),0_0_80px_rgba(54,209,254,0.1)]
            backdrop-blur-xl 
            overflow-hidden
            animate-fade-in"
        >
          {/* Header Section */}
          <div className="px-8 pt-8 pb-6 text-center">
            <h1 className="font-playfair text-5xl font-bold text-white mb-3 drop-shadow-lg">
              Share Your Experience
            </h1>
            <p className="text-[#cce7fa] text-lg font-manrope font-medium">
              Help us improve CanAI for founders everywhere.
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-8">
            <form
              id="feedback-form"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Rating Section */}
              <div className="bg-[rgba(25,60,101,0.4)] rounded-2xl p-6 border border-[rgba(54,209,254,0.2)]">
                <label
                  htmlFor="rating-input"
                  className="block font-manrope font-bold text-lg text-white mb-4"
                >
                  How was your <span className="text-[#36d1fe]">SparkSplit experience</span>?
                </label>
                <StarRating rating={rating} setRating={setRating} />
              </div>

              {/* Comment Section */}
              <div className="bg-[rgba(25,60,101,0.4)] rounded-2xl p-6 border border-[rgba(54,209,254,0.2)]">
                <label
                  htmlFor="comment-input"
                  className="block font-manrope font-bold text-lg text-white mb-4"
                >
                  Leave a comment
                </label>
                <Textarea
                  id="comment-input"
                  placeholder="What did you think of the business plan comparison? Suggestions welcome!"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="
                    bg-[rgba(255,255,255,0.05)] 
                    border-2 border-[rgba(54,209,254,0.3)] 
                    focus:border-[#36d1fe] 
                    focus-visible:ring-2 
                    focus-visible:ring-[#36d1fe] 
                    focus-visible:ring-opacity-50
                    text-white 
                    placeholder:text-[#b3d9f2] 
                    min-h-[120px] 
                    rounded-xl
                    font-manrope
                    text-base
                    leading-relaxed
                    resize-none
                  "
                  required
                  minLength={5}
                  maxLength={200}
                  rows={4}
                />
                <div className="text-xs text-[#b3d9f2] mt-2 font-manrope">
                  Your feedback helps shape CanAI's next phase.{" "}
                  <a
                    id="quickbooks-link"
                    href={quickbooksLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#36d1fe] hover:text-[#4ae3ff] underline transition-colors duration-200"
                  >
                    Need your invoice?
                  </a>
                </div>
              </div>

              {/* Actions Section */}
              <div className="bg-[rgba(25,60,101,0.4)] rounded-2xl p-6 border border-[rgba(54,209,254,0.2)]">
                <div className="flex flex-wrap gap-4 items-center mb-6">
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
                    className="
                      bg-gradient-to-r from-[#36d1fe] to-[#00b8e6] 
                      text-[#0a1628] 
                      font-bold 
                      hover:from-[#4ae3ff] hover:to-[#36d1fe]
                      hover:scale-105 
                      transition-all 
                      duration-300
                      shadow-[0_0_20px_rgba(54,209,254,0.4)]
                      border-0
                      px-6 py-2.5
                    "
                  >
                    Refer a Friend
                  </Button>
                </div>

                <Button
                  variant="canai"
                  type="submit"
                  className="
                    w-full 
                    bg-gradient-to-r from-[#193c65] to-[#275084] 
                    text-white 
                    font-bold 
                    text-lg 
                    py-4
                    border-2 border-[#36d1fe]
                    hover:from-[#275084] hover:to-[#36d1fe] 
                    hover:scale-[1.02] 
                    transition-all 
                    duration-300
                    shadow-[0_0_30px_rgba(54,209,254,0.4)]
                    rounded-xl
                  "
                >
                  Submit Feedback
                </Button>
              </div>
            </form>

            {/* Danger Zone */}
            <div className="mt-6 flex justify-end">
              <button
                className="
                  text-[#ff8fa3] 
                  hover:text-[#ff6b85] 
                  font-medium 
                  text-sm 
                  underline 
                  transition-colors 
                  duration-200
                  font-manrope
                "
                type="button"
                onClick={() => setShowPurge(v => !v)}
              >
                Purge my data
              </button>
            </div>
          </div>
        </div>

        {/* Modals and Additional Components */}
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
