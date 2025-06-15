
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowLeft, CreditCard } from "lucide-react";
import PricingTable from "@/components/PurchaseFlow/PricingTable";
import CheckoutModal from "@/components/PurchaseFlow/CheckoutModal";
import ConfirmationSection from "@/components/PurchaseFlow/ConfirmationSection";

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
    // TODO: PostHog integration
    // posthog.capture('funnel_step', { step: 'purchase_page_viewed' });
    console.log('[PostHog] Purchase page viewed');
  }, []);

  const handleProductSelect = (productId: ProductType) => {
    setSelectedProduct(productId);
    // TODO: PostHog integration
    // posthog.capture('product_switched', { 
    //   from_product: selectedProduct,
    //   to_product: productId,
    //   price: PRODUCTS.find(p => p.id === productId)?.price 
    // });
    console.log('[PostHog] Product switched:', { from: selectedProduct, to: productId });
  };

  const handlePurchaseClick = () => {
    const product = PRODUCTS.find(p => p.id === selectedProduct);
    if (!product) return;

    // TODO: PostHog integration
    // posthog.capture('price_viewed', { 
    //   product: selectedProduct,
    //   price: product.price 
    // });
    console.log('[PostHog] Price viewed:', { product: selectedProduct, price: product.price });
    
    setCheckoutOpen(true);
  };

  const handleCheckoutConfirm = async () => {
    setProcessing(true);
    
    try {
      // TODO: API integration - POST /v1/stripe-session
      // const response = await fetch('/v1/stripe-session', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     product: selectedProduct,
      //     price: PRODUCTS.find(p => p.id === selectedProduct)?.price
      //   })
      // });
      
      // Simulate API call with retry logic
      await simulateStripeSession();
      
      // TODO: Supabase session_logs mapping
      // await supabase.from('session_logs').insert({
      //   user_id: user?.id,
      //   interaction_type: 'purchase_initiated',
      //   interaction_details: {
      //     product: selectedProduct,
      //     price: PRODUCTS.find(p => p.id === selectedProduct)?.price,
      //     timestamp: new Date().toISOString()
      //   }
      // });
      console.log('[Supabase] Session logged:', { product: selectedProduct });

      // TODO: Redirect to Stripe
      // window.location.href = response.checkout_url;
      
      // For demo - simulate successful purchase
      setTimeout(() => {
        setProcessing(false);
        setCheckoutOpen(false);
        setPurchaseComplete(true);
        
        // TODO: PostHog integration
        // posthog.capture('purchase_completed', { 
        //   product: selectedProduct,
        //   price: PRODUCTS.find(p => p.id === selectedProduct)?.price 
        // });
        console.log('[PostHog] Purchase completed:', selectedProduct);
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
        // TODO: Show error message
        alert('Purchase failed. Please try again.');
      }
    }
  };

  // Simulate Stripe session creation with potential failure
  const simulateStripeSession = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate occasional failure for retry testing
        if (Math.random() > 0.8 && retryCount === 0) {
          reject(new Error('Network error'));
        } else {
          resolve();
        }
      }, 800);
    });
  };

  const handleRefundPolicy = () => {
    // TODO: PostHog integration
    // posthog.capture('refund_policy_viewed');
    console.log('[PostHog] Refund policy viewed');
  };

  if (purchaseComplete) {
    return <ConfirmationSection selectedProduct={selectedProduct} />;
  }

  return (
    <main 
      className="min-h-screen w-full flex flex-col items-center justify-center px-4"
      style={{
        background: `radial-gradient(ellipse at 55% 24%, #152647 0%, #091023 65%, #052947 100%)`,
        backgroundColor: "#0A1535",
      }}
    >
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="text-canai-light hover:text-canai-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sparks
          </Button>
          <h1 className="text-3xl font-bold text-canai-card-title animate-text-glow">
            Complete Your Purchase
          </h1>
          <div /> {/* Spacer */}
        </div>
        
        <p className="text-center text-canai-light-blue text-lg mb-8">
          Choose your perfect solution and get started in minutes
        </p>
      </div>

      {/* Pricing Table */}
      <div className="w-full max-w-6xl mx-auto mb-8">
        <PricingTable
          products={PRODUCTS}
          selectedProduct={selectedProduct}
          onProductSelect={handleProductSelect}
          onPurchaseClick={handlePurchaseClick}
        />
      </div>

      {/* Footer Links */}
      <div className="flex items-center gap-6 text-sm text-canai-light-blue">
        <button
          id="refund-policy"
          onClick={handleRefundPolicy}
          className="hover:text-canai-primary transition-colors underline"
        >
          30-Day Refund Policy
        </button>
        <span>•</span>
        <span id="subscription-note" className="opacity-80">
          One-time payment • No subscription
        </span>
        <span>•</span>
        <span className="opacity-80">
          Secure checkout with Stripe
        </span>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setCheckoutOpen(false)}
        selectedProduct={PRODUCTS.find(p => p.id === selectedProduct)!}
        isProcessing={isProcessing}
        onConfirm={handleCheckoutConfirm}
      />
    </main>
  );
};

export default PurchaseFlow;
