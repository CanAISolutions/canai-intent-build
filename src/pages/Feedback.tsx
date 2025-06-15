
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/feedback/StarRating";
import { ReferModal } from "@/components/feedback/ReferModal";
import { DangerZone } from "@/components/feedback/DangerZone";
import { Followup } from "@/components/feedback/Followup";
import SuccessAnimation from "@/components/feedback/SuccessAnimation";
import EnhancedSocialShare from "@/components/feedback/EnhancedSocialShare";
import EnhancedReferral from "@/components/feedback/EnhancedReferral";
import { useFeedbackForm } from "@/hooks/useFeedbackForm";
import PageHeader from "@/components/PageHeader";
import StandardBackground from "@/components/StandardBackground";
import StandardCard from "@/components/StandardCard";
import { PageTitle, SectionTitle, BodyText, CaptionText } from "@/components/StandardTypography";

const quickbooksLink = "https://quickbooks.intuit.com/";
const prompt_id = "SPRINKLE_PROMPT_ID"; // Get real prompt_id from context in future

const FeedbackPage: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  
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
    handleSubmit: originalHandleSubmit,
    handleRefer,
    handlePurge,
    handleShare,
    openRefer,
  } = useFeedbackForm(prompt_id);

  const handleSubmit = async (e: React.FormEvent) => {
    await originalHandleSubmit(e);
    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setFeedbackSubmitted(true);
  };

  const handleReferralSubmit = async (email: string) => {
    // Create a mock form event for the existing handler
    const mockEvent = { preventDefault: () => {} } as React.FormEvent;
    await handleRefer(mockEvent);
  };

  return (
    <StandardBackground>
      <PageHeader showBackButton={true} logoSize="sm" showTagline={false} />
      
      <main className="flex-1 flex items-center justify-center px-4 py-8" aria-label="CanAI Feedback">
        <div className="w-full max-w-4xl mx-auto">
          {/* Main Content */}
          {!feedbackSubmitted ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Feedback Form - Takes 2 columns */}
              <div className="lg:col-span-2">
                <StandardCard variant="form" padding="xl" className="animate-fade-in">
                  <div className="text-center mb-8">
                    <PageTitle className="text-4xl mb-4">
                      Share Your Experience
                    </PageTitle>
                    <BodyText className="text-lg">
                      Help us improve CanAI for founders everywhere.
                    </BodyText>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Rating Section */}
                    <div>
                      <SectionTitle className="text-xl mb-4 text-white">
                        How was your <span className="text-[#36d1fe]">SparkSplit experience</span>?
                      </SectionTitle>
                      <StarRating rating={rating} setRating={setRating} />
                    </div>

                    {/* Comment Section */}
                    <div>
                      <SectionTitle className="text-xl mb-4 text-white">
                        Leave a comment
                      </SectionTitle>
                      <Textarea
                        placeholder="What did you think of the business plan comparison? Suggestions welcome!"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className="
                          bg-[rgba(255,255,255,0.05)] 
                          border-2 border-[rgba(54,209,254,0.3)] 
                          focus:border-[#36d1fe] 
                          text-white 
                          placeholder:text-[#b3d9f2] 
                          min-h-[120px] 
                          rounded-xl
                        "
                        required
                        minLength={5}
                        maxLength={200}
                        rows={4}
                      />
                      <CaptionText className="mt-2 mb-0">
                        Your feedback helps shape CanAI's next phase.{" "}
                        <a
                          href={quickbooksLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#36d1fe] hover:text-[#4ae3ff] underline transition-colors duration-200"
                        >
                          Need your invoice?
                        </a>
                      </CaptionText>
                    </div>

                    {/* Submit Button */}
                    <Button
                      variant="default"
                      type="submit"
                      size="lg"
                      className="
                        w-full 
                        bg-gradient-to-r from-[#36d1fe] to-[#00b8e6] 
                        text-[#0a1628] 
                        font-bold 
                        text-lg 
                        py-4
                        hover:from-[#4ae3ff] hover:to-[#36d1fe] 
                        hover:scale-[1.02] 
                        transition-all 
                        duration-300
                        border-0
                      "
                    >
                      Submit Feedback
                    </Button>
                  </form>

                  {/* Danger Zone */}
                  <div className="flex justify-end mt-8">
                    <button
                      className="
                        text-[#ff8fa3] 
                        hover:text-[#ff6b85] 
                        font-medium 
                        text-sm 
                        underline 
                        transition-colors 
                        duration-200
                      "
                      type="button"
                      onClick={() => setShowPurge(v => !v)}
                    >
                      Purge my data
                    </button>
                  </div>
                </StandardCard>
              </div>

              {/* Sidebar - Social and Referral */}
              <div className="space-y-6">
                <EnhancedSocialShare onShare={handleShare} />
                <EnhancedReferral onRefer={handleReferralSubmit} />
              </div>
            </div>
          ) : (
            /* Post-Submission View */
            <div className="text-center space-y-8 animate-fade-in">
              <StandardCard variant="form" padding="xl" className="max-w-2xl mx-auto">
                <PageTitle className="text-3xl mb-4">
                  Thank You! 🎉
                </PageTitle>
                <BodyText className="text-lg mb-8">
                  Your feedback has been received and will help us improve CanAI for all founders.
                </BodyText>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-[#36d1fe] text-[#36d1fe] hover:bg-[#36d1fe]/20"
                    onClick={() => window.location.href = '/'}
                  >
                    Return Home
                  </Button>
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-[#36d1fe] hover:bg-[#00f0ff] text-white"
                    onClick={() => window.location.href = '/spark-layer'}
                  >
                    Create Another Plan
                  </Button>
                </div>
              </StandardCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <EnhancedSocialShare onShare={handleShare} />
                <EnhancedReferral onRefer={handleReferralSubmit} />
              </div>
            </div>
          )}

          {/* Success Animation Overlay */}
          <SuccessAnimation 
            show={showSuccess} 
            onComplete={handleSuccessComplete}
          />

          {/* Modals */}
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
    </StandardBackground>
  );
};

export default FeedbackPage;
