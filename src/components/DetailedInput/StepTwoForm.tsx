
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormData } from "@/pages/DetailedInput";

interface StepTwoFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Partial<FormData>;
}

const StepTwoForm: React.FC<StepTwoFormProps> = ({ formData, setFormData, errors }) => {
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // TODO: PostHog event for input tracking
    // posthog.capture('input_changed', {
    //   field: field,
    //   character_count: value.length,
    //   step: 2
    // });
  };

  const handleTooltipClick = (field: string) => {
    // TODO: PostHog event
    // posthog.capture('tooltip_viewed', {
    //   field: field,
    //   step: 2
    // });
    
    console.log('Tooltip viewed:', field);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Resource Constraints */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="resourceConstraints" className="text-canai-light font-medium">
              Resource Constraints
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('resourceConstraints')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>What limitations do you face? (budget, time, team size, experience, etc.)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="resourceConstraints"
            value={formData.resourceConstraints}
            onChange={(e) => handleInputChange('resourceConstraints', e.target.value)}
            placeholder="e.g., Limited to $75k initial investment, working solo for first 6 months, no prior food service experience"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[80px]"
            maxLength={400}
          />
        </div>

        {/* Current Status */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="currentStatus" className="text-canai-light font-medium">
              Current Status
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('currentStatus')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>Where are you now in your business journey? (idea stage, early planning, prototype, etc.)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="currentStatus"
            value={formData.currentStatus}
            onChange={(e) => handleInputChange('currentStatus', e.target.value)}
            placeholder="e.g., Completed market research, secured potential location, need business plan for loan application"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[80px]"
            maxLength={400}
          />
        </div>

        {/* Business Description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="businessDescription" className="text-canai-light font-medium">
              Business Description *
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('businessDescription')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>Provide a comprehensive overview of what your business does and how it operates</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="businessDescription"
            value={formData.businessDescription}
            onChange={(e) => handleInputChange('businessDescription', e.target.value)}
            placeholder="e.g., A community-focused artisanal bakery offering fresh breads, pastries, and custom celebration cakes made with locally-sourced organic ingredients. We provide a cozy gathering space where families can enjoy quality baked goods while supporting local farmers and building neighborhood connections."
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[120px]"
            maxLength={800}
          />
          {errors.businessDescription && (
            <p className="text-red-400 text-sm mt-1">{errors.businessDescription}</p>
          )}
        </div>

        {/* Revenue Model */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="revenueModel" className="text-canai-light font-medium">
              Revenue Model *
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('revenueModel')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>How will you make money? What are your main revenue streams?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="revenueModel"
            value={formData.revenueModel}
            onChange={(e) => handleInputChange('revenueModel', e.target.value)}
            placeholder="e.g., Daily fresh baked goods (60%), custom cake orders (25%), catering services (10%), coffee and beverages (5%)"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[80px]"
            maxLength={400}
          />
          {errors.revenueModel && (
            <p className="text-red-400 text-sm mt-1">{errors.revenueModel}</p>
          )}
        </div>

        {/* Plan Purpose */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="planPurpose" className="text-canai-light font-medium">
              Plan Purpose *
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('planPurpose')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>What will you use this business plan for? (funding, internal planning, partnerships, etc.)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="planPurpose"
            value={formData.planPurpose}
            onChange={(e) => handleInputChange('planPurpose', e.target.value)}
            placeholder="e.g., SBA loan application and investor presentations"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue"
            maxLength={200}
          />
          {errors.planPurpose && (
            <p className="text-red-400 text-sm mt-1">{errors.planPurpose}</p>
          )}
        </div>

        {/* Feedback Section */}
        <div className="pt-4 border-t border-canai-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="feedback-text" className="text-canai-light font-medium">
              Additional Context (Optional)
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-canai-light-blue cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>Any other important details we should know about your business?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="feedback-text"
            placeholder="e.g., Family recipes passed down 3 generations, partnership with local farms already established, target grand opening for holiday season"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[80px]"
            maxLength={500}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StepTwoForm;
