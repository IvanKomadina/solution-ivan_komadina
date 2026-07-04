using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Application.Products;
using ProductCatalog.Application.Common;
using ProductCatalog.Application.Products.Dtos;

namespace ProductCatalog.Api.Controllers;

[Route("api/[controller]")]
public class ProductsController : BaseController
{
	private readonly IProductSource _productSource;

	public ProductsController(IProductSource productSource)
	{
		_productSource = productSource;
	}

	/// <summary>
	/// Returns a paginated list of products (image, name, price, shortened description).
	/// </summary>
	[HttpGet]
	public async Task<ActionResult<PagedResult<ProductListItemDto>>> GetProducts(
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
			return HandleResponse(ServiceResponse<PagedResult<ProductListItemDto>>.Fail(
				"minPrice cannot be greater than maxPrice."));
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

		var response = await _productSource.GetProductsAsync(query, cancellationToken);
		return HandleResponse(response);
	}

	/// <summary>
	/// Returns full details for a single product by id.
	/// </summary>
	[HttpGet("{id:int}")]
	public async Task<ActionResult<ProductDetailDto>> GetProductById(int id, CancellationToken cancellationToken = default)
	{
		var response = await _productSource.GetProductByIdAsync(id, cancellationToken);
		return HandleResponse(response);
	}

	/// <summary>
	/// Returns the list of product categories.
	/// </summary>
	[HttpGet("categories")]
	public async Task<ActionResult<List<string>>> GetCategories(CancellationToken cancellationToken)
	{
		var response = await _productSource.GetCategoriesAsync(cancellationToken);
		return HandleResponse(response);
	}
}