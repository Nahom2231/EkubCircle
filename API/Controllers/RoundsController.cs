using EkubCircle.Application.DTOs;
using EkubCircle.API.Extensions;
using EkubCircle.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EkubCircle.API.Controllers;

[ApiController]
[Authorize]
[Route("api")]
public class RoundsController(IRoundService roundService) : ControllerBase
{
    [HttpGet("circles/{circleId:int}/current-round")]
    public async Task<ActionResult<RoundDto>> Current(int circleId) =>
        Ok(await roundService.GetCurrentAsync(User.GetUserId(), circleId));

    [HttpGet("circles/{circleId:int}/rounds")]
    public async Task<ActionResult<IReadOnlyList<RoundDto>>> Rounds(int circleId) =>
        Ok(await roundService.GetRoundsAsync(User.GetUserId(), circleId));

    [HttpGet("circles/{circleId:int}/history")]
    public async Task<ActionResult<IReadOnlyList<HistoryItemDto>>> History(int circleId) =>
        Ok(await roundService.GetHistoryAsync(User.GetUserId(), circleId));

    [HttpPost("rounds/{roundId:int}/payments/{membershipId:int}")]
    public async Task<IActionResult> MarkPayment(int roundId, int membershipId, MarkPaymentRequest request)
    {
        await roundService.MarkPaymentAsync(User.GetUserId(), roundId, membershipId, request);
        return Ok(new { message = "Payment recorded." });
    }

    [HttpPost("circles/{circleId:int}/payout")]
    public async Task<ActionResult<PayoutResponse>> Payout(int circleId) =>
        Ok(await roundService.PayoutAsync(User.GetUserId(), circleId));
}
