
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Shield, Clock } from "lucide-react";
import { Product } from "@/pages/PurchaseFlow";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: Product;
  isProcessing: boolean;
  onConfirm: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedProduct,
  isProcessing,
  onConfirm
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        id="checkout-modal"
        className="bg-gradient-to-br from-[#193c65]/95 via-[#1e4a73]/95 to-[#12294a]/95 border-2 border-[#36d1fe] max-w-lg text-white"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4 text-white">
            Secure Checkout
          </DialogTitle>
        </DialogHeader>

        <Card className="bg-transparent border-2 border-[#36d1fe]/50 shadow-[0_0_30px_rgba(54,209,254,0.2)]">
          <CardContent className="p-6">
            {/* Product Summary */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold mb-2 text-white">
                {selectedProduct.name}
              </h3>
              <div className="text-3xl font-bold text-[#36d1fe] mb-2">
                ${selectedProduct.price}
              </div>
              <p className="text-[#cce7fa] text-sm opacity-90">
                {selectedProduct.description}
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-white text-sm">
                <Shield className="w-4 h-4 text-[#36d1fe]" />
                <span>Secure payment with Stripe</span>
              </div>
              <div className="flex items-center gap-3 text-white text-sm">
                <Clock className="w-4 h-4 text-[#36d1fe]" />
                <span>Instant access after payment</span>
              </div>
              <div className="flex items-center gap-3 text-white text-sm">
                <CreditCard className="w-4 h-4 text-[#36d1fe]" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="canai"
                className="w-full"
                onClick={onConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay ${selectedProduct.price}
                  </>
                )}
              </Button>
              
              <Button
                variant="ghost"
                className="w-full text-white hover:text-[#36d1fe] hover:bg-[#36d1fe]/10"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-[#cce7fa] text-center mt-4 opacity-80">
              By clicking "Pay", you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
