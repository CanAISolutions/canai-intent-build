
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Edit2, Clock } from "lucide-react";
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
        max-w-md mx-auto !shadow-[0_0_36px_0_#00cfffac,0_3px_32px_#12294ab0]
        !bg-gradient-to-br !from-[#17223aef] !via-[#0A1535e9] !to-[#101929f0]
        !border-2.5 !border-canai-primary !rounded-2xl
        !p-0
      `}
      style={{
        boxShadow: '0 0 36px 0 #00cfffac, 0 3px 32px #12294ab0',
        border: '2.5px solid #00cfff'
      }}
    >
      <DialogHeader className="text-center p-6 pb-0 border-none">
        <DialogTitle
          className={`text-3xl font-extrabold font-manrope animate-text-glow 
            bg-gradient-to-r from-[#cfefff] via-[#00cfff] to-[#54c1fe] text-transparent bg-clip-text
            mb-4 px-2
          `}
        >
          Edit Your Details
        </DialogTitle>
        <div className="w-20 h-1 mx-auto rounded bg-gradient-to-r from-canai-cyan to-canai-primary animate-countup-glow mb-4"></div>
      </DialogHeader>
      <div className="flex flex-col items-center justify-center py-2 px-8">
        <div
          className={`
            w-20 h-20 rounded-full bg-[rgba(0,240,255,0.09)] mb-2 flex items-center justify-center
            border-2 border-canai-cyan shadow-[0_0_32px_0_#00cfff77] ring-canai-primary
          `}
          style={{
            boxShadow: "0 0 44px 0 #00cfff99, 0 2px 16px #00f0ff55",
            border: "2.5px solid #00d2ff"
          }}
        >
          <Edit2 className="w-9 h-9 text-canai-cyan canai-glow-cube" />
        </div>
        <div className="my-4 space-y-3 text-center">
          <p className="text-canai-light text-lg font-medium leading-normal">
            You'll return to the detailed input form to update your{" "}
            <span className="font-extrabold canai-gradient-text animate-glow-pop">
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
            </span>{" "}
            information.
          </p>
          <div className="flex items-center justify-center gap-2 bg-[#142643]/70 border border-canai-primary/30 rounded-lg px-4 py-2 mt-3 shadow-strong text-sm font-medium text-canai-light">
            <Shield className="w-4 h-4 text-canai-primary" />
            <span>Your progress will be saved automatically</span>
          </div>
        </div>
        <div className="flex flex-col w-full gap-3 mt-5">
          <Button
            variant="canai"
            onClick={onContinue}
            className="w-full h-14 text-lg font-bold canai-btn-glow canai-focus-glow drop-shadow-xl"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Continue to Edit
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full h-14 bg-glass-modal border-2 border-canai-primary/60 text-canai-light font-semibold rounded-lg transition-all duration-300 hover:bg-canai-primary/15 hover:border-canai-primary/80"
          >
            Cancel
          </Button>
        </div>
        <div className="w-full flex justify-center pt-7 pb-2">
          <span className="flex items-center gap-2 text-[#b3e7fa] text-base bg-canai-primary/10 rounded-full px-4 py-1 border border-canai-primary/20 shadow-strong">
            <Clock className="w-4 h-4 text-canai-cyan mr-1" />
            Takes less than 30 seconds
          </span>
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default EditModal;
