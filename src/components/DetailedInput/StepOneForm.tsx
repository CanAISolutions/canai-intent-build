
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
            <Label htmlFor="name-input" className="text-canai-light font-medium">
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
                <p>E.g., "Sprinkle Haven Bakery" - Your official business name (3-50 characters)</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="name-input"
            value={formData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            placeholder="e.g., Sprinkle Haven Bakery"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue"
            maxLength={50}
          />
          {errors.businessName && (
            <p className="text-red-400 text-sm mt-1">{errors.businessName}</p>
          )}
        </div>

        {/* Target Audience */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="audience-input" className="text-canai-light font-medium">
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
                <p>E.g., "Denver families with young children who value organic, artisanal baked goods"</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="audience-input"
            value={formData.targetAudience}
            onChange={(e) => handleInputChange('targetAudience', e.target.value)}
            placeholder="e.g., Denver families with young children who value organic, artisanal baked goods"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[80px]"
            maxLength={200}
          />
          {errors.targetAudience && (
            <p className="text-red-400 text-sm mt-1">{errors.targetAudience}</p>
          )}
        </div>

        {/* Primary Goal */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="goal-select" className="text-canai-light font-medium">
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
                <p>What's your main objective for this business plan?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select value={formData.primaryGoal} onValueChange={(value) => handleInputChange('primaryGoal', value)}>
            <SelectTrigger id="goal-select" className="bg-canai-blue-card border-canai-primary text-canai-light">
              <SelectValue placeholder="Select your primary goal" />
            </SelectTrigger>
            <SelectContent className="bg-canai-blue-card border-canai-primary">
              <SelectItem value="funding" className="text-canai-light hover:bg-canai-primary/20">Secure Funding</SelectItem>
              <SelectItem value="growth" className="text-canai-light hover:bg-canai-primary/20">Business Growth</SelectItem>
              <SelectItem value="operations" className="text-canai-light hover:bg-canai-primary/20">Operational Planning</SelectItem>
            </SelectContent>
          </Select>
          {errors.primaryGoal && (
            <p className="text-red-400 text-sm mt-1">{errors.primaryGoal}</p>
          )}
        </div>

        {/* Competitive Context */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="context-input" className="text-canai-light font-medium">
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
                <p>E.g., "Blue Moon Bakery dominates downtown, but lacks organic options"</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="context-input"
            value={formData.competitiveContext}
            onChange={(e) => handleInputChange('competitiveContext', e.target.value)}
            placeholder="e.g., Blue Moon Bakery dominates downtown, but lacks organic options"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue"
            maxLength={100}
          />
        </div>

        {/* Brand Voice */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="voice-select" className="text-canai-light font-medium">
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
                <p>How should your brand communicate? "Warm" works great for community bakeries</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select value={formData.brandVoice} onValueChange={(value) => handleInputChange('brandVoice', value)}>
            <SelectTrigger id="voice-select" className="bg-canai-blue-card border-canai-primary text-canai-light">
              <SelectValue placeholder="Select brand voice" />
            </SelectTrigger>
            <SelectContent className="bg-canai-blue-card border-canai-primary">
              <SelectItem value="warm" className="text-canai-light hover:bg-canai-primary/20">Warm</SelectItem>
              <SelectItem value="bold" className="text-canai-light hover:bg-canai-primary/20">Bold</SelectItem>
              <SelectItem value="optimistic" className="text-canai-light hover:bg-canai-primary/20">Optimistic</SelectItem>
              <SelectItem value="professional" className="text-canai-light hover:bg-canai-primary/20">Professional</SelectItem>
              <SelectItem value="playful" className="text-canai-light hover:bg-canai-primary/20">Playful</SelectItem>
              <SelectItem value="inspirational" className="text-canai-light hover:bg-canai-primary/20">Inspirational</SelectItem>
              <SelectItem value="custom" className="text-canai-light hover:bg-canai-primary/20">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="location-input" className="text-canai-light font-medium">
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
                <p>E.g., "Denver, CO" - Where your business operates or will operate</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="location-input"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="e.g., Denver, CO"
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
            <Label htmlFor="unique-value-input" className="text-canai-light font-medium">
              Unique Value Proposition *
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('uniqueValue')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>E.g., "Organic, community-focused pastries with locally-sourced ingredients"</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="unique-value-input"
            value={formData.uniqueValue}
            onChange={(e) => handleInputChange('uniqueValue', e.target.value)}
            placeholder="e.g., Organic, community-focused pastries with locally-sourced ingredients"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[80px]"
            maxLength={200}
          />
          {errors.uniqueValue && (
            <p className="text-red-400 text-sm mt-1">{errors.uniqueValue}</p>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StepOneForm;
