
import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
  resetError
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
    resetError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#00B2E3] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-gradient-to-br from-[#172b47]/90 to-[#1e314f]/90 backdrop-blur-sm rounded-2xl border-2 border-[#36d1fe]/40 p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-[#36d1fe] mx-auto mb-4 animate-pulse" />
          <h1 className="text-2xl font-bold text-white font-playfair mb-2">
            Oops! Something went wrong
          </h1>
          <p className="text-[#cce7fa] font-manrope">
            We're sorry for the inconvenience. Our team has been notified.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left">
            <p className="text-red-300 text-sm font-mono break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <EnhancedButton
            onClick={resetError}
            variant="primary"
            size="lg"
            icon={<RefreshCw className="h-4 w-4" />}
            iconPosition="left"
            className="flex-1"
          >
            Try Again
          </EnhancedButton>
          
          <EnhancedButton
            onClick={handleGoHome}
            variant="outline"
            size="lg"
            icon={<Home className="h-4 w-4" />}
            iconPosition="left"
            className="flex-1"
          >
            Go Home
          </EnhancedButton>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryFallback;
