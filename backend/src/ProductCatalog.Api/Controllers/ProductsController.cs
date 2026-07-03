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

	/// Returns a paginated list of products (image, name, price, shortened description).
	[HttpGet]
	public async Task<IActionResult> GetProducts(
		[FromQuery] int page = 1,
		[FromQuery] int pageSize = 12,
		CancellationToken cancellationToken = default)
	{
		if (page < 1) page = 1;
		if (pageSize is < 1 or > 100) pageSize = 12;

		var query = new ProductQuery { Page = page, PageSize = pageSize };
		var result = await _productSource.GetProductsAsync(query, cancellationToken);

		return Ok(result);
	}

	/// Returns details for a single product by id.
	[HttpGet("{id:int}")]
	public async Task<IActionResult> GetProductById(int id, CancellationToken cancellationToken)
	{
		var product = await _productSource.GetProductByIdAsync(id, cancellationToken);

		if (product is null)
		{
			return NotFound();
		}

		return Ok(product);
	}
}