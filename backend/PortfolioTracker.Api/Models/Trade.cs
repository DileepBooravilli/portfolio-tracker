namespace PortfolioTracker.Api.Models;

public class Trade
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Symbol { get; set; } = string.Empty;
    public string Side { get; set; } = "Buy"; // "Buy" or "Sell"
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public string UserId { get; set; } = "User-1";
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
