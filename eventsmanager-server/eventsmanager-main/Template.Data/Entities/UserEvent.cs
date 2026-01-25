using System.Text.Json.Serialization;
using Template.Data.Entities;
public class UserEvent
{
    public Guid UserId { get; set; }
    [JsonIgnore]
    public User User { get; set; }
    public Guid EventId { get; set; }
    [JsonIgnore]
    public Event Event { get; set; }
}