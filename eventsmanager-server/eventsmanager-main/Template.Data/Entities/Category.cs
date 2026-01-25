using System.Text.Json.Serialization;

namespace Template.Data.Entities;

public class Category : GenericEntity 
{
    public string Name { get; set; } = null!;
    [JsonIgnore]
    public virtual ICollection<Event> Events { get; set; } = new List<Event>();
}