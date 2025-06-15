
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FormData } from "@/pages/DetailedInput";

interface StepOneFormProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  errors: Partial<FormData>;
}

const StepOneForm: React.FC<StepOneFormProps> = ({ formData, setFormData, errors }) => {
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
    
    // TODO: PostHog event for input tracking
    // posthog.capture('input_changed', {
    //   field: field,
    //   character_count: value.length,
    //   step: 1
    // });
  };

  const handleTooltipClick = (field: string) => {
    // TODO: PostHog event
    // posthog.capture('tooltip_viewed', {
    //   field: field,
    //   step: 1
    // });
    
    console.log('Tooltip viewed:', field);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Business Name */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="businessName" className="text-canai-light font-medium">
              Business Name *
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('businessName')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>The official name of your business or the name you plan to use</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="businessName"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            placeholder="e.g., Denver Community Bakery"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue"
            maxLength={100}
          />
          {errors.businessName && (
            <p className="text-red-400 text-sm mt-1">{errors.businessName}</p>
          )}
        </div>

        {/* Target Audience */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="targetAudience" className="text-canai-light font-medium">
              Target Audience *
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('targetAudience')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>Who are your ideal customers? Be specific about demographics, interests, and needs.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="targetAudience"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            placeholder="e.g., Busy Denver families with young children who value organic, locally-sourced baked goods and community connection"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[80px]"
            maxLength={500}
          />
          {errors.targetAudience && (
            <p className="text-red-400 text-sm mt-1">{errors.targetAudience}</p>
          )}
        </div>

        {/* Primary Goal */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="primaryGoal" className="text-canai-light font-medium">
              Primary Goal *
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('primaryGoal')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>What's the main objective you want to achieve with this business plan?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="primaryGoal"
            value={formData.primaryGoal}
            onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
            placeholder="e.g., Secure $50k funding to open first location within 6 months"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue"
            maxLength={200}
          />
          {errors.primaryGoal && (
            <p className="text-red-400 text-sm mt-1">{errors.primaryGoal}</p>
          )}
        </div>

        {/* Competitive Context */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="competitiveContext" className="text-canai-light font-medium">
              Competitive Context
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('competitiveContext')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>Who are your main competitors and how will you differentiate?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="competitiveContext"
            value={formData.competitiveContext}
            onChange={(e) => handleInputChange('competitiveContext', e.target.value)}
            placeholder="e.g., King Soopers dominates grocery bakery, but lacks artisanal quality and community focus"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[80px]"
            maxLength={400}
          />
        </div>

        {/* Brand Voice */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="brandVoice" className="text-canai-light font-medium">
              Brand Voice
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('brandVoice')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>How do you want your brand to sound? (e.g., warm, professional, playful, authoritative)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="brandVoice"
            value={formData.brandVoice}
            onChange={(e) => handleInputChange('brandVoice', e.target.value)}
            placeholder="e.g., Warm, community-focused, and authentically passionate about quality"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue"
            maxLength={150}
          />
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="location" className="text-canai-light font-medium">
              Location *
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('location')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>Where is your business located or where do you plan to operate?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Highland neighborhood, Denver, CO"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue"
            maxLength={100}
          />
          {errors.location && (
            <p className="text-red-400 text-sm mt-1">{errors.location}</p>
          )}
        </div>

        {/* Unique Value */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="uniqueValue" className="text-canai-light font-medium">
              Unique Value Proposition
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('uniqueValue')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>What makes your business special? What unique value do you provide?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="uniqueValue"
            value={formData.uniqueValue}
            onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
            placeholder="e.g., Only bakery in Denver offering custom celebration cakes made with locally-sourced ingredients and community storytelling"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[80px]"
            maxLength={400}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StepOneForm;
