import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, WifiOff, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WorkspaceBuilder } from '@/components/workspace';
import { useMarketData } from '@/contexts/MarketDataContext';
import { ExecutionModeToggle } from '@/components/ExecutionModeToggle';
import { SessionTimer } from '@/components/session';
import { LiveSessionHeader } from '@/components/session';

export default function WorkspaceLive() {
  const navigate = useNavigate();
  const { connectionStatus, connect, disconnect } = useMarketData();
  const [sessionDuration, setSessionDuration] = useState(0);

  const handleSessionStart = () => {
    if (connectionStatus === 'disconnected') {
      connect();
    }
  };

  const handleSessionStop = (duration: number) => {
    setSessionDuration(duration);
    if (connectionStatus === 'connected') {
      disconnect();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Live Session Header */}
      <LiveSessionHeader 
        onBack={() => navigate(-1)}
        sessionDuration={sessionDuration}
      />

      {/* Main workspace area */}
      <div className="flex-1 overflow-hidden">
        <WorkspaceBuilder />
      </div>
    </div>
  );
}
