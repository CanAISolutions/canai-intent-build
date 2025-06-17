
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
        className="bg-gradient-to-br from-[#193c65]/95 via-[#1e4a73]/95 to-[#12294a]/95 border-2 border-[#36d1fe] max-w-lg text-white backdrop-blur-md"
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
              <p className="text-[#e6f6ff] text-sm opacity-95">
                {selectedProduct.description}
              </p>
            </div>

            {/* Security Features */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-[#e6f6ff] text-sm">
                <Shield className="w-4 h-4 text-[#36d1fe]" />
                <span className="font-medium">Secure payment with Stripe</span>
              </div>
              <div className="flex items-center gap-3 text-[#e6f6ff] text-sm">
                <Clock className="w-4 h-4 text-[#36d1fe]" />
                <span className="font-medium">Instant access after payment</span>
              </div>
              <div className="flex items-center gap-3 text-[#e6f6ff] text-sm">
                <CreditCard className="w-4 h-4 text-[#36d1fe]" />
                <span className="font-medium">30-day money-back guarantee</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                className="w-full bg-gradient-to-r from-[#00cfff] to-[#00b2e3] hover:from-[#00b8e6] hover:to-[#009fcc] text-[#0a0f1c] font-bold py-3 px-6 rounded-lg shadow-[0_0_20px_rgba(0,207,255,0.4)] hover:shadow-[0_0_30px_rgba(0,207,255,0.6)] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                onClick={onConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0a0f1c] mr-2" />
                    <span className="text-[#0a0f1c] font-bold">Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2 text-[#0a0f1c]" />
                    <span className="text-[#0a0f1c] font-bold">Pay ${selectedProduct.price}</span>
                  </>
                )}
              </Button>
              
              <Button
                className="w-full bg-transparent border-2 border-[#36d1fe]/30 text-[#e6f6ff] hover:bg-[#36d1fe]/10 hover:border-[#36d1fe]/50 hover:text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onClose}
                disabled={isProcessing}
              >
                Cancel
              </Button>
            </div>

            <p className="text-xs text-[#e6f6ff]/80 text-center mt-4 font-medium">
              By clicking "Pay", you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
