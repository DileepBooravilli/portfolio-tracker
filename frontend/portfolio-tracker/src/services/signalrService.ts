import * as signalR from '@microsoft/signalr';
import type {
  PriceUpdateDto,
  PositionDto,
  AlertDto,
  TradeNotificationDto,
  PortfolioSummaryDto,
} from '../types/portfolio';

const HUB_URL = import.meta.env.DEV
  ? 'http://localhost:5152/hub/portfolio'
  : '/hub/portfolio';

export class PortfolioSignalRService {
  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(signalR.LogLevel.Information)
      .build();
  }

  async start(): Promise<void> {
    try {
      await this.connection.start();
      console.log('SignalR connected');
    } catch (err) {
      console.error('SignalR connection failed:', err);
      throw err;
    }
  }

  async stop(): Promise<void> {
    await this.connection.stop();
  }

  getState(): signalR.HubConnectionState {
    return this.connection.state;
  }

  onReconnecting(callback: (error?: Error) => void): void {
    this.connection.onreconnecting(callback);
  }

  onReconnected(callback: (connectionId?: string) => void): void {
    this.connection.onreconnected(callback);
  }

  onClose(callback: (error?: Error) => void): void {
    this.connection.onclose(callback);
  }

  onPriceUpdate(callback: (data: PriceUpdateDto) => void): void {
    this.connection.on('OnPriceUpdate', callback);
  }

  onPositionChange(callback: (data: PositionDto) => void): void {
    this.connection.on('OnPositionChange', callback);
  }

  onAlert(callback: (data: AlertDto) => void): void {
    this.connection.on('OnAlert', callback);
  }

  onTradeNotification(callback: (data: TradeNotificationDto) => void): void {
    this.connection.on('OnTradeNotification', callback);
  }

  onPortfolioSummaryUpdate(callback: (data: PortfolioSummaryDto) => void): void {
    this.connection.on('OnPortfolioSummaryUpdate', callback);
  }

  async executeTrade(symbol: string, side: string, quantity: number): Promise<void> {
    await this.connection.invoke('ExecuteTrade', symbol, side, quantity);
  }
}
