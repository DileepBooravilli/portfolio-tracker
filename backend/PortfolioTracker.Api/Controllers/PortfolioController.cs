using Microsoft.AspNetCore.Mvc;
using PortfolioTracker.Api.Models.Dtos;
using PortfolioTracker.Api.Services;

namespace PortfolioTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PortfolioController : ControllerBase
{
    private readonly PortfolioService _portfolioService;

    public PortfolioController(PortfolioService portfolioService)
    {
        _portfolioService = portfolioService;
    }

    [HttpGet]
    public ActionResult<List<PositionDto>> GetPortfolio()
    {
        return Ok(_portfolioService.GetAllPositions());
    }

    [HttpGet("summary")]
    public ActionResult<PortfolioSummaryDto> GetSummary()
    {
        return Ok(_portfolioService.GetPortfolioSummary());
    }

    [HttpGet("exposure")]
    public ActionResult<ExposureDto> GetExposure()
    {
        return Ok(_portfolioService.GetExposure());
    }

    [HttpGet("alerts")]
    public ActionResult<List<AlertDto>> GetAlerts([FromQuery] int count = 50)
    {
        count = Math.Clamp(count, 1, 200);
        return Ok(_portfolioService.GetRecentAlerts(count));
    }

    [HttpPost("trade")]
    public ActionResult<TradeNotificationDto> ExecuteTrade([FromBody] TradeRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Symbol))
            return BadRequest("Symbol is required");
        if (request.Quantity <= 0)
            return BadRequest("Quantity must be positive");
        if (request.Side != "Buy" && request.Side != "Sell")
            return BadRequest("Side must be 'Buy' or 'Sell'");

        var trade = _portfolioService.ExecuteTrade(request.Symbol, request.Side, request.Quantity, "User-1");
        if (trade == null)
            return NotFound($"Asset {request.Symbol} not found");

        return Ok(new TradeNotificationDto
        {
            TradeId = trade.Id,
            Symbol = trade.Symbol,
            Side = trade.Side,
            Quantity = trade.Quantity,
            Price = trade.Price,
            UserId = trade.UserId,
            Timestamp = trade.Timestamp
        });
    }
}
