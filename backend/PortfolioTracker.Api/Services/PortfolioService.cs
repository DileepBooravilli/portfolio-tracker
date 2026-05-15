using PortfolioTracker.Api.Data;
using PortfolioTracker.Api.Models;
using PortfolioTracker.Api.Models.Dtos;

namespace PortfolioTracker.Api.Services;

public class PortfolioService
{
    private readonly InMemoryStore _store;

    public PortfolioService(InMemoryStore store)
    {
        _store = store;
    }

    public List<PositionDto> GetAllPositions()
    {
        return _store.Positions.Values
            .Select(p => BuildPositionDto(p))
            .Where(p => p != null)
            .Cast<PositionDto>()
            .OrderByDescending(p => p.MarketValue)
            .ToList();
    }

    public PositionDto? GetPosition(string symbol)
    {
        if (!_store.Positions.TryGetValue(symbol, out var position))
            return null;
        return BuildPositionDto(position);
    }

    public PortfolioSummaryDto GetPortfolioSummary()
    {
        var positions = GetAllPositions();
        var totalValue = positions.Sum(p => p.MarketValue);
        var totalCost = positions.Sum(p => p.AverageCost * p.Quantity);
        var totalPnL = totalValue - totalCost;
        var totalPnLPercent = totalCost != 0 ? (totalPnL / totalCost) * 100 : 0;

        // Day change: sum of (currentPrice - openingPrice) * quantity
        decimal dayChange = 0;
        decimal previousTotalValue = 0;
        foreach (var pos in _store.Positions.Values)
        {
            if (_store.Assets.TryGetValue(pos.Symbol, out var asset))
            {
                dayChange += (asset.CurrentPrice - asset.OpeningPrice) * pos.Quantity;
                previousTotalValue += asset.OpeningPrice * pos.Quantity;
            }
        }
        var dayChangePercent = previousTotalValue != 0 ? (dayChange / previousTotalValue) * 100 : 0;

        return new PortfolioSummaryDto
        {
            TotalValue = Math.Round(totalValue, 2),
            TotalCost = Math.Round(totalCost, 2),
            TotalPnL = Math.Round(totalPnL, 2),
            TotalPnLPercent = Math.Round(totalPnLPercent, 2),
            DayChange = Math.Round(dayChange, 2),
            DayChangePercent = Math.Round(dayChangePercent, 2),
            PositionCount = positions.Count
        };
    }

    public ExposureDto GetExposure()
    {
        var positions = GetAllPositions();
        var totalValue = positions.Sum(p => p.MarketValue);

        var bySector = positions
            .GroupBy(p => p.Sector)
            .Select(g => new SectorExposure
            {
                Sector = g.Key,
                MarketValue = Math.Round(g.Sum(p => p.MarketValue), 2),
                Weight = totalValue != 0 ? Math.Round(g.Sum(p => p.MarketValue) / totalValue * 100, 2) : 0
            })
            .OrderByDescending(s => s.Weight)
            .ToList();

        var byAssetClass = positions
            .GroupBy(p => p.AssetClass)
            .Select(g => new AssetClassExposure
            {
                AssetClass = g.Key,
                MarketValue = Math.Round(g.Sum(p => p.MarketValue), 2),
                Weight = totalValue != 0 ? Math.Round(g.Sum(p => p.MarketValue) / totalValue * 100, 2) : 0
            })
            .OrderByDescending(a => a.Weight)
            .ToList();

        return new ExposureDto { BySector = bySector, ByAssetClass = byAssetClass };
    }

    public Trade? ExecuteTrade(string symbol, string side, decimal quantity, string userId)
    {
        if (!_store.Assets.TryGetValue(symbol, out var asset))
            return null;

        var trade = new Trade
        {
            Symbol = symbol,
            Side = side,
            Quantity = quantity,
            Price = asset.CurrentPrice,
            UserId = userId,
            Timestamp = DateTime.UtcNow
        };

        _store.Trades.Add(trade);

        // Update or create position
        _store.Positions.AddOrUpdate(
            symbol,
            // Add new position
            _ => new Position
            {
                Symbol = symbol,
                Quantity = side == "Buy" ? quantity : 0,
                AverageCost = asset.CurrentPrice,
                LastUpdated = DateTime.UtcNow
            },
            // Update existing position
            (_, existing) =>
            {
                if (side == "Buy")
                {
                    var totalCost = existing.AverageCost * existing.Quantity + asset.CurrentPrice * quantity;
                    existing.Quantity += quantity;
                    existing.AverageCost = existing.Quantity > 0 ? totalCost / existing.Quantity : 0;
                }
                else // Sell
                {
                    existing.Quantity = Math.Max(0, existing.Quantity - quantity);
                }
                existing.LastUpdated = DateTime.UtcNow;
                return existing;
            }
        );

        return trade;
    }

    public List<AlertDto> GetRecentAlerts(int count = 50)
    {
        return _store.Alerts
            .OrderByDescending(a => a.Timestamp)
            .Take(count)
            .Select(a => new AlertDto
            {
                Id = a.Id,
                Symbol = a.Symbol,
                Level = a.Level,
                Message = a.Message,
                PercentChange = a.PercentChange,
                Timestamp = a.Timestamp
            })
            .ToList();
    }

    private PositionDto? BuildPositionDto(Position position)
    {
        if (!_store.Assets.TryGetValue(position.Symbol, out var asset))
            return null;

        var marketValue = asset.CurrentPrice * position.Quantity;
        var unrealizedPnL = (asset.CurrentPrice - position.AverageCost) * position.Quantity;
        var pnlPercent = position.AverageCost != 0
            ? ((asset.CurrentPrice - position.AverageCost) / position.AverageCost) * 100
            : 0;
        var dayChange = asset.CurrentPrice - asset.OpeningPrice;
        var dayChangePercent = asset.OpeningPrice != 0
            ? (dayChange / asset.OpeningPrice) * 100
            : 0;

        return new PositionDto
        {
            Id = position.Id,
            Symbol = position.Symbol,
            Name = asset.Name,
            Sector = asset.Sector,
            AssetClass = asset.AssetClass,
            Quantity = position.Quantity,
            AverageCost = Math.Round(position.AverageCost, 2),
            CurrentPrice = Math.Round(asset.CurrentPrice, 2),
            MarketValue = Math.Round(marketValue, 2),
            UnrealizedPnL = Math.Round(unrealizedPnL, 2),
            PnLPercent = Math.Round(pnlPercent, 2),
            DayChange = Math.Round(dayChange, 2),
            DayChangePercent = Math.Round(dayChangePercent, 2),
            LastUpdated = asset.LastUpdated
        };
    }
}
