import { useState } from "react";
import { useAlerts } from "@/hooks/use-alerts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertFormModal } from "@/components/alerts/AlertFormModal";
import { Bell, BellOff, Plus, Trash2, TrendingUp, TrendingDown, Activity, Clock } from "lucide-react";

export default function Alerts() {
  const { alerts, deleteAlert, toggleAlert } = useAlerts();
  const [showModal, setShowModal] = useState(false);
  const [editAlert, setEditAlert] = useState<string | null>(null);

  const activeAlerts = alerts.filter((a) => a.enabled);
  const inactiveAlerts = alerts.filter((a) => !a.enabled);
  const triggeredAlerts = alerts.filter((a) => a.triggered);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "price_above": case "price_below": return <TrendingUp className="h-4 w-4" />;
      case "volume_spike": return <Activity className="h-4 w-4" />;
      case "time": return <Clock className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const getConditionLabel = (type: string, value: number) => {
    switch (type) {
      case "price_above": return `Price > ${value.toLocaleString()}`;
      case "price_below": return `Price < ${value.toLocaleString()}`;
      case "volume_spike": return `Volume spike ${value}x avg`;
      case "time": return `Time: ${value}`;
      default: return `${type}: ${value}`;
    }
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts</h1>
          <p className="text-muted-foreground mt-1">{activeAlerts.length} active · {triggeredAlerts.length} triggered today</p>
        </div>
        <Button onClick={() => setShowModal(true)}><Plus className="mr-2 h-4 w-4" />New Alert</Button>
      </div>
      <Tabs defaultValue="active">
        <TabsList className="mb-6">
          <TabsTrigger value="active">Active{activeAlerts.length > 0 && <Badge variant="secondary" className="ml-2">{activeAlerts.length}</Badge>}</TabsTrigger>
          <TabsTrigger value="all">All Alerts</TabsTrigger>
          <TabsTrigger value="triggered">Triggered</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          {activeAlerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-20" /><p>No active alerts</p>
              <Button variant="link" onClick={() => setShowModal(true)}>Create your first alert</Button>
            </div>
          ) : (
            <div className="space-y-3">
              {activeAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">{getTypeIcon(alert.type)}</div>
                    <div>
                      <div className="font-medium text-sm">{alert.name}</div>
                      <div className="text-xs text-muted-foreground">{getConditionLabel(alert.type, alert.value)}{alert.symbol && ` · ${alert.symbol}`}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.triggered && <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">Triggered</Badge>}
                    <Button variant="ghost" size="icon" onClick={() => toggleAlert(alert.id)}><BellOff className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="all">
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground"><Bell className="h-12 w-12 mx-auto mb-4 opacity-20" /><p>No alerts configured</p></div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${alert.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>{getTypeIcon(alert.type)}</div>
                    <div>
                      <div className={`font-medium text-sm ${!alert.enabled && "text-muted-foreground"}`}>{alert.name}</div>
                      <div className="text-xs text-muted-foreground">{getConditionLabel(alert.type, alert.value)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.enabled ? "default" : "secondary"}>{alert.enabled ? "Active" : "Inactive"}</Badge>
                    <Button variant="ghost" size="icon" onClick={() => toggleAlert(alert.id)}>{alert.enabled ? <BellOff className="h-4 w-4" /> : <Bell className="h-4 w-4" />}</Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="triggered">
          {triggeredAlerts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground"><Bell className="h-12 w-12 mx-auto mb-4 opacity-20" /><p>No alerts triggered today</p></div>
          ) : (
            <div className="space-y-3">
              {triggeredAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 rounded-lg border border-amber-500/30 bg-amber-500/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-amber-500/10 text-amber-400">{getTypeIcon(alert.type)}</div>
                    <div>
                      <div className="font-medium text-sm">{alert.name}</div>
                      <div className="text-xs text-muted-foreground">Triggered · {getConditionLabel(alert.type, alert.value)}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <AlertFormModal open={showModal} onClose={() => { setShowModal(false); setEditAlert(null); }} />
    </div>
  );
}
