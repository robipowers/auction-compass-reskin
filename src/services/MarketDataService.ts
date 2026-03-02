// Market Data Service
// WebSocket-ready architecture with mock data for development

export type ConnectionStatus = 'disconnected' | 'connecting' | 'live' | 'pre-market' | 'reconnecting';

export interface PriceUpdate {
  instrument: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
  bid: number;
  ask: number;
}

export interface MarketDataConfig {
  instruments: string[];
  updateIntervalMs: number;
  enableMockData: boolean;
}

// Mock prices for development
const MOCK_BASE_PRICES: Record<string, number> = {
  NQ: 18450,
  ES: 5425,
  YM: 39250,
  RTY: 2050,
};

export class MarketDataService {
  private config: MarketDataConfig;
  private status: ConnectionStatus = 'disconnected';
  private latencyMs: number = 0;
  private intervalId: NodeJS.Timeout | null = null;
  private prices: Map<string, PriceUpdate> = new Map();
  
  private statusListeners: ((status: ConnectionStatus, latency: number) => void)[] = [];
  private priceListeners: ((update: PriceUpdate) => void)[] = [];

  constructor(config: MarketDataConfig) {
    this.config = config;
    this.initializePrices();
  }

  private initializePrices(): void {
    this.config.instruments.forEach(instrument => {
      const basePrice = MOCK_BASE_PRICES[instrument] || 1000;
      this.prices.set(instrument, {
        instrument,
        price: basePrice,
        change: 0,
        changePercent: 0,
        volume: 0,
        timestamp: new Date(),
        bid: basePrice - 0.25,
        ask: basePrice + 0.25,
      });
    });
  }

  onStatusChange(listener: (status: ConnectionStatus, latency: number) => void): () => void {
    this.statusListeners.push(listener);
    listener(this.status, this.latencyMs);
    return () => {
      this.statusListeners = this.statusListeners.filter(l => l !== listener);
    };
  }

  onPriceUpdate(listener: (update: PriceUpdate) => void): () => void {
    this.priceListeners.push(listener);
    return () => {
      this.priceListeners = this.priceListeners.filter(l => l !== listener);
    };
  }

  private notifyStatusChange(): void {
    this.statusListeners.forEach(l => l(this.status, this.latencyMs));
  }

  private notifyPriceUpdate(update: PriceUpdate): void {
    this.priceListeners.forEach(l => l(update));
  }

  private isMarketHours(): boolean {
    const now = new Date();
    const et = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const hours = et.getHours();
    const minutes = et.getMinutes();
    const time = hours * 60 + minutes;
    const day = et.getDay();
    const marketOpen = 9 * 60 + 30;
    const marketClose = 16 * 60;
    return day >= 1 && day <= 5 && time >= marketOpen && time < marketClose;
  }

  async connect(): Promise<void> {
    if (this.status === 'live' || this.status === 'connecting') return;
    this.status = 'connecting';
    this.notifyStatusChange();
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    const isMarketOpen = this.isMarketHours();
    this.status = isMarketOpen ? 'live' : 'pre-market';
    this.latencyMs = Math.floor(8 + Math.random() * 15);
    this.notifyStatusChange();
    if (this.config.enableMockData) {
      this.startMockUpdates();
    }
  }

  disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.status = 'disconnected';
    this.latencyMs = 0;
    this.notifyStatusChange();
  }

  private startMockUpdates(): void {
    if (this.intervalId) return;
    this.intervalId = setInterval(() => {
      this.config.instruments.forEach(instrument => {
        const current = this.prices.get(instrument);
        if (!current) return;
        const tickSize = instrument === 'NQ' ? 0.25 : 0.25;
        const movement = (Math.random() - 0.48) * tickSize * 4;
        const newPrice = Math.round((current.price + movement) / tickSize) * tickSize;
        const basePrice = MOCK_BASE_PRICES[instrument] || current.price;
        const sessionOpen = basePrice - 15 + Math.random() * 30;
        const change = newPrice - sessionOpen;
        const changePercent = (change / sessionOpen) * 100;
        const volume = Math.floor(50 + Math.random() * 200);
        const update: PriceUpdate = {
          instrument,
          price: newPrice,
          change,
          changePercent,
          volume,
          timestamp: new Date(),
          bid: newPrice - tickSize,
          ask: newPrice + tickSize,
        };
        this.prices.set(instrument, update);
        this.notifyPriceUpdate(update);
      });
      this.latencyMs = Math.floor(8 + Math.random() * 20);
    }, this.config.updateIntervalMs);
  }

  getPrice(instrument: string): PriceUpdate | undefined {
    return this.prices.get(instrument);
  }

  getAllPrices(): PriceUpdate[] {
    return Array.from(this.prices.values());
  }

  getStatus(): { status: ConnectionStatus; latencyMs: number } {
    return { status: this.status, latencyMs: this.latencyMs };
  }

  async simulateDisconnect(durationMs: number = 3000): Promise<void> {
    this.disconnect();
    await new Promise(resolve => setTimeout(resolve, durationMs));
    await this.connect();
  }
}

export function createMarketDataService(config?: Partial<MarketDataConfig>): MarketDataService {
  const defaultConfig: MarketDataConfig = {
    instruments: ['NQ', 'ES', 'YM', 'RTY'],
    updateIntervalMs: 1000,
    enableMockData: true,
    ...config,
  };
  return new MarketDataService(defaultConfig);
}
