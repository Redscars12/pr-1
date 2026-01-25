using Template.Data.Entities;

public interface IEventService
{
    Task<IEnumerable<Event>> GetAllEventsAsync();
    Task<Event?> GetEventByIdAsync(Guid id); 
    Task<Event> CreateEventAsync(Event @event);
    Task<bool> UpdateEventAsync(Event @event);
    Task<bool> DeleteEventAsync(Guid id);
    Task<bool> RegisterUserForEventAsync(Guid userId, Guid eventId); 
    Task<IEnumerable<Category>> GetAllCategoriesAsync();
    Task<Category> CreateCategoryAsync(Category category);
}