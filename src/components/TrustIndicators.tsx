
import React, { useEffect, useRef, useState } from 'react';
import { Star, Users, Award } from 'lucide-react';

// CountUp animation helper
function useCountUp({ to, duration = 1200, step = 1, start = 0 }) {
  const [value, setValue] = useState(start);
  const startTime = useRef<number | null>(null);

  useEffect(() => {
    let raf: number;
    function tick(now: number) {
      if (!startTime.current) startTime.current = now;
      const elapsed = now - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const nextValue = Math.floor(progress * (to - start) + start);
      setValue(nextValue);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(to);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line
  }, [to, duration, step, start]);

  return value;
}

const TrustIndicators = () => {
  const plansCount = useCountUp({ to: 600, duration: 1200, start: 540 });
  const [progress, setProgress] = useState(0);

  // Animate progress bar
  useEffect(() => {
    let raf: number;
    const startTime = performance.now();
    function animate(now: number) {
      const pct = Math.min((now - startTime) / 1050, 1) * 98;
      setProgress(pct);
      if (pct < 98) raf = requestAnimationFrame(animate);
      else setProgress(98);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Animate stars
  const [starVisible, setStarVisible] = useState(Array(5).fill(false));
  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];
    for (let i = 0; i < 5; i++) {
      timeoutIds.push(
        setTimeout(() => {
          setStarVisible((prev) => {
            const arr = [...prev];
            arr[i] = true;
            return arr;
          });
        }, 200 + i * 160)
      );
    }
    return () => timeoutIds.forEach(clearTimeout);
  }, []);

  return (
    <section className="py-16 border-t border-canai-primary/20 w-full flex justify-center">
      <div className="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-5">
        {/* Testimonial */}
        <div className="text-center space-y-4 flex flex-col justify-center items-center md:items-start md:text-left">
          <div className="flex justify-center mb-4 space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`text-yellow-400 fill-current drop-shadow-[0_0_5px_#36d1fe88] transition-all duration-300 will-change-transform
                  ${starVisible[i] ? 'scale-110 opacity-100 animate-glow-pop' : 'scale-75 opacity-40'}`}
                size={25}
                aria-label="Testimonial star"
                style={{
                  filter: "drop-shadow(0 0 8px #36d1fe55)"
                }}
              />
            ))}
          </div>
          <blockquote 
            className="text-lg text-canai-light italic font-manrope max-w-[320px] md:max-w-full"
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

        {/* Plans Created Stat */}
        <div className="flex flex-col items-center justify-center text-center md:border-x md:border-canai-primary/10">
          <div className="flex items-center justify-center w-16 h-16 bg-canai-primary/20 rounded-full mb-3 mx-auto drop-shadow-[0_0_8px_#36d1fe55] animate-glow-pop" style={{ animationDelay: "500ms" }}>
            <Users className="text-canai-primary" size={28} />
          </div>
          <div 
            className="text-4xl font-extrabold text-canai-primary font-manrope animate-countup-glow"
            style={{ fontWeight: 800, textShadow:"0 0 18px #36d1fecc" }}
            aria-label="Plans Created"
          >
            {plansCount}+
          </div>
          <div 
            className="text-canai-light opacity-80 font-manrope text-base"
            style={{ fontWeight: 200 }}
          >
            Plans Created
          </div>
        </div>
        
        {/* Success Uplift Stat */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-canai-primary/20 rounded-full mb-3 mx-auto drop-shadow-[0_0_8px_#36d1fe55] animate-glow-pop" style={{ animationDelay: "800ms" }}>
            <Award className="text-canai-primary" size={28} />
          </div>
          <div 
            className="text-4xl font-extrabold text-canai-primary font-manrope animate-countup-glow"
            style={{ fontWeight: 800, textShadow:"0 0 18px #36d1fecc" }}
            aria-label="Success Uplift"
          >
            98%
          </div>
          <div 
            className="text-canai-light opacity-80 font-manrope text-base mb-2"
            style={{ fontWeight: 200 }}
          >
            Success Uplift
          </div>
          <div className="w-28 h-3 rounded-full bg-canai-primary/15 border border-canai-primary/30 relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-canai-primary via-canai-cyan to-canai-light shadow-[0_0_15px_#36d1fe99]"
              style={{
                width: `${progress}%`,
                transition: 'width 0.3s cubic-bezier(.4,0,.2,1)'
              }}
              aria-label="Success rate progress"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;

