
import React from 'react';
import { cn } from '@/lib/utils';

interface StandardCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'product' | 'content' | 'form';
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
}

const StandardCard: React.FC<StandardCardProps> = ({
  children,
  className = "",
  variant = 'default',
  hover = true,
  padding = 'lg',
  style
}) => {
  const baseClasses = "rounded-3xl border-2 transition-all duration-300 overflow-hidden";
  
  const variantClasses = {
    default: "bg-gradient-to-br from-[#193c65] via-[#1e4a73] to-[#12294a] border-[#36d1fe] shadow-[0_0_40px_rgba(54,209,254,0.3)]",
    glass: "bg-[rgba(25,60,101,0.4)] border-[rgba(54,209,254,0.2)] backdrop-blur-sm",
    product: "bg-gradient-to-br from-[#193c65] via-[#1e4a73] to-[#12294a] border-[#36d1fe] shadow-[0_0_40px_rgba(54,209,254,0.3)]",
    content: "bg-[rgba(25,60,101,0.6)] border-[rgba(54,209,254,0.3)] backdrop-blur-sm shadow-[0_0_30px_rgba(54,209,254,0.2)]",
    form: "bg-[rgba(25,60,101,0.7)] border-[rgba(54,209,254,0.4)] backdrop-blur-md shadow-[0_0_35px_rgba(54,209,254,0.25)]"
  };
  
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10"
  };
  
  const hoverClasses = hover 
    ? "hover:shadow-[0_0_60px_rgba(54,209,254,0.5)] hover:scale-[1.02]" 
    : "";

  return (
    <div 
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        className
      )}
      style={style}
    >
      <div className="w-full h-full break-words overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default StandardCard;
