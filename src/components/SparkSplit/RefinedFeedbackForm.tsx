
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type RefinedFeedbackFormProps = {
  selection: string;
  onSelection: (value: string) => void;
  feedback: string;
  onFeedback: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting?: boolean;
};

const RefinedFeedbackForm: React.FC<RefinedFeedbackFormProps> = ({
  selection,
  onSelection,
  feedback,
  onFeedback,
  onSubmit,
  isSubmitting = false
}) => {
  return (
    <div className="bg-[#172b47] rounded-xl border border-[#36d1fe66] p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-canai-light mb-4" id="feedback-heading">
            Which output feels more like you?
          </h3>
          <RadioGroup
            value={selection}
            onValueChange={onSelection}
            className="space-y-3"
            aria-labelledby="feedback-heading"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#1E314F] transition-colors">
              <RadioGroupItem 
                value="canai" 
                id="choice-canai"
                className="border-[#00CFFF] text-[#00CFFF] focus:ring-[#00CFFF] focus:ring-offset-[#172b47]"
              />
              <Label 
                htmlFor="choice-canai" 
                className="text-[#00CFFF] font-medium cursor-pointer flex-1"
              >
                CanAI Output
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#1E314F] transition-colors">
              <RadioGroupItem 
                value="generic" 
                id="choice-generic"
                className="border-gray-400 text-gray-400 focus:ring-gray-400 focus:ring-offset-[#172b47]"
              />
              <Label 
                htmlFor="choice-generic" 
                className="text-gray-300 font-medium cursor-pointer flex-1"
              >
                Generic Output
              </Label>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-[#1E314F] transition-colors">
              <RadioGroupItem 
                value="neither" 
                id="choice-neither"
                className="border-red-400 text-red-400 focus:ring-red-400 focus:ring-offset-[#172b47]"
              />
              <Label 
                htmlFor="choice-neither" 
                className="text-red-300 font-medium cursor-pointer flex-1"
              >
                Neither feels right
              </Label>
            </div>
          </RadioGroup>
        </div>

        {(selection === 'generic' || selection === 'neither') && (
          <div className="space-y-2">
            <Label 
              htmlFor="feedback-text" 
              className="text-sm font-medium text-canai-light"
            >
              {selection === 'generic' 
                ? 'Why does the generic output feel better?' 
                : 'What would make either output feel more like you?'
              }
            </Label>
            <Textarea
              id="feedback-text"
              value={feedback}
              onChange={(e) => onFeedback(e.target.value)}
              placeholder={selection === 'generic'
                ? 'Tell us what resonated with you about the generic version...'
                : 'Help us understand what both outputs are missing...'
              }
              className="min-h-[100px] bg-[#1E314F] border-[#36d1fe66] text-canai-light placeholder:text-gray-400 focus:border-[#00CFFF] focus:ring-[#00CFFF]"
              required
              aria-describedby={selection === 'generic' ? 'generic-help' : 'neither-help'}
            />
            <p 
              id={selection === 'generic' ? 'generic-help' : 'neither-help'}
              className="text-xs text-gray-400"
            >
              Your feedback helps us improve our AI to better match your vision.
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="canai"
          disabled={!selection || isSubmitting || ((selection === 'generic' || selection === 'neither') && !feedback.trim())}
          className="w-full"
          aria-describedby="submit-help"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
        <p id="submit-help" className="text-xs text-gray-400 text-center">
          Your preferences are saved securely and help improve our AI.
        </p>
      </form>
    </div>
  );
};

export default RefinedFeedbackForm;
