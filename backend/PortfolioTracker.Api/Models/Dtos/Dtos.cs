namespace PortfolioTracker.Api.Models.Dtos;

public class PositionDto
{
    public string Id { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Sector { get; set; } = string.Empty;
    public string AssetClass { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal AverageCost { get; set; }
    public decimal CurrentPrice { get; set; }
    public decimal MarketValue { get; set; }
    public decimal UnrealizedPnL { get; set; }
    public decimal PnLPercent { get; set; }
    public decimal DayChange { get; set; }
    public decimal DayChangePercent { get; set; }
    public DateTime LastUpdated { get; set; }
}

public class PortfolioSummaryDto
{
    public decimal TotalValue { get; set; }
    public decimal TotalCost { get; set; }
    public decimal TotalPnL { get; set; }
    public decimal TotalPnLPercent { get; set; }
    public decimal DayChange { get; set; }
    public decimal DayChangePercent { get; set; }
    public int PositionCount { get; set; }
}

public class ExposureDto
{
    public List<SectorExposure> BySector { get; set; } = new();
    public List<AssetClassExposure> ByAssetClass { get; set; } = new();
}

public class SectorExposure
{
    public string Sector { get; set; } = string.Empty;
    public decimal MarketValue { get; set; }
    public decimal Weight { get; set; }
}

public class AssetClassExposure
{
    public string AssetClass { get; set; } = string.Empty;
    public decimal MarketValue { get; set; }
    public decimal Weight { get; set; }
}

public class PriceUpdateDto
{
    public string Symbol { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal Change { get; set; }
    public decimal ChangePercent { get; set; }
    public DateTime Timestamp { get; set; }
}

public class TradeRequestDto
{
    public string Symbol { get; set; } = string.Empty;
    public string Side { get; set; } = "Buy";
    public decimal Quantity { get; set; }
}

public class TradeNotificationDto
{
    public string TradeId { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public string Side { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public decimal Price { get; set; }
    public string UserId { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}

public class AlertDto
{
    public string Id { get; set; } = string.Empty;
    public string Symbol { get; set; } = string.Empty;
    public string Level { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public decimal PercentChange { get; set; }
    public DateTime Timestamp { get; set; }
}
