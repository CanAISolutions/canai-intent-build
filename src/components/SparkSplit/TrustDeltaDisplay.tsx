
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

type TrustDeltaDisplayProps = {
  delta: number;
  onTooltipView?: () => void;
};

const TrustDeltaDisplay: React.FC<TrustDeltaDisplayProps> = ({ delta, onTooltipView }) => {
  const formatDelta = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}`;
  };

  const getColorClass = (value: number) => {
    if (value >= 3) return 'text-green-400';
    if (value >= 2) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getBackgroundGlow = (value: number) => {
    if (value >= 3) return 'shadow-[0_0_20px_rgba(34,197,94,0.3)]';
    if (value >= 2) return 'shadow-[0_0_20px_rgba(234,179,8,0.3)]';
    return 'shadow-[0_0_20px_rgba(239,68,68,0.3)]';
  };

  return (
    <div className="flex flex-col items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="cursor-help focus:outline-none focus:ring-2 focus:ring-[#00CFFF] focus:ring-offset-2 focus:ring-offset-[#172b47] rounded-lg p-4"
            onClick={onTooltipView}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTooltipView?.();
              }
            }}
            tabIndex={0}
            role="button"
            aria-describedby="trust-delta-tooltip"
            aria-label={`Trust Delta score: ${formatDelta(delta)}`}
          >
            <div className="text-center">
              <div className="text-xs font-medium text-canai-light mb-2">Trust Delta</div>
              <div className={`text-4xl font-bold ${getColorClass(delta)} ${getBackgroundGlow(delta)} bg-[#172b47] rounded-lg px-6 py-3 border border-current border-opacity-30`}>
                {formatDelta(delta)}
              </div>
              <div className="text-xs text-canai-light mt-2 opacity-75">out of 5.0</div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          id="trust-delta-tooltip"
          className="max-w-xs text-center bg-[#172b47] border border-[#36d1fe66] text-canai-light"
        >
          <p className="font-semibold mb-1 text-[#00CFFF]">Trust Delta Score</p>
          <p className="text-sm">
            Measures how well CanAI's output aligns with your vision compared to generic alternatives.
            Based on tone match (50%), emotional impact (30%), and cultural specificity (20%).
          </p>
          <p className="text-xs mt-2 opacity-75">Higher scores indicate better personalization</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default TrustDeltaDisplay;
