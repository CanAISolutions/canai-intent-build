
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
    if (value >= 3) return 'text-emerald-400';
    if (value >= 2) return 'text-amber-400';
    return 'text-rose-400';
  };

  const getBackgroundGradient = (value: number) => {
    if (value >= 3) return 'from-emerald-900/40 to-emerald-800/20';
    if (value >= 2) return 'from-amber-900/40 to-amber-800/20';
    return 'from-rose-900/40 to-rose-800/20';
  };

  const getBorderColor = (value: number) => {
    if (value >= 3) return 'border-emerald-400/50';
    if (value >= 2) return 'border-amber-400/50';
    return 'border-rose-400/50';
  };

  return (
    <div className="flex flex-col items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="cursor-help focus:outline-none focus:ring-2 focus:ring-[#00CFFF] focus:ring-offset-2 focus:ring-offset-[#172b47] rounded-2xl p-6 transition-all duration-300 hover:scale-105"
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
              <div className="text-sm font-semibold text-[#E6F6FF] mb-4 opacity-90">Trust Delta</div>
              <div className={`bg-gradient-to-br ${getBackgroundGradient(delta)} ${getBorderColor(delta)} border-2 rounded-2xl px-8 py-6 shadow-2xl backdrop-blur-sm`}>
                <div className={`text-5xl font-bold ${getColorClass(delta)} drop-shadow-lg`}>
                  {formatDelta(delta)}
                </div>
              </div>
              <div className="text-sm text-[#E6F6FF] mt-4 opacity-75">out of 5.0</div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent
          id="trust-delta-tooltip"
          className="max-w-sm text-center bg-[#172b47] border border-[#36d1fe66] text-[#E6F6FF] p-4 rounded-xl"
        >
          <p className="font-semibold mb-2 text-[#00CFFF] text-base">Trust Delta Score</p>
          <p className="text-sm leading-relaxed">
            Measures how well CanAI's output aligns with your vision compared to generic alternatives.
            Based on tone match (50%), emotional impact (30%), and cultural specificity (20%).
          </p>
          <p className="text-xs mt-3 opacity-75">Higher scores indicate better personalization</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default TrustDeltaDisplay;
