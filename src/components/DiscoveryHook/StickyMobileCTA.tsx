
import React from "react";

type StickyMobileCTAProps = {
  onClick: () => void;
};
const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({ onClick }) => (
  <div
    className="fixed bottom-0 left-0 w-full z-40 block sm:hidden px-3 pb-[env(safe-area-inset-bottom,16px)]"
    aria-label="Sticky Spark for Free Button"
    style={{
      pointerEvents: "none",
    }}
  >
    <button
      className={`
        w-full py-5 rounded-[16px] font-manrope font-extrabold text-lg
        bg-gradient-to-tr from-[#36d1fe] via-[#16B9EC] to-[#00B2E3] text-white
        shadow-[0_2px_28px_0_#00f0ff77,0_0_8px_#00B2E366]
        ring-2 ring-canai-cyan ring-offset-2 drop-shadow-lg
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canai-cyan focus-visible:ring-offset-2
        hover:scale-105 active:scale-98
        canai-btn-glow
      `}
      style={{
        letterSpacing: ".01em",
        pointerEvents: "auto",
      }}
      onClick={onClick}
      aria-label="Spark for Free (always visible action)"
      tabIndex={0}
    >
      Spark for Free
    </button>
  </div>
);

export default StickyMobileCTA;

