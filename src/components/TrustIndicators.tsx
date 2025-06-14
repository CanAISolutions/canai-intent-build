
import React from 'react';
import { Star, Users, Award } from 'lucide-react';

const TrustIndicators = () => {
  return (
    <section className="py-16 border-t border-canai-primary/20 w-full flex justify-center">
      <div className="w-full max-w-4xl px-4 grid md:grid-cols-2 gap-12">
        {/* Testimonial */}
        <div className="text-center space-y-4 flex flex-col justify-center items-center">
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="text-yellow-400 fill-current drop-shadow-[0_0_4px_#36d1fe99]" size={24} />
            ))}
          </div>
          <blockquote 
            className="text-lg text-canai-light italic font-manrope"
            style={{ fontWeight: 200, textShadow:"0 0 8px #36d1fe55" }}
            id="trust-testimonial"
          >
            "CanAI launched my bakery! The business plan was exactly what I needed for investors."
          </blockquote>
          <cite 
            className="text-canai-light opacity-80 not-italic font-manrope"
            style={{ fontWeight: 200 }}
          >
            — Jane, Sweet Dreams Bakery
          </cite>
        </div>

        {/* Stats */}
        <div className="text-center space-y-10 flex flex-col items-center justify-center">
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-canai-primary/20 rounded-full mb-3 mx-auto drop-shadow-[0_0_8px_#36d1fe55]">
                <Users className="text-canai-primary" size={28} />
              </div>
              <div 
                className="text-3xl font-bold text-canai-primary font-manrope"
                style={{ fontWeight: 700, textShadow:"0 0 8px #36d1fe77" }}
              >
                500+
              </div>
              <div 
                className="text-canai-light opacity-80 font-manrope text-base"
                style={{ fontWeight: 200 }}
              >
                Plans Created
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-canai-primary/20 rounded-full mb-3 mx-auto drop-shadow-[0_0_8px_#36d1fe55]">
                <Award className="text-canai-primary" size={28} />
              </div>
              <div 
                className="text-3xl font-bold text-canai-primary font-manrope"
                style={{ fontWeight: 700, textShadow:"0 0 8px #36d1fe77" }}
              >
                98%
              </div>
              <div 
                className="text-canai-light opacity-80 font-manrope text-base"
                style={{ fontWeight: 200 }}
              >
                Success Rate
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;

