
import React from "react";

/**
 * Placeholder Memberstack login button.
 * Replace onClick/anchor with actual Memberstack trigger logic.
 * TODO: Integrate with Memberstack (or Webflow if embedding)
 */
const MemberstackLoginButton: React.FC = () => (
  <button
    id="memberstack-login"
    className="ms-login-btn fixed top-6 right-6 z-50 px-7 py-3 rounded-full bg-[#00CFFF] text-white font-semibold shadow-[0_0_18px_#00F0FF66] hover:bg-[#00F0FF] hover:shadow-[0_0_36px_8px_#00F0FFE6] transition-all duration-200 text-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canai-cyan"
    aria-label="Memberstack Login"
    style={{ fontFamily: "Inter, Manrope, sans-serif" }}
    // Placeholder: replace with actual Memberstack login trigger/anchor 
    onClick={() => {
      // Insert Memberstack login open call here, e.g. window.MemberStack.openModal('login')
      // For now, open placeholder modal:
      const modal = document.getElementById("login-modal");
      if (modal) modal.classList.remove("hidden");
    }}
  >
    Log In
  </button>
);

export default MemberstackLoginButton;
