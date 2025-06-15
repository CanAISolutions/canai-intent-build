
import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

// Page Title Component
export const PageTitle: React.FC<TypographyProps> = ({ children, className }) => (
  <h1 className={cn(
    "text-4xl md:text-5xl lg:text-6xl font-bold text-white font-manrope tracking-tight drop-shadow-lg mb-4",
    className
  )}>
    {children}
  </h1>
);

// Section Title Component
export const SectionTitle: React.FC<TypographyProps> = ({ children, className }) => (
  <h2 className={cn(
    "text-3xl md:text-4xl font-bold text-white font-manrope tracking-tight drop-shadow-lg mb-3",
    className
  )}>
    {children}
  </h2>
);

// Card Title Component
export const CardTitle: React.FC<TypographyProps> = ({ children, className }) => (
  <h3 className={cn(
    "text-xl md:text-2xl font-bold text-white font-manrope tracking-tight drop-shadow-lg",
    className
  )}>
    {children}
  </h3>
);

// Body Text Component
export const BodyText: React.FC<TypographyProps> = ({ children, className }) => (
  <p className={cn(
    "text-base md:text-lg text-[#cce7fa] font-manrope leading-relaxed",
    className
  )}>
    {children}
  </p>
);

// Caption Text Component
export const CaptionText: React.FC<TypographyProps> = ({ children, className }) => (
  <p className={cn(
    "text-sm text-[#cce7fa] font-manrope opacity-80",
    className
  )}>
    {children}
  </p>
);

// Accent Text Component (for highlights)
export const AccentText: React.FC<TypographyProps> = ({ children, className }) => (
  <span className={cn(
    "text-[#36d1fe] font-semibold font-manrope drop-shadow-lg",
    className
  )}>
    {children}
  </span>
);
