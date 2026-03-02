import { useState } from "react";
import { useMarketData } from "@/contexts/MarketDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle, Loader2, Database, Bell, Wifi } from "lucide-react";

export default function Settings() {
  const { settings, updateSettings, testConnection, connectionStatus, connect, disconnect } = useMarketData();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const [apiKey, setApiKey] = useState(settings.apiKey || "");

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testConnection();
    setTestResult(result);
    setTesting(false);
  };

  const handleSave = () => { updateSettings({ apiKey }); };

  const symbols = [
    { value: "NQ", label: "NQ - E-mini Nasdaq 100" },
    { value: "ES", label: "ES - E-mini S&P 500" },
    { value: "YM", label: "YM - E-mini Dow" },
    { value: "RTY", label: "RTY - E-mini Russell 2000" },
  ];

  const providers = [
    { value: "mock", label: "Mock Data (Development)" },
    { value: "tradingview", label: "TradingView" },
    { value: "ib", label: "Interactive Brokers" },
    { value: "custom", label: "Custom API" },
  ];

  return (
    <div className="container py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Configure your market data connection and preferences</p>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"><Database className="h-5 w-5 text-primary" /></div>
              <div><CardTitle>Market Data Connection</CardTitle><CardDescription>Configure your real-time data source</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="provider">Data Provider</Label>
              <Select value={settings.provider} onValueChange={(value) => updateSettings({ provider: value as any })}>
                <SelectTrigger id="provider"><SelectValue placeholder="Select provider" /></SelectTrigger>
                <SelectContent>{providers.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            {settings.provider !== "mock" && (
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input id="apiKey" type="password" placeholder="Enter your API key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                <p className="text-xs text-muted-foreground">Your API key is encrypted and stored locally</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="symbol">Primary Instrument</Label>
              <Select value={settings.primarySymbol} onValueChange={(value) => updateSettings({ primarySymbol: value })}>
                <SelectTrigger id="symbol"><SelectValue placeholder="Select instrument" /></SelectTrigger>
                <SelectContent>{symbols.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Update Frequency</Label>
              <Select value={String(settings.updateFrequency)} onValueChange={(value) => updateSettings({ updateFrequency: parseInt(value) })}>
                <SelectTrigger id="frequency"><SelectValue placeholder="Select frequency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="500">500ms (Fastest)</SelectItem>
                  <SelectItem value="1000">1 second</SelectItem>
                  <SelectItem value="2000">2 seconds</SelectItem>
                  <SelectItem value="5000">5 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
                {testing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Testing...</> : "Test Connection"}
              </Button>
              {testResult !== null && (
                <div className={`flex items-center gap-2 ${testResult ? "text-green-500" : "text-red-500"}`}>
                  {testResult ? <><CheckCircle2 className="h-4 w-4" /><span className="text-sm">Connection successful</span></> : <><XCircle className="h-4 w-4" /><span className="text-sm">Connection failed</span></>}
                </div>
              )}
              {connectionStatus === "connected" && <Button variant="destructive" size="sm" onClick={disconnect}>Disconnect</Button>}
              {connectionStatus === "disconnected" && <Button size="sm" onClick={connect}>Connect</Button>}
            </div>
            {settings.provider !== "mock" && <Button onClick={handleSave} className="w-full">Save API Settings</Button>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10"><Bell className="h-5 w-5 text-amber-500" /></div>
              <div><CardTitle>Notifications</CardTitle><CardDescription>Configure alert and notification preferences</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Price Alerts</Label><p className="text-xs text-muted-foreground">Notify when price levels are reached</p></div><Switch defaultChecked /></div>
            <Separator />
            <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Session Start/End</Label><p className="text-xs text-muted-foreground">Notify at market open and close</p></div><Switch defaultChecked /></div>
            <Separator />
            <div className="flex items-center justify-between"><div className="space-y-0.5"><Label>Scenario Triggers</Label><p className="text-xs text-muted-foreground">Notify when planned scenarios activate</p></div><Switch defaultChecked /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10"><Wifi className="h-5 w-5 text-green-500" /></div>
              <div><CardTitle>Connection Status</CardTitle><CardDescription>Current data feed status</CardDescription></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${connectionStatus === "connected" ? "bg-green-500 animate-pulse" : connectionStatus === "connecting" ? "bg-amber-500 animate-pulse" : "bg-red-500"}`} />
              <span className="text-sm capitalize">{connectionStatus}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
