import { useState, useEffect } from "react";
import { useMarketData } from "@/contexts/MarketDataContext";
import { AlertCircle, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DisconnectionBanner() {
  const { connectionStatus, reconnect } = useMarketData();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (connectionStatus === "connected") {
      setDismissed(false);
    }
  }, [connectionStatus]);

  if (connectionStatus === "connected" || dismissed) return null;

  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2.5 text-sm",
      connectionStatus === "error" 
        ? "bg-danger/15 border-b border-danger/25 text-danger"
        : "bg-warning/15 border-b border-warning/25 text-warning"
    )}>
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span className="flex-1">
        {connectionStatus === "reconnecting" 
          ? "Connection lost — reconnecting to market data..."
          : "Market data disconnected. Manual mode active."}
      </span>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={reconnect}
        className="h-6 px-2 text-xs gap-1"
      >
        <RefreshCw className="h-3 w-3" />
        Reconnect
      </Button>
      <button onClick={() => setDismissed(true)} className="ml-1 opacity-70 hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}