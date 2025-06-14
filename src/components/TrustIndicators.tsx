
import React from 'react';
import { Star, Users, Award } from 'lucide-react';

const TrustIndicators = () => {
  return (
    <section className="py-16 border-t border-canai-primary/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Testimonial */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="text-yellow-400 fill-current" size={24} />
              ))}
            </div>
            <blockquote className="text-xl text-canai-light italic">
              "CanAI launched my bakery! The business plan was exactly what I needed for investors."
            </blockquote>
            <cite className="text-canai-light opacity-80 not-italic">
              — Jane, Sweet Dreams Bakery
            </cite>
          </div>

          {/* Stats */}
          <div className="text-center space-y-6">
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-canai-primary/20 rounded-full mb-3 mx-auto">
                  <Users className="text-canai-primary" size={28} />
                </div>
                <div className="text-3xl font-bold text-canai-primary">500+</div>
                <div className="text-canai-light opacity-80">Plans Created</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center w-16 h-16 bg-canai-primary/20 rounded-full mb-3 mx-auto">
                  <Award className="text-canai-primary" size={28} />
                </div>
                <div className="text-3xl font-bold text-canai-primary">98%</div>
                <div className="text-canai-light opacity-80">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
