using System.Collections.Concurrent;
using PortfolioTracker.Api.Models;

namespace PortfolioTracker.Api.Data;

public class InMemoryStore
{
    public ConcurrentDictionary<string, Asset> Assets { get; } = new();
    public ConcurrentDictionary<string, Position> Positions { get; } = new();
    public ConcurrentBag<Trade> Trades { get; } = new();
    public ConcurrentBag<Alert> Alerts { get; } = new();
    public ConcurrentDictionary<string, HashSet<string>> AlertedThresholds { get; } = new();

    public InMemoryStore()
    {
        SeedData();
    }

    private void SeedData()
    {
        var assets = new List<Asset>
        {
            new() { Symbol = "AAPL", Name = "Apple Inc.", Sector = "Technology", AssetClass = "Equity", OpeningPrice = 198.50m, CurrentPrice = 198.50m, PreviousPrice = 198.50m },
            new() { Symbol = "MSFT", Name = "Microsoft Corp.", Sector = "Technology", AssetClass = "Equity", OpeningPrice = 420.80m, CurrentPrice = 420.80m, PreviousPrice = 420.80m },
            new() { Symbol = "GOOGL", Name = "Alphabet Inc.", Sector = "Technology", AssetClass = "Equity", OpeningPrice = 175.20m, CurrentPrice = 175.20m, PreviousPrice = 175.20m },
            new() { Symbol = "AMZN", Name = "Amazon.com Inc.", Sector = "Consumer Discretionary", AssetClass = "Equity", OpeningPrice = 185.60m, CurrentPrice = 185.60m, PreviousPrice = 185.60m },
            new() { Symbol = "TSLA", Name = "Tesla Inc.", Sector = "Consumer Discretionary", AssetClass = "Equity", OpeningPrice = 245.30m, CurrentPrice = 245.30m, PreviousPrice = 245.30m },
            new() { Symbol = "JPM", Name = "JPMorgan Chase & Co.", Sector = "Financials", AssetClass = "Equity", OpeningPrice = 198.40m, CurrentPrice = 198.40m, PreviousPrice = 198.40m },
            new() { Symbol = "JNJ", Name = "Johnson & Johnson", Sector = "Healthcare", AssetClass = "Equity", OpeningPrice = 155.80m, CurrentPrice = 155.80m, PreviousPrice = 155.80m },
            new() { Symbol = "V", Name = "Visa Inc.", Sector = "Financials", AssetClass = "Equity", OpeningPrice = 280.90m, CurrentPrice = 280.90m, PreviousPrice = 280.90m },
            new() { Symbol = "NVDA", Name = "NVIDIA Corp.", Sector = "Technology", AssetClass = "Equity", OpeningPrice = 875.50m, CurrentPrice = 875.50m, PreviousPrice = 875.50m },
            new() { Symbol = "META", Name = "Meta Platforms Inc.", Sector = "Technology", AssetClass = "Equity", OpeningPrice = 505.40m, CurrentPrice = 505.40m, PreviousPrice = 505.40m },
            new() { Symbol = "BRK.B", Name = "Berkshire Hathaway B", Sector = "Financials", AssetClass = "Equity", OpeningPrice = 415.20m, CurrentPrice = 415.20m, PreviousPrice = 415.20m },
            new() { Symbol = "XOM", Name = "Exxon Mobil Corp.", Sector = "Energy", AssetClass = "Equity", OpeningPrice = 108.75m, CurrentPrice = 108.75m, PreviousPrice = 108.75m },
            new() { Symbol = "UNH", Name = "UnitedHealth Group", Sector = "Healthcare", AssetClass = "Equity", OpeningPrice = 528.60m, CurrentPrice = 528.60m, PreviousPrice = 528.60m },
            new() { Symbol = "AGG", Name = "iShares Core US Aggregate Bond ETF", Sector = "Fixed Income", AssetClass = "Bond ETF", OpeningPrice = 98.50m, CurrentPrice = 98.50m, PreviousPrice = 98.50m },
            new() { Symbol = "GLD", Name = "SPDR Gold Shares", Sector = "Commodities", AssetClass = "Commodity ETF", OpeningPrice = 215.30m, CurrentPrice = 215.30m, PreviousPrice = 215.30m },
        };

        foreach (var asset in assets)
        {
            Assets[asset.Symbol] = asset;
        }

        // Seed portfolio positions with varied quantities and cost bases
        var positions = new List<Position>
        {
            new() { Symbol = "AAPL", Quantity = 150, AverageCost = 178.25m },
            new() { Symbol = "MSFT", Quantity = 80, AverageCost = 380.50m },
            new() { Symbol = "GOOGL", Quantity = 120, AverageCost = 155.00m },
            new() { Symbol = "AMZN", Quantity = 60, AverageCost = 168.90m },
            new() { Symbol = "TSLA", Quantity = 40, AverageCost = 220.00m },
            new() { Symbol = "JPM", Quantity = 100, AverageCost = 175.30m },
            new() { Symbol = "JNJ", Quantity = 90, AverageCost = 162.50m },
            new() { Symbol = "V", Quantity = 55, AverageCost = 260.00m },
            new() { Symbol = "NVDA", Quantity = 35, AverageCost = 650.00m },
            new() { Symbol = "META", Quantity = 45, AverageCost = 450.00m },
            new() { Symbol = "BRK.B", Quantity = 30, AverageCost = 380.00m },
            new() { Symbol = "XOM", Quantity = 110, AverageCost = 95.40m },
            new() { Symbol = "UNH", Quantity = 25, AverageCost = 510.00m },
            new() { Symbol = "AGG", Quantity = 200, AverageCost = 100.20m },
            new() { Symbol = "GLD", Quantity = 70, AverageCost = 195.80m },
        };

        foreach (var position in positions)
        {
            Positions[position.Symbol] = position;
        }
    }
}
