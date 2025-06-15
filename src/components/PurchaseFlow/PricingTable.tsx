
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Product, ProductType } from "@/pages/PurchaseFlow";

interface PricingTableProps {
  products: Product[];
  selectedProduct: ProductType;
  onProductSelect: (productId: ProductType) => void;
  onPurchaseClick: () => void;
}

const PricingTable: React.FC<PricingTableProps> = ({
  products,
  selectedProduct,
  onProductSelect,
  onPurchaseClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card
          key={product.id}
          className={`canai-pricing-card relative transition-all duration-300 cursor-pointer ${
            selectedProduct === product.id
              ? 'ring-4 ring-canai-primary scale-105 animate-glow-pop'
              : 'hover:scale-102'
          } ${product.highlighted ? 'border-canai-primary' : ''}`}
          onClick={() => onProductSelect(product.id)}
        >
          {product.highlighted && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-canai-primary to-canai-cyan px-4 py-1 rounded-full text-sm font-bold text-white">
                Most Popular
              </span>
            </div>
          )}

          <CardHeader className="text-center pb-6">
            <CardTitle className="text-canai-card-title text-xl font-bold mb-2">
              {product.name.toUpperCase()}
            </CardTitle>
            <div className="text-4xl font-extrabold text-canai-primary mb-2">
              ${product.price}
            </div>
            <p className="text-canai-light-blue text-sm">
              {product.description}
            </p>
          </CardHeader>

          <CardContent>
            <ul className="space-y-3 mb-6">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-canai-primary mt-0.5 flex-shrink-0" />
                  <span className="text-canai-light text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              id={selectedProduct === product.id ? "purchase-btn" : "change-product"}
              variant="canai"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedProduct === product.id) {
                  onPurchaseClick();
                } else {
                  onProductSelect(product.id);
                }
              }}
            >
              {selectedProduct === product.id ? (
                <>
                  <span>Purchase Now</span>
                  <Check className="w-4 h-4 ml-2" />
                </>
              ) : (
                'Select Plan'
              )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PricingTable;
