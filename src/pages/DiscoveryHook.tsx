
import React from "react";

// Use the logo and tagline styles as in your branding asset
const DiscoveryHook = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{
        background: "radial-gradient(ellipse at 50% 38%, #143657 0%, #071727 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Brand logo, matching exact composition and colors */}
      <div className="flex flex-col items-center space-y-8 animate-fadeInLogo">
        <h1
          className="text-center leading-none font-bold"
          style={{
            fontFamily: "Manrope, 'Inter', Helvetica Neue, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(2.5rem, 8vw, 5.5rem)",
            letterSpacing: "0.04em",
            lineHeight: 1.06,
            color: "#fff",
            textShadow: "0 10px 48px #0f90b880",
            marginBottom: 0,
          }}
        >
          <span style={{ color: "#fff" }}>CanAI</span>
          <span
            style={{
              background: "linear-gradient(90deg, #36d1fe 0%, #07c3fb 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textFillColor: "transparent",
              marginLeft: ".1em",
            }}
          >
            .so
          </span>
        </h1>
        <p
          className="uppercase tracking-widest"
          style={{
            color: "rgba(226,246,255,0.91)",
            fontFamily: "Manrope, 'Inter', Helvetica Neue, sans-serif",
            fontWeight: 200,
            fontSize: "clamp(1rem, 2vw, 1.45rem)",
            letterSpacing: "0.18em",
            marginTop: "-10px"
          }}
        >
          EMPOWERMENT THROUGH EASE
        </p>
      </div>

      {/* Optional: Subtle cosmic dots for extra polish */}
      <div aria-hidden className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" className="absolute inset-0 opacity-50" style={{ mixBlendMode: "screen" }}>
          <defs>
            <radialGradient id="star" r="60%" cx="50%" cy="40%">
              <stop offset="0%" stopColor="#36d1fe" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#071727" stopOpacity="0.00" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#star)" />
          {/* Sprinkle some white dots (stars) */}
          <g>
            {Array.from({ length: 36 }).map((_, i) => (
              <circle
                key={i}
                cx={`${Math.random() * 100}%`}
                cy={`${Math.random() * 100}%`}
                r={Math.random() * 1.22 + 0.35}
                fill="#B4EFFF"
                opacity={Math.random() * 0.26 + 0.13}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Animate fade-in for brand impact */}
      <style>
        {`
          @keyframes fadeInLogo {
            from { opacity: 0; transform: translateY(32px);}
            to   { opacity: 1; transform: none;}
          }
          .animate-fadeInLogo {
            animation: fadeInLogo .75s cubic-bezier(.22,1,.36,1);
          }
        `}
      </style>
    </div>
  );
};

export default DiscoveryHook;
