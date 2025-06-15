
import React from "react";
import { Save, CheckCircle, Loader2 } from "lucide-react";

interface AutoSaveIndicatorProps {
  isAutoSaving: boolean;
  lastSaved: Date | null;
}

const AutoSaveIndicator: React.FC<AutoSaveIndicatorProps> = ({ isAutoSaving, lastSaved }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isAutoSaving) {
    return (
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center gap-3 bg-canai-deep/60 border border-canai-primary/40 rounded-xl px-6 py-3 backdrop-blur-sm">
          <Loader2 className="w-5 h-5 text-canai-primary animate-spin" />
          <span className="text-canai-light text-sm font-medium">Saving your progress...</span>
        </div>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center justify-center mb-6">
        <div 
          id="save-confirm"
          className="flex items-center gap-3 bg-green-500/20 border border-green-400/50 rounded-xl px-6 py-3 backdrop-blur-sm"
        >
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400 text-sm font-medium">
            Saved at {formatTime(lastSaved)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center gap-3 bg-canai-deep/40 border border-canai-primary/30 rounded-xl px-6 py-3 backdrop-blur-sm">
        <Save className="w-5 h-5 text-canai-light-blue" />
        <span className="text-canai-light-blue text-sm font-medium">Auto-save every 10 seconds</span>
      </div>
    </div>
  );
};

export default AutoSaveIndicator;
