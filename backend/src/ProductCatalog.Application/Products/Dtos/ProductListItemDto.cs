namespace ProductCatalog.Application.Products.Dtos;

public class ProductListItemDto
{
	public int Id { get; set; }
	public string Title { get; set; } = string.Empty;
	public string Thumbnail { get; set; } = string.Empty;
	public decimal Price { get; set; }
	public string ShortDescription { get; set; } = string.Empty;
}