import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Connection status types
export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "pre-market";

// Market data types
export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number[];
  lastUpdate: Date;
}

export interface MarketDataSettings {
  provider: "tradingview" | "ib" | "custom" | "mock";
  apiKey?: string;
  primarySymbol: string;
  updateFrequency: number; // milliseconds
}

interface MarketDataContextType {
  // Connection state
  connectionStatus: ConnectionStatus;
  latency: number | null;
  
  // Market data
  marketData: MarketData | null;
  
  // Settings
  settings: MarketDataSettings;
  updateSettings: (settings: Partial<MarketDataSettings>) => void;
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  testConnection: () => Promise<boolean>;
  
  // Market hours
  isMarketOpen: boolean;
}

const MarketDataContext = createContext<MarketDataContextType | undefined>(undefined);

const SETTINGS_STORAGE_KEY = "market-data-settings";

const DEFAULT_SETTINGS: MarketDataSettings = {
  provider: "mock",
  primarySymbol: "NQ",
  updateFrequency: 1000,
};

// Helper to check if market is open (9:30 AM - 4:00 PM ET)
function checkMarketHours(): boolean {
  const now = new Date();
  const etOffset = -5;
  const utcHour = now.getUTCHours();
  const etHour = (utcHour + etOffset + 24) % 24;
  const minutes = now.getUTCMinutes();
  
  const marketOpenMinutes = 9 * 60 + 30;
  const marketCloseMinutes = 16 * 60;
  const currentMinutes = etHour * 60 + minutes;
  
  const isWeekday = now.getUTCDay() >= 1 && now.getUTCDay() <= 5;
  
  return isWeekday && currentMinutes >= marketOpenMinutes && currentMinutes < marketCloseMinutes;
}

function generateMockPrice(basePrice: number): number {
  const change = (Math.random() - 0.5) * 2;
  return Math.round((basePrice + change) * 100) / 100;
}

function generateMockVolume(): number[] {
  return Array.from({ length: 8 }, () => Math.floor(Math.random() * 100) + 20);
}

export function MarketDataProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<MarketDataSettings>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        try {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
        } catch {
          return DEFAULT_SETTINGS;
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("disconnected");
  const [latency, setLatency] = useState<number | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isMarketOpen, setIsMarketOpen] = useState(checkMarketHours);

  const basePrices: Record<string, number> = {
    NQ: 18450,
    ES: 5245,
    YM: 38900,
    RTY: 2050,
  };

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      setIsMarketOpen(checkMarketHours());
    }, 60000);
    return () => clearInterval(checkInterval);
  }, []);

  useEffect(() => {
    if (connectionStatus !== "connected") return;

    const basePrice = basePrices[settings.primarySymbol] || 18450;
    let currentPrice = basePrice;
    const openPrice = basePrice;

    const interval = setInterval(() => {
      currentPrice = generateMockPrice(currentPrice);
      const change = currentPrice - openPrice;
      const changePercent = (change / openPrice) * 100;

      setMarketData({
        symbol: settings.primarySymbol,
        price: currentPrice,
        change: Math.round(change * 100) / 100,
        changePercent: Math.round(changePercent * 10000) / 10000,
        volume: generateMockVolume(),
        lastUpdate: new Date(),
      });

      setLatency(Math.floor(Math.random() * 20) + 5);
    }, settings.updateFrequency);

    return () => clearInterval(interval);
  }, [connectionStatus, settings.primarySymbol, settings.updateFrequency]);

  const connect = useCallback(() => {
    setConnectionStatus("connecting");
    setTimeout(() => {
      setConnectionStatus("connected");
      setLatency(12);
    }, 1500);
  }, []);

  const disconnect = useCallback(() => {
    setConnectionStatus("disconnected");
    setLatency(null);
    setMarketData(null);
  }, []);

  const testConnection = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 2000);
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<MarketDataSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return (
    <MarketDataContext.Provider
      value={{
        connectionStatus,
        latency,
        marketData,
        settings,
        updateSettings,
        connect,
        disconnect,
        testConnection,
        isMarketOpen,
      }}
    >
      {children}
    </MarketDataContext.Provider>
  );
}

export function useMarketData() {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error("useMarketData must be used within a MarketDataProvider");
  }
  return context;
}
