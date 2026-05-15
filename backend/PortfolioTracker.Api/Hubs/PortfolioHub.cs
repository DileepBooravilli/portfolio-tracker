using Microsoft.AspNetCore.SignalR;
using PortfolioTracker.Api.Data;
using PortfolioTracker.Api.Models;
using PortfolioTracker.Api.Models.Dtos;
using PortfolioTracker.Api.Services;

namespace PortfolioTracker.Api.Hubs;

public class PortfolioHub : Hub<IPortfolioHubClient>
{
    private readonly InMemoryStore _store;
    private readonly PortfolioService _portfolioService;

    public PortfolioHub(InMemoryStore store, PortfolioService portfolioService)
    {
        _store = store;
        _portfolioService = portfolioService;
    }

    public override async Task OnConnectedAsync()
    {
        // Send current portfolio snapshot to newly connected client
        var positions = _portfolioService.GetAllPositions();
        foreach (var position in positions)
        {
            await Clients.Caller.OnPositionChange(position);
        }

        var summary = _portfolioService.GetPortfolioSummary();
        await Clients.Caller.OnPortfolioSummaryUpdate(summary);

        await base.OnConnectedAsync();
    }

    public async Task ExecuteTrade(string symbol, string side, decimal quantity)
    {
        var trade = _portfolioService.ExecuteTrade(symbol, side, quantity, "User-1");
        if (trade == null) return;

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

        await Clients.All.OnTradeNotification(notification);

        // Send updated position
        var position = _portfolioService.GetPosition(symbol);
        if (position != null)
        {
            await Clients.All.OnPositionChange(position);
        }

        // Send updated summary
        var summary = _portfolioService.GetPortfolioSummary();
        await Clients.All.OnPortfolioSummaryUpdate(summary);
    }
}
