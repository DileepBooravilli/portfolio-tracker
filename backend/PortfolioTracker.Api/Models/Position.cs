namespace PortfolioTracker.Api.Models;

public class Position
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Symbol { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal AverageCost { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
