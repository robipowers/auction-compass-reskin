import { useMarketData, ConnectionStatus as StatusType } from "@/contexts/MarketDataContext";
import { cn } from "@/lib/utils";
import { Wifi, WifiOff, AlertCircle, Clock } from "lucide-react";

const statusConfig: Record<StatusType, {
  icon: React.ElementType;
  label: string;
  className: string;
  dotColor: string;
}> = {
  connected: {
    icon: Wifi,
    label: "Live",
    className: "text-success",
    dotColor: "bg-success",
  },
  disconnected: {
    icon: WifiOff,
    label: "Disconnected",
    className: "text-muted-foreground",
    dotColor: "bg-muted-foreground",
  },
  reconnecting: {
    icon: Clock,
    label: "Reconnecting",
    className: "text-warning",
    dotColor: "bg-warning",
  },
  error: {
    icon: AlertCircle,
    label: "Error",
    className: "text-danger",
    dotColor: "bg-danger",
  },
};

export function ConnectionStatus({ compact = false }: { compact?: boolean }) {
  const { connectionStatus } = useMarketData();
  const config = statusConfig[connectionStatus];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-center gap-1.5", config.className)}>
      <div className="relative flex h-2 w-2">
        <span className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          config.dotColor
        )} />
        <span className={cn("relative inline-flex rounded-full h-2 w-2", config.dotColor)} />
      </div>
      {!compact && (
        <>
          <Icon className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{config.label}</span>
        </>
      )}
    </div>
  );
}