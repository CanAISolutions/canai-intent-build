
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import CanAILogo from '@/components/CanAILogo';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 50% 45%, #163152 0%, #0a1424 68%, #07101c 100%)'
      }}
    >
      {/* Starfield Glow Layer (background dots for depth) */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="absolute inset-0 opacity-60" style={{ mixBlendMode: "screen" }}>
          <defs>
            <radialGradient id="bgstar" r="85%" cx="50%" cy="45%">
              <stop offset="0%" stopColor="#36d1fe" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#07101c" stopOpacity="0.00" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgstar)" />
          {/* random star dots for extra subtle depth */}
          <g>
            {Array.from({ length: 36 }).map((_, i) => (
              <circle
                key={i}
                cx={`${Math.random() * 100}%`}
                cy={`${Math.random() * 100}%`}
                r={Math.random() * 1.2 + 0.4}
                fill="#B4EFFF"
                opacity={Math.random() * 0.27 + 0.13}
              />
            ))}
          </g>
        </svg>
      </div>
      <div className="relative text-center space-y-8 max-w-2xl mx-auto px-4 z-10">
        <CanAILogo size="xl" />

        <div className="space-y-4">
          <h2 className="text-2xl text-canai-light font-light">
            Welcome to the Emotional Sovereignty Platform
          </h2>
          <p className="text-canai-light opacity-80 text-lg">
            Experience the future of AI-driven business strategy, designed with 
            emotional intelligence and empathy at its core.
          </p>
        </div>

        <Button onClick={() => navigate('/discovery-hook')} size="lg" className="canai-button-primary text-lg px-8 py-4 group">
          Enter CanAI Platform
          <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
        </Button>

        <div className="pt-8 text-sm text-canai-light opacity-60">
          {/* Placeholder for later footer */}
        </div>
      </div>
    </div>
  );
};

export default Index;
