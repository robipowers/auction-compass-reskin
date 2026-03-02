import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, Pause, Square, Clock, Wifi, WifiOff } from "lucide-react";
import { SessionTimer } from "./SessionTimer";

type SessionStatus = "idle" | "active" | "paused" | "ended";
type ConnectionStatus = "connected" | "connecting" | "disconnected";

interface LiveSessionHeaderProps {
  status: SessionStatus;
  connectionStatus: ConnectionStatus;
  planName?: string;
  instrument: string;
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onEnd?: () => void;
  className?: string;
}

export function LiveSessionHeader({
  status,
  connectionStatus,
  planName,
  instrument,
  onStart,
  onPause,
  onResume,
  onEnd,
  className,
}: LiveSessionHeaderProps) {
  const getStatusBadge = () => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
            <span className="mr-1.5 h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Live
          </Badge>
        );
      case "paused":
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
            <Pause className="mr-1.5 h-3 w-3" />
            Paused
          </Badge>
        );
      case "ended":
        return (
          <Badge className="bg-muted text-muted-foreground">
            <Square className="mr-1.5 h-3 w-3" />
            Ended
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Ready
          </Badge>
        );
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case "connected":
        return <Wifi className="h-4 w-4 text-green-400" />;
      case "connecting":
        return <Wifi className="h-4 w-4 text-amber-400 animate-pulse" />;
      default:
        return <WifiOff className="h-4 w-4 text-red-400" />;
    }
  };

  return (
    <div className={cn("flex items-center justify-between p-4 bg-card border-b border-border", className)}>
      {/* Left side: Status and info */}
      <div className="flex items-center gap-4">
        {getStatusBadge()}
        
        <div className="flex items-center gap-2 text-sm">
          {getConnectionIcon()}
          <span className="font-mono font-medium">{instrument}</span>
        </div>

        {planName && (
          <span className="text-sm text-muted-foreground">
            {planName}
          </span>
        )}
      </div>

      {/* Center: Timer */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <SessionTimer
          isActive={status === "active"}
          onPause={onPause}
          onResume={onResume}
        />
      </div>

      {/* Right side: Controls */}
      <div className="flex items-center gap-2">
        {status === "idle" && (
          <Button onClick={onStart} className="gap-2">
            <Play className="h-4 w-4" />
            Start Session
          </Button>
        )}

        {status === "active" && (
          <>
            <Button variant="outline" onClick={onPause} className="gap-2">
              <Pause className="h-4 w-4" />
              Pause
            </Button>
            <Button variant="destructive" onClick={onEnd} className="gap-2">
              <Square className="h-4 w-4" />
              End
            </Button>
          </>
        )}

        {status === "paused" && (
          <>
            <Button onClick={onResume} className="gap-2">
              <Play className="h-4 w-4" />
              Resume
            </Button>
            <Button variant="destructive" onClick={onEnd} className="gap-2">
              <Square className="h-4 w-4" />
              End
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
