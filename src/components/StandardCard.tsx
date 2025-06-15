
import React from 'react';
import { cn } from '@/lib/utils';

interface StandardCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'product';
  hover?: boolean;
}

const StandardCard: React.FC<StandardCardProps> = ({
  children,
  className = "",
  variant = 'default',
  hover = true
}) => {
  const baseClasses = "rounded-3xl border-2 transition-all duration-300";
  
  const variantClasses = {
    default: "bg-gradient-to-br from-[#193c65] via-[#1e4a73] to-[#12294a] border-[#36d1fe] shadow-[0_0_40px_rgba(54,209,254,0.3)]",
    glass: "bg-[rgba(25,60,101,0.4)] border-[rgba(54,209,254,0.2)] backdrop-blur-sm",
    product: "bg-gradient-to-br from-[#193c65] via-[#1e4a73] to-[#12294a] border-[#36d1fe] shadow-[0_0_40px_rgba(54,209,254,0.3)]"
  };
  
  const hoverClasses = hover 
    ? "hover:shadow-[0_0_60px_rgba(54,209,254,0.5)] hover:scale-[1.02]" 
    : "";

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
};

export default StandardCard;
