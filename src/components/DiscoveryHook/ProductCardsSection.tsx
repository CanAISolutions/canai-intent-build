
import React from "react";
import ProductCards from "@/components/ProductCards";

const ProductCardsSection = () => (
  <section className="w-full mt-12 pb-12">
    <div className="max-w-7xl mx-auto px-2 py-6 rounded-3xl shadow-lg backdrop-blur-lg bg-gradient-to-br from-white/6 via-[#193c6540] to-[#36d1fe12]">
      <ProductCards />
    </div>
  </section>
);

export default ProductCardsSection;
