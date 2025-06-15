
import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Resource Constraints */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="constraints-input" className="text-canai-light font-medium">
              Resource Constraints
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  id="constraints-tooltip"
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('resourceConstraints')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>E.g., "$50k budget; team of 3; 6 months timeline"</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="constraints-input"
            value={formData.resourceConstraints}
            onChange={(e) => handleInputChange('resourceConstraints', e.target.value)}
            placeholder="e.g., $50k budget; team of 3; 6 months timeline"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[80px]"
            maxLength={200}
          />
        </div>

        {/* Current Status */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="status-input" className="text-canai-light font-medium">
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
                <p>E.g., "Planning phase - researched location, need business plan for loan"</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="status-input"
            value={formData.currentStatus}
            onChange={(e) => handleInputChange('currentStatus', e.target.value)}
            placeholder="e.g., Planning phase - researched location, need business plan for loan"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue"
            maxLength={120}
          />
        </div>

        {/* Business Description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="desc-input" className="text-canai-light font-medium">
              Business Description * (10-50 words)
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  id="desc-tooltip"
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('businessDescription')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>E.g., "Artisanal bakery serving Denver with organic pastries and community gathering space"</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="desc-input"
            value={formData.businessDescription}
            onChange={(e) => handleInputChange('businessDescription', e.target.value)}
            placeholder="e.g., Artisanal bakery serving Denver with organic pastries and community gathering space"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[100px]"
            maxLength={400}
          />
          <div className="flex justify-between text-sm text-canai-light-blue mt-1">
            <span>Word count: {countWords(formData.businessDescription)}/50</span>
            {errors.businessDescription && (
              <span className="text-red-400">{errors.businessDescription}</span>
            )}
          </div>
        </div>

        {/* Revenue Model */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="revenue-input" className="text-canai-light font-medium">
              Revenue Model
            </Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle 
                  id="revenue-tooltip"
                  className="w-4 h-4 text-canai-light-blue cursor-help"
                  onClick={() => handleTooltipClick('revenueModel')}
                />
              </TooltipTrigger>
              <TooltipContent className="bg-canai-blue-card border-canai-primary text-canai-light">
                <p>E.g., "Bakery sales, events, catering services"</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="revenue-input"
            value={formData.revenueModel}
            onChange={(e) => handleInputChange('revenueModel', e.target.value)}
            placeholder="e.g., Bakery sales, events, catering services"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue"
            maxLength={150}
          />
        </div>

        {/* Plan Purpose */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Label htmlFor="purpose-select" className="text-canai-light font-medium">
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
                <p>Will you use this for investors or internal planning?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Select value={formData.planPurpose} onValueChange={(value) => handleInputChange('planPurpose', value)}>
            <SelectTrigger id="purpose-select" className="bg-canai-blue-card border-canai-primary text-canai-light">
              <SelectValue placeholder="Select plan purpose" />
            </SelectTrigger>
            <SelectContent className="bg-canai-blue-card border-canai-primary">
              <SelectItem value="investor" className="text-canai-light hover:bg-canai-primary/20">Investor Presentation</SelectItem>
              <SelectItem value="internal" className="text-canai-light hover:bg-canai-primary/20">Internal Planning</SelectItem>
              <SelectItem value="loan" className="text-canai-light hover:bg-canai-primary/20">Loan Application</SelectItem>
            </SelectContent>
          </Select>
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
                <p>Any other important details about your bakery business?</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            id="feedback-text"
            placeholder="e.g., Family recipes passed down 3 generations, partnership with local farms established"
            className="bg-canai-blue-card border-canai-primary text-canai-light placeholder:text-canai-light-blue min-h-[80px]"
            maxLength={300}
          />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StepTwoForm;
