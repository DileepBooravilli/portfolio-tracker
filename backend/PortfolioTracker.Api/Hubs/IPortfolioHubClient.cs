using PortfolioTracker.Api.Models.Dtos;

namespace PortfolioTracker.Api.Hubs;

public interface IPortfolioHubClient
{
    Task OnPriceUpdate(PriceUpdateDto priceUpdate);
    Task OnPositionChange(PositionDto position);
    Task OnAlert(AlertDto alert);
    Task OnTradeNotification(TradeNotificationDto trade);
    Task OnPortfolioSummaryUpdate(PortfolioSummaryDto summary);
}
