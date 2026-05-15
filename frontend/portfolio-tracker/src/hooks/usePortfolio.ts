import { useState, useEffect, useRef, useCallback } from 'react';
import { PortfolioSignalRService } from '../services/signalrService';
import type {
  PositionDto,
  PortfolioSummaryDto,
  AlertDto,
  TradeNotificationDto,
  PriceUpdateDto,
  ExposureDto,
} from '../types/portfolio';

const API_BASE = import.meta.env.DEV
  ? 'http://localhost:5152/api/portfolio'
  : '/api/portfolio';

export function usePortfolio() {
  const [positions, setPositions] = useState<PositionDto[]>([]);
  const [summary, setSummary] = useState<PortfolioSummaryDto | null>(null);
  const [exposure, setExposure] = useState<ExposureDto | null>(null);
  const [alerts, setAlerts] = useState<AlertDto[]>([]);
  const [tradeNotifications, setTradeNotifications] = useState<TradeNotificationDto[]>([]);
  const [priceUpdates, setPriceUpdates] = useState<Map<string, PriceUpdateDto>>(new Map());
  const [connected, setConnected] = useState(false);
  const [latestAlert, setLatestAlert] = useState<AlertDto | null>(null);

  const serviceRef = useRef<PortfolioSignalRService | null>(null);

  // Fetch exposure data via REST (it's computed, not streamed)
  const fetchExposure = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/exposure`);
      if (res.ok) {
        const data = await res.json();
        setExposure(data);
      }
    } catch (err) {
      console.error('Failed to fetch exposure:', err);
    }
  }, []);

  // Fetch initial alerts via REST
  const fetchAlerts = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/alerts`);
      if (res.ok) {
        const data = await res.json();
        setAlerts(data);
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    }
  }, []);

  useEffect(() => {
    const service = new PortfolioSignalRService();
    serviceRef.current = service;

    // Register handlers before starting
    service.onPositionChange((position) => {
      setPositions((prev) => {
        const idx = prev.findIndex((p) => p.symbol === position.symbol);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = position;
          return updated;
        }
        return [...prev, position];
      });
    });

    service.onPortfolioSummaryUpdate((newSummary) => {
      setSummary(newSummary);
    });

    service.onPriceUpdate((update) => {
      setPriceUpdates((prev) => {
        const newMap = new Map(prev);
        newMap.set(update.symbol, update);
        return newMap;
      });
    });

    service.onAlert((alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 100));
      setLatestAlert(alert);
    });

    service.onTradeNotification((trade) => {
      setTradeNotifications((prev) => [trade, ...prev].slice(0, 50));
    });

    service.onReconnecting(() => setConnected(false));
    service.onReconnected(() => {
      setConnected(true);
      fetchExposure();
    });
    service.onClose(() => setConnected(false));

    // Start connection
    service
      .start()
      .then(() => {
        setConnected(true);
        fetchExposure();
        fetchAlerts();
      })
      .catch(() => setConnected(false));

    // Periodically refresh exposure (every 10s)
    const exposureInterval = setInterval(fetchExposure, 10000);

    return () => {
      clearInterval(exposureInterval);
      service.stop();
    };
  }, [fetchExposure, fetchAlerts]);

  const executeTrade = useCallback(
    async (symbol: string, side: string, quantity: number) => {
      if (serviceRef.current) {
        await serviceRef.current.executeTrade(symbol, side, quantity);
        // Refresh exposure after trade
        setTimeout(fetchExposure, 500);
      }
    },
    [fetchExposure]
  );

  const clearLatestAlert = useCallback(() => {
    setLatestAlert(null);
  }, []);

  return {
    positions,
    summary,
    exposure,
    alerts,
    tradeNotifications,
    priceUpdates,
    connected,
    latestAlert,
    executeTrade,
    clearLatestAlert,
  };
}
