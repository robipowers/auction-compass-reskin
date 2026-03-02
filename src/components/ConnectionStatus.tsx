import { useMarketData, ConnectionStatus as Status } from "@/contexts/MarketDataContext";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, Clock, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const statusConfig: Record<Status, { 
  icon: typeof Wifi; 
  label: string; 
  bgClass: string; 
  textClass: string;
  dotClass: string;
}> = {
  connected: {
    icon: Wifi,
    label: "Live",
    bgClass: "bg-green-900/50",
    textClass: "text-green-400",
    dotClass: "bg-green-400",
  },
  connecting: {
    icon: Loader2,
    label: "Connecting...",
    bgClass: "bg-yellow-900/50",
    textClass: "text-yellow-400",
    dotClass: "bg-yellow-400",
  },
  disconnected: {
    icon: WifiOff,
    label: "Disconnected",
    bgClass: "bg-red-900/50",
    textClass: "text-red-400",
    dotClass: "bg-red-400",
  },
  "pre-market": {
    icon: Clock,
    label: "Pre-Market",
    bgClass: "bg-blue-900/50",
    textClass: "text-blue-400",
    dotClass: "bg-blue-400",
  },
};

export function ConnectionStatus() {
  const { connectionStatus, latency, connect, disconnect } = useMarketData();
  const config = statusConfig[connectionStatus];
  const Icon = config.icon;

  const handleClick = () => {
    if (connectionStatus === "disconnected") {
      connect();
    } else if (connectionStatus === "connected") {
      disconnect();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleClick}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md transition-all duration-200",
            "hover:opacity-80 cursor-pointer",
            config.bgClass
          )}
        >
          <div className={cn(
            "w-2 h-2 rounded-full",
            config.dotClass,
            connectionStatus === "connecting" && "animate-pulse"
          )} />
          <Icon className={cn(
            "h-3.5 w-3.5",
            config.textClass,
            connectionStatus === "connecting" && "animate-spin"
          )} />
          <span className={cn("text-xs font-medium", config.textClass)}>
            {config.label}
          </span>
          {latency !== null && connectionStatus === "connected" && (
            <span className="text-[10px] text-muted-foreground ml-1">
              {latency}ms
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">
          {connectionStatus === "connected" && "Click to disconnect"}
          {connectionStatus === "disconnected" && "Click to connect"}
          {connectionStatus === "connecting" && "Establishing connection..."}
          {connectionStatus === "pre-market" && "Market opens at 9:30 AM ET"}
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
