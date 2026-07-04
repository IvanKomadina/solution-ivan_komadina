using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Application.Products;

namespace ProductCatalog.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
	private readonly IProductSource _productSource;

	public ProductsController(IProductSource productSource)
	{
		_productSource = productSource;
	}

	/// </summary>
	/// Returns a paginated list of products (image, name, price, shortened description).
	/// </summary>
	[HttpGet]
	public async Task<IActionResult> GetProducts(
		[FromQuery] int page = 1,
		[FromQuery] int pageSize = 12,
		[FromQuery] string? category = null,
		[FromQuery] decimal? minPrice = null,
		[FromQuery] decimal? maxPrice = null,
		[FromQuery] string? search = null,
		CancellationToken cancellationToken = default)
	{
		if (page < 1) page = 1;
		if (pageSize is < 1 or > 100) pageSize = 12;

		if (minPrice.HasValue && maxPrice.HasValue && minPrice > maxPrice)
		{
			return BadRequest(new { message = "minPrice cannot be greater than maxPrice." });
		}

		var query = new ProductQuery
		{
			Page = page,
			PageSize = pageSize,
			Category = category,
			MinPrice = minPrice,
			MaxPrice = maxPrice,
			SearchTerm = search
		};

		var result = await _productSource.GetProductsAsync(query, cancellationToken);

		return Ok(result);
	}

	/// </summary>
	/// Returns details for a single product by id.
	/// </summary>
	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetProductById(int id, CancellationToken cancellationToken = default)
	{
		var product = await _productSource.GetProductByIdAsync(id, cancellationToken);

		if (product is null)
		{
			return NotFound();
		}

		return Ok(product);
	}

	/// <summary>
	/// Returns the list of product categories.
	/// </summary>
	[HttpGet("categories")]
	public async Task<IActionResult> GetCategories(CancellationToken cancellationToken = default)
	{
		var categories = await _productSource.GetCategoriesAsync(cancellationToken);
		return Ok(categories);
	}
}