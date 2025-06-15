
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
        <div className="flex items-center gap-2 bg-canai-blue-card/50 border border-canai-primary/30 rounded-lg px-4 py-2">
          <Loader2 className="w-4 h-4 text-canai-cyan animate-spin" />
          <span className="text-canai-light text-sm">Saving...</span>
        </div>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center justify-center mb-6">
        <div 
          id="save-confirm"
          className="flex items-center gap-2 bg-green-500/20 border border-green-400/50 rounded-lg px-4 py-2"
        >
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span className="text-green-400 text-sm">
            Saved at {formatTime(lastSaved)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center gap-2 bg-canai-blue-card/30 border border-canai-primary/20 rounded-lg px-4 py-2">
        <Save className="w-4 h-4 text-canai-light-blue" />
        <span className="text-canai-light-blue text-sm">Auto-save every 10s</span>
      </div>
    </div>
  );
};

export default AutoSaveIndicator;
