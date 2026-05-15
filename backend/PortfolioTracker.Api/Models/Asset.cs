namespace PortfolioTracker.Api.Models;

public class Asset
{
    public string Symbol { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Sector { get; set; } = string.Empty;
    public string AssetClass { get; set; } = "Equity";
    public decimal OpeningPrice { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal PreviousPrice { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
