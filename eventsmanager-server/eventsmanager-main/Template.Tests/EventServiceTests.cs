using Microsoft.EntityFrameworkCore;
using Template.Data;
using Template.Data.Entities;
using Template.Domain.Services;
using Xunit;

namespace Template.Tests;

public class EventServiceTests
{
    private static AppDbContext GetDbContext()
    {
        DbContextOptions<AppDbContext> options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateCategoryAsyncShouldSaveToDatabase()
    {
        using AppDbContext context = GetDbContext();
        EventService service = new EventService(context);
        Category category = new Category { Name = "Конференция" };

        Category result = await service.CreateCategoryAsync(category);

        Assert.NotEqual(Guid.Empty, result.Id); 
        Assert.Equal("Конференция", result.Name);
    }

    [Fact]
    public async Task RegisterUserShouldReturnFalseIfAlreadyRegistered()
    {
        using AppDbContext context = GetDbContext();
        EventService service = new EventService(context);
        Guid userId = Guid.NewGuid();
        Guid eventId = Guid.NewGuid();

        context.UserEvents.Add(new UserEvent { UserId = userId, EventId = eventId });
        await context.SaveChangesAsync();

        bool result = await service.RegisterUserForEventAsync(userId, eventId);

        Assert.False(result);
    }

    [Fact]
    public async Task DeleteEventAsyncShouldRemoveEvent()
    {
        using AppDbContext context = GetDbContext();
        EventService service = new EventService(context);
        Guid eventId = Guid.NewGuid();
        
        context.Events.Add(new Event { Id = eventId, Title = "Test", Date = DateTime.Now });
        await context.SaveChangesAsync();

        bool result = await service.DeleteEventAsync(eventId);

        Assert.True(result);
        Event? deletedEvent = await context.Events.FindAsync(eventId);
        Assert.Null(deletedEvent);
    }
}