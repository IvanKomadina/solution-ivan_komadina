namespace ProductCatalog.Domain.Entities;

public class Favorite
{
	public int Id { get; set; }
	public int DummyJsonUserId { get; set; }
	public int DummyJsonProductId { get; set; }
	public DateTime CreatedAtUtc { get; set; }
}
