
import React from 'react';

interface CanAILogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
}

const CanAILogo: React.FC<CanAILogoProps> = ({ 
  size = 'md', 
  showTagline = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  };

  const taglineSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center space-y-1 ${className}`}>
      <h1 className={`canai-logo ${sizeClasses[size]} tracking-wider`}>
        CanAI.so
      </h1>
      {showTagline && (
        <p className={`canai-tagline ${taglineSizes[size]} text-center`}>
          Empowerment Through Ease
        </p>
      )}
    </div>
  );
};

export default CanAILogo;
