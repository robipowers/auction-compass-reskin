import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Bell, Volume2, Monitor, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NotificationSettingsProps {
  className?: string;
}

interface Settings {
  soundEnabled: boolean;
  soundVolume: number;
  browserNotifications: boolean;
  showCoachingInsights: boolean;
  persistUntilAcknowledged: boolean;
}

export function NotificationSettings({ className }: NotificationSettingsProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    soundEnabled: true,
    soundVolume: 70,
    browserNotifications: false,
    showCoachingInsights: true,
    persistUntilAcknowledged: true,
  });
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>(
    typeof Notification !== "undefined" ? Notification.permission : "default"
  );

  const requestNotificationPermission = async () => {
    if (typeof Notification === "undefined") {
      toast({ title: "Not Supported", description: "Browser notifications are not supported.", variant: "destructive" });
      return;
    }
    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
    if (permission === "granted") {
      setSettings((s) => ({ ...s, browserNotifications: true }));
      toast({ title: "Enabled", description: "Browser notifications are now enabled." });
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }));
  };

  return (
    <Card className={cn("bg-card", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notification Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sound Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Label htmlFor="sound-enabled" className="font-medium">Sound Alerts</Label>
            </div>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSetting("soundEnabled", checked)}
            />
          </div>
          {settings.soundEnabled && (
            <div className="pl-6 space-y-2">
              <Label className="text-sm text-muted-foreground">Volume</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[settings.soundVolume]}
                  onValueChange={([v]) => updateSetting("soundVolume", v)}
                  max={100}
                  step={5}
                  className="flex-1"
                />
                <span className="text-sm w-10 text-right">{settings.soundVolume}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Browser Notifications */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-muted-foreground" />
              <Label className="font-medium">Browser Notifications</Label>
            </div>
            {permissionStatus === "granted" ? (
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Enabled
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={requestNotificationPermission}>
                Enable
              </Button>
            )}
          </div>
        </div>

        {/* Alert Behavior */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h4 className="font-medium">Alert Behavior</h4>
          <div className="flex items-center justify-between">
            <Label htmlFor="coaching">Show coaching insights</Label>
            <Switch
              id="coaching"
              checked={settings.showCoachingInsights}
              onCheckedChange={(checked) => updateSetting("showCoachingInsights", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="persist">Persist until acknowledged</Label>
            <Switch
              id="persist"
              checked={settings.persistUntilAcknowledged}
              onCheckedChange={(checked) => updateSetting("persistUntilAcknowledged", checked)}
            />
          </div>
        </div>

        <Button className="w-full">Save Settings</Button>
      </CardContent>
    </Card>
  );
}
