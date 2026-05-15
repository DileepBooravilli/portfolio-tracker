using Microsoft.AspNetCore.SignalR;
using PortfolioTracker.Api.Data;
using PortfolioTracker.Api.Hubs;
using PortfolioTracker.Api.Models;
using PortfolioTracker.Api.Models.Dtos;
using PortfolioTracker.Api.Services;

namespace PortfolioTracker.Api.BackgroundServices;

public class MarketSimulator : BackgroundService
{
    private readonly InMemoryStore _store;
    private readonly IHubContext<PortfolioHub, IPortfolioHubClient> _hubContext;
    private readonly PortfolioService _portfolioService;
    private readonly ILogger<MarketSimulator> _logger;
    private readonly Random _random = new();

    // Per-asset drift: positive = bullish, negative = bearish
    private static readonly Dictionary<string, double> AssetDrift = new()
    {
        ["AAPL"] = 0.0005,   // slight bull
        ["MSFT"] = 0.0008,   // moderate bull
        ["GOOGL"] = -0.0006, // bearish
        ["AMZN"] = 0.0003,   // slight bull
        ["TSLA"] = -0.0012,  // strong bear (volatile)
        ["JPM"] = 0.0004,    // slight bull
        ["JNJ"] = -0.0003,   // slight bear
        ["V"] = 0.0006,      // moderate bull
        ["NVDA"] = 0.001,    // strong bull
        ["META"] = -0.0008,  // moderate bear
        ["BRK.B"] = 0.0002,  // flat-ish bull
        ["XOM"] = -0.0005,   // slight bear
        ["UNH"] = 0.0004,    // slight bull
        ["AGG"] = -0.0001,   // near flat (bond ETF)
        ["GLD"] = 0.0003,    // slight bull (safe haven)
    };

    public MarketSimulator(
        InMemoryStore store,
        IHubContext<PortfolioHub, IPortfolioHubClient> hubContext,
        PortfolioService portfolioService,
        ILogger<MarketSimulator> logger)
    {
        _store = store;
        _hubContext = hubContext;
        _portfolioService = portfolioService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Market Data Simulator started");

        while (!stoppingToken.IsCancellationRequested)
        {
            var delay = _random.Next(500, 1500); // 0.5-1.5 seconds
            await Task.Delay(delay, stoppingToken);

            // Update 3-8 random assets per tick
            var assetsToUpdate = _random.Next(3, 9);
            var symbols = _store.Assets.Keys.ToList();
            var updatedSymbols = new List<string>();

            for (int i = 0; i < Math.Min(assetsToUpdate, symbols.Count); i++)
            {
                var symbol = symbols[_random.Next(symbols.Count)];
                if (updatedSymbols.Contains(symbol)) continue;
                updatedSymbols.Add(symbol);

                if (!_store.Assets.TryGetValue(symbol, out var asset)) continue;

                // Generate realistic price movement: -1.5% to +1.5%
                var changePercent = (_random.NextDouble() * 3.0 - 1.5) / 100.0;
                // Per-asset drift: some stocks trend up, others down
                var drift = AssetDrift.GetValueOrDefault(symbol, 0.0);
                changePercent += drift;

                var previousPrice = asset.CurrentPrice;
                var newPrice = Math.Round(asset.CurrentPrice * (1 + (decimal)changePercent), 2);
                newPrice = Math.Max(newPrice, 0.01m); // Floor at $0.01

                asset.PreviousPrice = previousPrice;
                asset.CurrentPrice = newPrice;
                asset.LastUpdated = DateTime.UtcNow;

                // Broadcast price update
                var priceUpdate = new PriceUpdateDto
                {
                    Symbol = symbol,
                    Price = newPrice,
                    Change = newPrice - asset.OpeningPrice,
                    ChangePercent = asset.OpeningPrice != 0
                        ? Math.Round((newPrice - asset.OpeningPrice) / asset.OpeningPrice * 100, 2)
                        : 0,
                    Timestamp = DateTime.UtcNow
                };

                await _hubContext.Clients.All.OnPriceUpdate(priceUpdate);

                // Check for alerts (5% and 10% thresholds)
                await CheckAlerts(symbol, asset);

                // Send updated position if we hold this asset
                var position = _portfolioService.GetPosition(symbol);
                if (position != null)
                {
                    await _hubContext.Clients.All.OnPositionChange(position);
                }
            }

            // Broadcast updated portfolio summary
            if (updatedSymbols.Count > 0)
            {
                var summary = _portfolioService.GetPortfolioSummary();
                await _hubContext.Clients.All.OnPortfolioSummaryUpdate(summary);
            }
        }
    }

    private async Task CheckAlerts(string symbol, Asset asset)
    {
        if (asset.OpeningPrice == 0) return;

        var dayChangePercent = Math.Abs((asset.CurrentPrice - asset.OpeningPrice) / asset.OpeningPrice * 100);
        var direction = asset.CurrentPrice > asset.OpeningPrice ? "up" : "down";

        // Get or create alerted thresholds set for this symbol
        var alertedSet = _store.AlertedThresholds.GetOrAdd(symbol, _ => new HashSet<string>());

        if (dayChangePercent >= 10 && !alertedSet.Contains("10"))
        {
            alertedSet.Add("10");
            var alert = new Alert
            {
                Symbol = symbol,
                Level = "Critical",
                Message = $"CRITICAL: {symbol} is {direction} {dayChangePercent:F1}% today (>${asset.CurrentPrice:F2})",
                PercentChange = Math.Round(dayChangePercent, 2),
                Timestamp = DateTime.UtcNow
            };
            _store.Alerts.Add(alert);

            await _hubContext.Clients.All.OnAlert(new AlertDto
            {
                Id = alert.Id,
                Symbol = alert.Symbol,
                Level = alert.Level,
                Message = alert.Message,
                PercentChange = alert.PercentChange,
                Timestamp = alert.Timestamp
            });

            _logger.LogWarning("CRITICAL ALERT: {Symbol} moved {Change:F1}%", symbol, dayChangePercent);
        }
        else if (dayChangePercent >= 5 && !alertedSet.Contains("5"))
        {
            alertedSet.Add("5");
            var alert = new Alert
            {
                Symbol = symbol,
                Level = "Warning",
                Message = $"WARNING: {symbol} is {direction} {dayChangePercent:F1}% today (${asset.CurrentPrice:F2})",
                PercentChange = Math.Round(dayChangePercent, 2),
                Timestamp = DateTime.UtcNow
            };
            _store.Alerts.Add(alert);

            await _hubContext.Clients.All.OnAlert(new AlertDto
            {
                Id = alert.Id,
                Symbol = alert.Symbol,
                Level = alert.Level,
                Message = alert.Message,
                PercentChange = alert.PercentChange,
                Timestamp = alert.Timestamp
            });

            _logger.LogWarning("WARNING ALERT: {Symbol} moved {Change:F1}%", symbol, dayChangePercent);
        }
    }
}
