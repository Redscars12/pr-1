namespace Template.Data;

using Microsoft.EntityFrameworkCore;
using Template.Data.Entities;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Спираме опитите на PostgreSQL да прави Guid-а Identity
        modelBuilder.Entity<Category>().Property(c => c.Id).ValueGeneratedOnAdd();
        modelBuilder.Entity<Event>().Property(e => e.Id).ValueGeneratedOnAdd();

        // Конфигурираме Many-to-Many
        modelBuilder.Entity<UserEvent>()
            .HasKey(ue => new { ue.UserId, ue.EventId });

        // Оправяме връзката Категория - Събитие (премахва CategoryId1)
        modelBuilder.Entity<Event>()
            .HasOne(e => e.Category)
            .WithMany(c => c.Events)
            .HasForeignKey(e => e.CategoryId);
    }
public DbSet<Event> Events { get; set; }
public DbSet<Category> Categories { get; set; }
public DbSet<UserEvent> UserEvents { get; set; }
}
