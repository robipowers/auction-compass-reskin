import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Alert, AlertHistory, AlertSettings } from '@/types/alerts';

interface TriggeredAlert {
  id: string;
  alert: Alert;
  triggerPrice: number;
  triggeredAt: Date;
  coachingInsight?: string;
  dismissed: boolean;
}

interface AlertContextType {
  // Triggered alerts queue (for toasts)
  triggeredAlerts: TriggeredAlert[];
  addTriggeredAlert: (alert: Alert, triggerPrice: number, insight?: string) => void;
  dismissTriggeredAlert: (id: string) => void;
  clearTriggeredAlerts: () => void;
  
  // Alert settings
  settings: AlertSettings | null;
  updateSettings: (settings: Partial<AlertSettings>) => void;
  
  // Quick actions
  isCreatingAlert: boolean;
  setIsCreatingAlert: (value: boolean) => void;
  editingAlert: Alert | null;
  setEditingAlert: (alert: Alert | null) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export function AlertProvider({ children }: { children: ReactNode }) {
  const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);
  const [settings, setSettings] = useState<AlertSettings | null>({
    user_id: 'local',
    sounds_enabled: true,
    browser_notifications_enabled: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [isCreatingAlert, setIsCreatingAlert] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);

  const addTriggeredAlert = useCallback((alert: Alert, triggerPrice: number, insight?: string) => {
    const triggered: TriggeredAlert = {
      id: `trigger-${Date.now()}`,
      alert,
      triggerPrice,
      triggeredAt: new Date(),
      coachingInsight: insight,
      dismissed: false,
    };
    setTriggeredAlerts(prev => [triggered, ...prev]);
  }, []);

  const dismissTriggeredAlert = useCallback((id: string) => {
    setTriggeredAlerts(prev => 
      prev.map(t => t.id === id ? { ...t, dismissed: true } : t)
    );
    // Remove after animation
    setTimeout(() => {
      setTriggeredAlerts(prev => prev.filter(t => t.id !== id));
    }, 300);
  }, []);

  const clearTriggeredAlerts = useCallback(() => {
    setTriggeredAlerts([]);
  }, []);

  const updateSettings = useCallback((updates: Partial<AlertSettings>) => {
    setSettings(prev => prev ? { ...prev, ...updates, updated_at: new Date().toISOString() } : null);
  }, []);

  return (
    <AlertContext.Provider value={{
      triggeredAlerts,
      addTriggeredAlert,
      dismissTriggeredAlert,
      clearTriggeredAlerts,
      settings,
      updateSettings,
      isCreatingAlert,
      setIsCreatingAlert,
      editingAlert,
      setEditingAlert,
    }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlertContext must be used within AlertProvider');
  }
  return context;
}
