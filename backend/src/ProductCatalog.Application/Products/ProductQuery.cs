namespace ProductCatalog.Application.Products;

public class ProductQuery
{
	public int Page { get; set; } = 1;
	public int PageSize { get; set; } = 12;
	public string? Category { get; set; }
	public decimal? MinPrice { get; set; }
	public decimal? MaxPrice { get; set; }
	public string? SearchTerm { get; set; }
}