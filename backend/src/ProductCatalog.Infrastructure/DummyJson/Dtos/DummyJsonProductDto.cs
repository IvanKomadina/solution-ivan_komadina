namespace ProductCatalog.Infrastructure.DummyJson.Dtos;

public class DummyJsonProductDto
{
	public int Id { get; set; }
	public string Title { get; set; } = string.Empty;
	public string Description { get; set; } = string.Empty;
	public string Category { get; set; } = string.Empty;
	public decimal Price { get; set; }
	public double Rating { get; set; }
	public int Stock { get; set; }
	public string Brand { get; set; } = string.Empty;
	public string Thumbnail { get; set; } = string.Empty;
	public List<string> Images { get; set; } = new();
}