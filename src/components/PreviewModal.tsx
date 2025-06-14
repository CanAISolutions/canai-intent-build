
import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGetSparks = () => {
    navigate('/discovery-funnel');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl p-10 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ✨ The Community Spark
            </h2>
            <p className="text-lg text-gray-600">
              Here's a sample of what CanAI can create for you
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-8 border-l-4 border-canai-primary">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Building Your Local Community Network
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your business isn't just a service—it's a cornerstone of your community. By creating genuine 
              connections with local businesses, you're not just expanding your network; you're building 
              a foundation of mutual support that elevates everyone.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Start with one meaningful conversation per week. Reach out to complementary businesses—not 
              competitors, but allies. A coffee shop partnering with a bookstore, a yoga studio connecting 
              with a healthy café. These relationships create referral networks that feel natural and authentic.
            </p>
            <div className="bg-white/60 rounded-lg p-4 mt-6">
              <p className="text-sm text-gray-600 italic">
                "This approach helped us triple our referrals in just 3 months by focusing on genuine 
                community building rather than transactional networking." - Sarah M., Local Business Owner
              </p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Button 
              onClick={handleGetSparks}
              size="lg" 
              className="canai-button-primary text-lg px-8 py-4 group"
            >
              Get Your Sparks
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            <p className="text-sm text-gray-500">
              Unlock personalized strategies crafted just for your business
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
