
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
      // ensures ancestors with overflows don't cut it off
    }}
  >
    <button
      className="w-full py-5 rounded-[16px] font-manrope font-extrabold text-lg bg-gradient-to-tr from-[#36d1fe] via-[#16B9EC] to-[#00B2E3] text-white shadow-[0_4px_40px_0_#00f0ff99,0_0_10px_#00B2E366] ring-2 ring-canai-cyan ring-offset-2 drop-shadow-lg transition-all duration-300 focus-visible:outline-none hover:scale-105 animate-pulse"
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
