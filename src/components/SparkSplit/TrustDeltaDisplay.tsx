
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
    if (value >= 2) return 'text-green-400';
    if (value >= 1) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex flex-col items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="cursor-help"
            onClick={onTooltipView}
            onKeyDown={(e) => e.key === 'Enter' && onTooltipView?.()}
            tabIndex={0}
            role="button"
            aria-describedby="trust-delta-tooltip"
          >
            <div className="text-xs font-medium text-canai-light mb-1">Trust Delta</div>
            <div className={`text-2xl font-bold ${getColorClass(delta)}`}>
              {formatDelta(delta)}
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          id="trust-delta-tooltip"
          className="max-w-xs text-center"
        >
          <p className="font-semibold mb-1">Trust Delta Score</p>
          <p className="text-sm">
            Measures how well CanAI's output aligns with your vision compared to generic alternatives.
            Based on tone match (50%), emotional impact (30%), and cultural specificity (20%).
          </p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default TrustDeltaDisplay;
