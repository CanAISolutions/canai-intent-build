
import React from "react";
import { Button } from "@/components/ui/button";

type DangerZoneProps = {
  showPurge: boolean;
  setShowPurge: (v: boolean) => void;
  handlePurge: () => Promise<void>;
};

export const DangerZone: React.FC<DangerZoneProps> = ({
  showPurge,
  setShowPurge,
  handlePurge,
}) => (
  <>
    <div className="flex justify-end">
      <Button variant="ghost" size="sm" onClick={() => setShowPurge(!showPurge)}>
        {showPurge ? "Hide Purge" : "Purge my data"}
      </Button>
    </div>
    {showPurge && (
      <div className="p-3 rounded bg-[#ffcbcb22] border border-red-200 text-red-700 flex items-center gap-2 mt-1 mb-1">
        <span className="font-medium">Danger:</span>
        <Button variant="destructive" size="sm" onClick={handlePurge}>
          Confirm Data Purge
        </Button>
      </div>
    )}
  </>
);
