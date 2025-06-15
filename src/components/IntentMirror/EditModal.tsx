
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Props for modal control and field context
interface EditModalProps {
  show: boolean;
  field: string;
  onClose: () => void;
  onContinue: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ show, field, onClose, onContinue }) => (
  <Dialog open={show} onOpenChange={v => (v ? undefined : onClose())}>
    <DialogContent
      className={`
        !max-w-[370px] sm:!max-w-md mx-auto p-0
        !rounded-[22px] 
        !border-0
        !bg-transparent
        flex justify-center items-center
      `}
      style={{
        background: "transparent",
        boxShadow: "none",
      }}
    >
      {/* SOFT GLOW WRAPPER */}
      <div
        className="relative w-full px-2 pt-2 pb-0"
      >
        {/* Modal Backdrop Glow */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            boxShadow:
              "0 0 90px 18px #00F0FF44, 0 0 60px 10px #00CFFF66, 0 0 0 6px #36D1FE44 inset",
            borderRadius: "22px"
          }}
        />
        {/* Glass Panel */}
        <div
          className={`
            relative z-10 w-full bg-[rgba(20,36,64,0.97)]
            rounded-[22px] px-6 pt-7 pb-3 shadow-2xl
            backdrop-blur-[20px] border border-[#00cfff22]
            ring-1 ring-[#00cfff4c]
            transition-all duration-200
            before:absolute before:inset-0 before:rounded-[22px]
            before:bg-gradient-to-br before:from-[#111c2a77] before:via-[#111a26aa] before:to-[#00cfff11]
            before:blur-[3px] before:opacity-70 before:pointer-events-none
            before:z-0
            overflow-hidden
          `}
          style={{
            boxShadow:
              "0 0 48px 6px #00F0FF55, 0 2px 36px #12294a88, 0 0 0 1.5px #00cfff",
          }}
        >
          {/* Close button */}
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-1 text-canai-cyan hover:bg-[#00cfff18] rounded-lg transition-colors"
            style={{ lineHeight: 0 }}
          >
            <X className="w-5 h-5" />
          </button>
          <DialogHeader className="text-center mb-1 pt-0 pb-2 border-none">
            <DialogTitle
              className={`
                text-[1.7rem] font-extrabold font-manrope 
                bg-gradient-to-r from-[#cfefff] via-[#00cfff] to-[#54c1fe] text-transparent bg-clip-text
                animate-text-glow drop-shadow-xl
                tracking-tight
                mb-1
              `}
            >
              Edit Your Details
            </DialogTitle>
            <div className="w-16 h-1 mx-auto rounded bg-gradient-to-r from-canai-cyan to-canai-primary animate-countup-glow mb-2" />
          </DialogHeader>
          {/* Glowing Icon with glass morphic spot */}
          <div className="flex flex-col items-center">
            <div className="relative my-2 flex items-center justify-center">
              <div
                className="absolute inset-0 z-0 mx-auto my-auto rounded-full"
                style={{
                  width: "52px",
                  height: "52px",
                  boxShadow:
                    "0 0 31px 9px #00F0FF55, 0 0 30px 4px #00cfff55 inset",
                  background:
                    "radial-gradient(circle at 60% 40%, #00cfff66 50%, #172d46 99%)",
                  filter:
                    "blur(0.5px) saturate(1.3)",
                }}
              />
              <span
                className="relative w-13 h-13 flex items-center justify-center rounded-full bg-[#132033fa] border-2 border-canai-cyan shadow-[0_0_30px_#00cfff88] canai-glow-cube"
                style={{
                  width: 52,
                  height: 52,
                  boxShadow: "0 0 10px #00f0ffbb, 0 1px 10px #00cfff4c",
                }}
              >
                <Pencil className="w-7 h-7 text-canai-cyan drop-shadow-xl" />
              </span>
            </div>
            {/* Supporting text */}
            <div className="mt-6 text-[1.09rem] leading-normal font-medium text-canai-light text-center px-2 mb-2">
              You&apos;ll return to the detailed input form to update your{" "}
              <span className="font-bold text-canai-cyan underline underline-offset-2">
                {field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
              </span>{" "}
              information.
            </div>
          </div>
          {/* Progress Saved Notice */}
          <div className="flex items-center justify-center gap-2 bg-[#181F29]/85 border border-canai-primary/30 rounded-lg px-4 py-2 my-2 text-sm font-medium text-canai-light shadow-strong w-full">
            <svg width="18" height="18" viewBox="0 0 20 20" className="mr-1" fill="none">
              <rect x="4" y="4" width="12" height="12" rx="3.5" stroke="#00cfff" strokeWidth="2"/>
              <path d="M8.5 10.5l2 2 3-3" stroke="#00cfff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Your progress will be saved automatically
          </div>
          {/* Control buttons */}
          <div className="flex flex-col w-full gap-3 mt-5">
            <Button
              variant="canai"
              onClick={onContinue}
              className="w-full h-12 text-base font-bold canai-btn-glow canai-focus-glow drop-shadow-xl transition-all duration-200 rounded-[12px]"
              style={{
                background:
                  "linear-gradient(90deg, #172d46 80%, #00cfff22 100%)",
                border: "1.8px solid #36d1fe",
                color: "#E6F6FF",
                boxShadow: "0 0 32px #00f0ff30"
              }}
            >
              <Pencil className="w-5 h-5 mr-2" />
              Continue to Edit
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full h-12 rounded-[12px] font-semibold border-2 border-[#36d1fe88] text-canai-light transition-all duration-150 hover:bg-[#36d1fe29] hover:text-white hover:scale-[1.03] focus-visible:outline-none"
              style={{
                background: "rgba(25,60,101,0.7)",
                border: "1.7px solid #00cfff4a"
              }}
            >
              Cancel
            </Button>
          </div>
          {/* Timeliness note */}
          <div className="w-full flex justify-center pt-7 pb-2">
            <span className="flex items-center gap-2 text-[#b3e7fa] text-base bg-canai-primary/10 rounded-full px-4 py-1 border border-canai-primary/20 shadow-strong">
              <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                <circle cx="10" cy="10" r="8.5" stroke="#00cfff" strokeWidth="1.5" />
                <path d="M10 6.5v3.6l2.3 2.3" stroke="#00cfff" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Takes less than 30 seconds
            </span>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default EditModal;
