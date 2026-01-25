using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Template.Data.Entities;
using Template.Domain.Services;

namespace Template.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Event>>> GetAllEvents()
        {
            IEnumerable<Event> events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Event>> GetEvent(Guid id)
        {
            Event? @event = await _eventService.GetEventByIdAsync(id);
            if (@event == null)
            {
                return NotFound();
            }

            return Ok(@event);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateEvent(Guid id, Event @event)
        {
            if (id != @event.Id)
            {
                return BadRequest();
            }

            bool result = await _eventService.UpdateEventAsync(@event);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateEvent(Event @event)
        {
            Event createdEvent = await _eventService.CreateEventAsync(@event);
            return CreatedAtAction(nameof(GetEvent), new { id = createdEvent.Id }, createdEvent);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteEvent(Guid id)
        {
            bool result = await _eventService.DeleteEventAsync(id);
            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpPost("register/{eventId}")]
        public async Task<IActionResult> Register(Guid eventId)
        {
            string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(userIdClaim, out Guid userId))
            {
                return BadRequest("Invalid User ID format.");
            }

            bool result = await _eventService.RegisterUserForEventAsync(userId, eventId);
            if (!result)
            {
                return BadRequest("Already registered or event not found.");
            }

            return Ok("Successfully registered for the event.");
        }
    }
}