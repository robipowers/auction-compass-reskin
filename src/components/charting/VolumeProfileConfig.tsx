import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileType, ProfilePeriod } from "./VolumeProfile";

interface VolumeProfileConfigProps {
  profileType: ProfileType;
  period: ProfilePeriod;
  valueAreaPercent: number;
  showPreviousSession: boolean;
  displayMode: "histogram" | "heatmap";
  onProfileTypeChange: (type: ProfileType) => void;
  onPeriodChange: (period: ProfilePeriod) => void;
  onValueAreaChange: (percent: number) => void;
  onShowPreviousSessionChange: (show: boolean) => void;
  onDisplayModeChange: (mode: "histogram" | "heatmap") => void;
  onClose?: () => void;
  className?: string;
}

export function VolumeProfileConfig({
  profileType,
  period,
  valueAreaPercent,
  showPreviousSession,
  displayMode,
  onProfileTypeChange,
  onPeriodChange,
  onValueAreaChange,
  onShowPreviousSessionChange,
  onDisplayModeChange,
  onClose,
  className,
}: VolumeProfileConfigProps) {
  return (
    <Card className={cn("w-72", className)}>
      <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Volume Profile Settings
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Profile Type */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Profile Type</Label>
          <Select value={profileType} onValueChange={(v) => onProfileTypeChange(v as ProfileType)}>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tpo">TPO (Time Price Opportunity)</SelectItem>
              <SelectItem value="volume">Volume-by-Price</SelectItem>
              <SelectItem value="market">Market Profile</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Period */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Period</Label>
          <div className="flex gap-1">
            {(["session", "day", "week", "custom"] as ProfilePeriod[]).map((p) => (
              <Button
                key={p}
                variant={period === p ? "default" : "outline"}
                size="sm"
                className="flex-1 h-8 text-xs capitalize"
                onClick={() => onPeriodChange(p)}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>

        {/* Value Area % */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Value Area</Label>
            <span className="text-xs font-medium">{valueAreaPercent}%</span>
          </div>
          <Slider
            value={[valueAreaPercent]}
            onValueChange={([v]) => onValueAreaChange(v)}
            min={60}
            max={80}
            step={5}
            className="w-full"
          />
        </div>

        {/* Display Mode */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Display Mode</Label>
          <div className="flex gap-2">
            <Button
              variant={displayMode === "histogram" ? "default" : "outline"}
              size="sm"
              className="flex-1 h-8"
              onClick={() => onDisplayModeChange("histogram")}
            >
              Histogram
            </Button>
            <Button
              variant={displayMode === "heatmap" ? "default" : "outline"}
              size="sm"
              className="flex-1 h-8"
              onClick={() => onDisplayModeChange("heatmap")}
            >
              Heatmap
            </Button>
          </div>
        </div>

        {/* Previous Session Toggle */}
        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Previous Session</Label>
          <Switch
            checked={showPreviousSession}
            onCheckedChange={onShowPreviousSessionChange}
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Hook for managing Volume Profile state
export function useVolumeProfileConfig() {
  const [profileType, setProfileType] = useState<ProfileType>("tpo");
  const [period, setPeriod] = useState<ProfilePeriod>("session");
  const [valueAreaPercent, setValueAreaPercent] = useState(70);
  const [showPreviousSession, setShowPreviousSession] = useState(false);
  const [displayMode, setDisplayMode] = useState<"histogram" | "heatmap">("histogram");

  return {
    profileType,
    period,
    valueAreaPercent,
    showPreviousSession,
    displayMode,
    setProfileType,
    setPeriod,
    setValueAreaPercent,
    setShowPreviousSession,
    setDisplayMode,
  };
}
