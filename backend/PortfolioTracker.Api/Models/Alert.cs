namespace PortfolioTracker.Api.Models;

public class Alert
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Symbol { get; set; } = string.Empty;
    public string Level { get; set; } = "Warning"; // "Warning" or "Critical"
    public string Message { get; set; } = string.Empty;
    public decimal PercentChange { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
