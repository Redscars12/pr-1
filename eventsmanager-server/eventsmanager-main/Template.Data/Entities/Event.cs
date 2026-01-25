namespace Template.Data.Entities;

public class Event : GenericEntity 
{
    public string Title { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime Date { get; set; }
    
    public Guid CategoryId { get; set; }
    public virtual Category? Category { get; set; } = null!;
    public virtual ICollection<UserEvent> Participants { get; set; } = new List<UserEvent>();
}