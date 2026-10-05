using EkubCircle.Application.DTOs;
using EkubCircle.API.Extensions;
using EkubCircle.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EkubCircle.API.Controllers;

[ApiController]
[Authorize]
[Route("api/circles")]
public class CirclesController(ICircleService circleService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<CircleSummaryDto>> Create(CreateCircleRequest request)
    {
        var result = await circleService.CreateAsync(User.GetUserId(), request);
        return CreatedAtAction(nameof(GetDetails), new { id = result.Id }, result);
    }

    [HttpGet("available")]
    public async Task<ActionResult<IReadOnlyList<CircleSummaryDto>>> Available([FromQuery] string? search, [FromQuery] string? frequency) =>
        Ok(await circleService.GetAvailableAsync(User.GetUserId(), search, frequency));

    [HttpGet("mine")]
    public async Task<ActionResult<IReadOnlyList<CircleSummaryDto>>> Mine() =>
        Ok(await circleService.GetMyCirclesAsync(User.GetUserId()));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CircleDetailsDto>> GetDetails(int id) =>
        Ok(await circleService.GetDetailsAsync(id, User.GetUserId()));

    [HttpPost("{id:int}/join")]
    public async Task<IActionResult> Join(int id)
    {
        await circleService.JoinAsync(User.GetUserId(), id);
        return Ok(new { message = "Joined circle successfully." });
    }

    [HttpPost("{id:int}/members")]
    public async Task<IActionResult> AddMember(int id, AddMemberRequest request)
    {
        await circleService.AddMemberAsync(User.GetUserId(), id, request);
        return Ok(new { message = "Member added successfully." });
    }

    [HttpPost("{id:int}/start")]
    public async Task<IActionResult> Start(int id)
    {
        await circleService.StartAsync(User.GetUserId(), id);
        return Ok(new { message = "Circle started. Membership and payout order are now locked." });
    }
}
