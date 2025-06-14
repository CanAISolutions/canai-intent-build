
import React from "react";
import ProductCards from "@/components/ProductCards";

const ProductCardsSection = () => (
  <section className="w-full mt-10 pb-12 flex flex-col items-center">
    <div className="max-w-7xl mx-auto px-0 py-0 rounded-[38px] shadow-none bg-transparent w-full">
      <ProductCards />
    </div>
  </section>
);

export default ProductCardsSection;
