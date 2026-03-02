import { useState, useEffect } from "react";
import { WifiOff, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisconnectionBannerProps {
  isConnected: boolean;
  className?: string;
}

export const DisconnectionBanner: React.FC<DisconnectionBannerProps> = ({ isConnected, className }) => {
  const [dismissed, setDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      setDismissed(false);
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [isConnected]);

  if (isConnected || dismissed || !showBanner) return null;

  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-2 bg-destructive/10 border-b border-destructive/20 text-destructive text-sm",
      className
    )}>
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4" />
        <span>Connection lost. Attempting to reconnect...</span>
      </div>
      <button onClick={() => setDismissed(true)} className="hover:opacity-70">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
