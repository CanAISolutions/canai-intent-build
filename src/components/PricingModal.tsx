
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pricingData = [
    {
      product: 'BUSINESS_BUILDER',
      price: '$99',
      description: 'Investor-ready business plan (700–800 words).'
    },
    {
      product: 'SOCIAL_EMAIL',
      price: '$49',
      description: '3–7 social posts + 3–5 emails.'
    },
    {
      product: 'SITE_AUDIT',
      price: '$79',
      description: 'Website audit (300–400 words) + recommendations.'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-white rounded-xl p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="pricing-close"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              CanAI Pricing
            </h2>
            <p className="text-gray-600">
              Choose the perfect solution for your business needs
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">Product</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">Price</th>
                  <th className="text-left py-4 px-2 font-semibold text-gray-900">Description</th>
                </tr>
              </thead>
              <tbody>
                {pricingData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-2 font-medium text-gray-900">
                      {item.product}
                    </td>
                    <td className="py-4 px-2 text-2xl font-bold text-canai-primary">
                      {item.price}
                    </td>
                    <td className="py-4 px-2 text-gray-600">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center pt-4">
            <Button 
              onClick={onClose}
              className="canai-button-primary px-8 py-3"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
