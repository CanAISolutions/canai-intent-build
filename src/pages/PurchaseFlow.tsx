
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PricingTable from "@/components/PurchaseFlow/PricingTable";
import CheckoutModal from "@/components/PurchaseFlow/CheckoutModal";
import ConfirmationSection from "@/components/PurchaseFlow/ConfirmationSection";
import StandardBackground from "@/components/StandardBackground";
import StandardCard from "@/components/StandardCard";
import PageHeader from "@/components/PageHeader";
import { PageTitle, BodyText, CaptionText } from "@/components/StandardTypography";

// Product types for type safety
export type ProductType = 'business_builder' | 'social_email' | 'site_audit';

export interface Product {
  id: ProductType;
  name: string;
  price: number;
  features: string[];
  description: string;
  highlighted?: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: 'business_builder',
    name: 'Business Builder',
    price: 99,
    features: [
      '700–800 words, investor-ready',
      'AI+expert crafted analysis',
      'Market positioning & competition',
      'Fast 24h turnaround'
    ],
    description: 'Get a beautiful, actionable business plan—delivered fast.',
    highlighted: true,
  },
  {
    id: 'social_email',
    name: 'Social Email Kit',
    price: 49,
    features: [
      '3-7 social posts, branded',
      '3-5 conversion email drafts',
      'Tailored to your audience',
      'Launch & boost messaging'
    ],
    description: 'Jumpstart your brand buzz with social and emails.',
  },
  {
    id: 'site_audit',
    name: 'Site Audit & Boost',
    price: 79,
    features: [
      '300–400 word deep-dive audit',
      'Actionable recommendations',
      'Design, UX & copy insights',
      'Prioritized next steps'
    ],
    description: 'Optimize your digital presence with expert insights.',
  }
];

const PurchaseFlow = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>('business_builder');
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isProcessing, setProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // PostHog integration placeholder
  useEffect(() => {
    console.log('[PostHog] Purchase page viewed');
  }, []);

  const handleProductSelect = (productId: ProductType) => {
    setSelectedProduct(productId);
    console.log('[PostHog] Product switched:', { from: selectedProduct, to: productId });
  };

  const handlePurchaseClick = () => {
    const product = PRODUCTS.find(p => p.id === selectedProduct);
    if (!product) return;

    console.log('[PostHog] Price viewed:', { product: selectedProduct, price: product.price });
    setCheckoutOpen(true);
  };

  const handleCheckoutConfirm = async () => {
    setProcessing(true);
    
    try {
      // Simulate API call with retry logic
      await simulateStripeSession();
      
      console.log('[Supabase] Session logged:', { product: selectedProduct });

      // For demo - simulate successful purchase
      setTimeout(() => {
        setProcessing(false);
        setCheckoutOpen(false);
        setPurchaseComplete(true);
        
        console.log('[PostHog] Purchase completed:', selectedProduct);
        
        // Navigate to Detailed Input Collection after purchase
        setTimeout(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const promptId = urlParams.get('prompt_id') || 'demo-prompt-id';
          window.location.href = `/detailed-input?prompt_id=${promptId}&product=${selectedProduct}`;
        }, 2000);
        
      }, 2000);

    } catch (error) {
      console.error('Purchase error:', error);
      
      // Retry logic with exponential backoff
      if (retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000;
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          handleCheckoutConfirm();
        }, delay);
      } else {
        setProcessing(false);
        alert('Purchase failed. Please try again.');
      }
    }
  };

  // Simulate Stripe session creation with potential failure
  const simulateStripeSession = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.8 && retryCount === 0) {
          reject(new Error('Network error'));
        } else {
          resolve();
        }
      }, 800);
    });
  };

  const handleRefundPolicy = () => {
    console.log('[PostHog] Refund policy viewed');
  };

  if (purchaseComplete) {
    return <ConfirmationSection selectedProduct={selectedProduct} />;
  }

  return (
    <StandardBackground>
      <PageHeader showBackButton={true} logoSize="sm" showTagline={false} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-12 animate-fade-in">
          <div className="text-center mb-8">
            <PageTitle className="text-center mb-4 animate-text-glow">
              Complete Your Purchase
            </PageTitle>
            
            <BodyText className="text-xl max-w-2xl mx-auto">
              Choose your perfect solution and get started in minutes
            </BodyText>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="mb-12 animate-fade-in">
          <PricingTable
            products={PRODUCTS}
            selectedProduct={selectedProduct}
            onProductSelect={handleProductSelect}
            onPurchaseClick={handlePurchaseClick}
          />
        </div>

        {/* Footer Links */}
        <div className="animate-fade-in">
          <StandardCard variant="glass" padding="md" className="text-center">
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <button
                onClick={handleRefundPolicy}
                className="text-[#cce7fa] hover:text-[#36d1fe] transition-colors underline"
              >
                30-Day Refund Policy
              </button>
              <span className="text-[#cce7fa]">•</span>
              <CaptionText className="opacity-80 mb-0">
                One-time payment • No subscription
              </CaptionText>
              <span className="text-[#cce7fa]">•</span>
              <CaptionText className="opacity-80 mb-0">
                Secure checkout with Stripe
              </CaptionText>
            </div>
          </StandardCard>
        </div>

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setCheckoutOpen(false)}
          selectedProduct={PRODUCTS.find(p => p.id === selectedProduct)!}
          isProcessing={isProcessing}
          onConfirm={handleCheckoutConfirm}
        />
      </div>
    </StandardBackground>
  );
};

export default PurchaseFlow;
