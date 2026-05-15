using Microsoft.AspNetCore.SignalR;
using PortfolioTracker.Api.Data;
using PortfolioTracker.Api.Hubs;
using PortfolioTracker.Api.Models.Dtos;
using PortfolioTracker.Api.Services;

namespace PortfolioTracker.Api.BackgroundServices;

public class UserActivitySimulator : BackgroundService
{
    private readonly InMemoryStore _store;
    private readonly IHubContext<PortfolioHub, IPortfolioHubClient> _hubContext;
    private readonly PortfolioService _portfolioService;
    private readonly ILogger<UserActivitySimulator> _logger;
    private readonly Random _random = new();

    private readonly string[] _simulatedUsers = { "User-2", "User-3", "User-4", "User-5" };

    public UserActivitySimulator(
        InMemoryStore store,
        IHubContext<PortfolioHub, IPortfolioHubClient> hubContext,
        PortfolioService portfolioService,
        ILogger<UserActivitySimulator> logger)
    {
        _store = store;
        _hubContext = hubContext;
        _portfolioService = portfolioService;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("User Activity Simulator started");

        // Wait a bit before starting simulated user activity
        await Task.Delay(2000, stoppingToken);

        while (!stoppingToken.IsCancellationRequested)
        {
            var delay = _random.Next(3000, 6000); // 3-6 seconds
            await Task.Delay(delay, stoppingToken);

            var symbols = _store.Assets.Keys.ToList();
            var symbol = symbols[_random.Next(symbols.Count)];
            var userId = _simulatedUsers[_random.Next(_simulatedUsers.Length)];
            var side = _random.NextDouble() > 0.4 ? "Buy" : "Sell"; // Slightly more buys
            var quantity = (decimal)(_random.Next(5, 50));

            // Don't sell more than we have
            if (side == "Sell" && _store.Positions.TryGetValue(symbol, out var pos))
            {
                if (pos.Quantity <= 0) side = "Buy";
                else quantity = Math.Min(quantity, Math.Floor(pos.Quantity * 0.3m)); // Sell at most 30%
                if (quantity <= 0) quantity = 5;
            }

            var trade = _portfolioService.ExecuteTrade(symbol, side, quantity, userId);
            if (trade == null) continue;

            var notification = new TradeNotificationDto
            {
                TradeId = trade.Id,
                Symbol = trade.Symbol,
                Side = trade.Side,
                Quantity = trade.Quantity,
                Price = trade.Price,
                UserId = trade.UserId,
                Timestamp = trade.Timestamp
            };

            await _hubContext.Clients.All.OnTradeNotification(notification);

            // Send updated position
            var position = _portfolioService.GetPosition(symbol);
            if (position != null)
            {
                await _hubContext.Clients.All.OnPositionChange(position);
            }

            // Send updated summary
            var summary = _portfolioService.GetPortfolioSummary();
            await _hubContext.Clients.All.OnPortfolioSummaryUpdate(summary);

            _logger.LogInformation(
                "Simulated trade: {User} {Side} {Qty} {Symbol} @ ${Price}",
                userId, side, quantity, symbol, trade.Price);
        }
    }
}
