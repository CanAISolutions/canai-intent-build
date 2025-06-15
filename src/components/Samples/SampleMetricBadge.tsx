
import React from "react";

export interface SampleMetricBadgeProps {
  label: string;
  value: string;
  emoji?: string;
  color?: string;
  "aria-label"?: string;
}

const SampleMetricBadge: React.FC<SampleMetricBadgeProps> = ({
  label,
  value,
  emoji,
  color = "from-canai-primary to-canai-gradient-anchor",
  ...props
}) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold animate-fade-in text-base bg-gradient-to-r ${color} shadow canai-glow-soft text-canai-light/95 border border-white/5 transition-all duration-200`}
    {...props}
    tabIndex={0}
  >
    {emoji && <span className="text-lg">{emoji}</span>}
    <span className="sr-only">{label}: </span>
    <span aria-hidden className="uppercase tracking-wide font-bold">{label}</span>
    <span className="ml-1 font-extrabold text-white animate-countup-glow">{value}</span>
  </span>
);

export default SampleMetricBadge;
