
import React from 'react';
import { useNavigate } from 'react-router-dom';
import CanAILogo from './CanAILogo';

interface PageHeaderProps {
  showBackButton?: boolean;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  showBackButton = true, 
  className = "" 
}) => {
  const navigate = useNavigate();

  return (
    <header className={`w-full flex items-center justify-between p-4 ${className}`}>
      <div 
        className="cursor-pointer hover:scale-105 transition-transform duration-300"
        onClick={() => navigate('/')}
      >
        <CanAILogo size="sm" showTagline={false} />
      </div>
      
      {showBackButton && (
        <button
          onClick={() => navigate(-1)}
          className="
            text-[#cce7fa] 
            hover:text-white 
            font-manrope 
            font-medium 
            text-sm 
            px-4 py-2 
            rounded-lg 
            border border-[rgba(54,209,254,0.3)]
            hover:border-[#36d1fe]
            transition-all 
            duration-200
            hover:bg-[rgba(54,209,254,0.1)]
          "
        >
          ← Back
        </button>
      )}
    </header>
  );
};

export default PageHeader;
