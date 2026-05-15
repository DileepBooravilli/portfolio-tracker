export interface PositionDto {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  assetClass: string;
  quantity: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  unrealizedPnL: number;
  pnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  lastUpdated: string;
}

export interface PortfolioSummaryDto {
  totalValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  positionCount: number;
}

export interface ExposureDto {
  bySector: SectorExposure[];
  byAssetClass: AssetClassExposure[];
}

export interface SectorExposure {
  sector: string;
  marketValue: number;
  weight: number;
}

export interface AssetClassExposure {
  assetClass: string;
  marketValue: number;
  weight: number;
}

export interface PriceUpdateDto {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: string;
}

export interface TradeRequestDto {
  symbol: string;
  side: 'Buy' | 'Sell';
  quantity: number;
}

export interface TradeNotificationDto {
  tradeId: string;
  symbol: string;
  side: string;
  quantity: number;
  price: number;
  userId: string;
  timestamp: string;
}

export interface AlertDto {
  id: string;
  symbol: string;
  level: 'Warning' | 'Critical';
  message: string;
  percentChange: number;
  timestamp: string;
}
