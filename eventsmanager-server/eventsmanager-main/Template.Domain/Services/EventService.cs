using Microsoft.EntityFrameworkCore;
using Template.Data;
using Template.Data.Entities;

namespace Template.Domain.Services
{
    public class EventService : IEventService
    {
        private readonly AppDbContext _context;

        public EventService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Event>> GetAllEventsAsync()
        {
            return await _context.Events
                .Include(e => e.Category)
                .ToListAsync();
        }

        public async Task<Event?> GetEventByIdAsync(Guid id)
        {
            return await _context.Events
                .Include(e => e.Category)
                .Include(e => e.Participants)
                .ThenInclude(p => p.User)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Event> CreateEventAsync(Event @event)
        {
            _context.Events.Add(@event);
            await _context.SaveChangesAsync();
            return @event;
        }

        public async Task<bool> UpdateEventAsync(Event @event)
        {
            _context.Entry(@event).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
                return true;
            }
            catch (DbUpdateConcurrencyException)
            {
                return false;
            }
        }

        public async Task<bool> DeleteEventAsync(Guid id)
        {
            Event? @event = await _context.Events.FindAsync(id);
            if (@event == null)
            {
                return false;
            }

            _context.Events.Remove(@event);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RegisterUserForEventAsync(Guid userId, Guid eventId)
        {
            bool exists = await _context.UserEvents
            .AnyAsync(ue => ue.UserId == userId && ue.EventId == eventId);

            if (exists)
            {
                return false;
            }

            UserEvent userEvent = new UserEvent
            {
                UserId = userId,
                EventId = eventId
            };

            _context.UserEvents.Add(userEvent);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

    }
}