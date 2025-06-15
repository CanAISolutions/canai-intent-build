
import React from "react";
import { Button } from "@/components/ui/button";

export const ShareButton = ({
  icon,
  label,
  id,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  id: string;
  onClick: () => void;
}) => (
  <Button
    variant="canai"
    className="px-3 py-2 flex items-center gap-2"
    id={id}
    type="button"
    onClick={onClick}
    aria-label={label}
  >
    {icon} <span>{label}</span>
  </Button>
);
