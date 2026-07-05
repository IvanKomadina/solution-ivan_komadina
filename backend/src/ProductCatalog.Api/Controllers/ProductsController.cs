using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Application.Products;
using ProductCatalog.Application.Common;
using ProductCatalog.Application.Products.Dtos;
using Microsoft.AspNetCore.Http;

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
	/// Supports filtering by category, price range, and search term.
	/// </summary>
	/// <param name="page">1-based page number (default 1).</param>
	/// <param name="pageSize">Items per page, 1-100 (default 12).</param>
	/// <param name="category">Optional category slug to filter by (see <c>GET /api/products/categories</c>).</param>
	/// <param name="minPrice">Optional inclusive minimum price.</param>
	/// <param name="maxPrice">Optional inclusive maximum price.</param>
	/// <param name="search">Optional text to search product names for.</param>
	[HttpGet]
	[ProducesResponseType(typeof(ServiceResponse<PagedResult<ProductListItemDto>>), StatusCodes.Status200OK)]
	[ProducesResponseType(typeof(ServiceResponse<PagedResult<ProductListItemDto>>), StatusCodes.Status400BadRequest)]
	[ProducesResponseType(typeof(ServiceResponse<PagedResult<ProductListItemDto>>), StatusCodes.Status500InternalServerError)]
	public async Task<ActionResult<ServiceResponse<PagedResult<ProductListItemDto>>>> GetProducts(
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
	/// <param name="id">The product id.</param>
	[HttpGet("{id:int}")]
	[ProducesResponseType(typeof(ServiceResponse<ProductDetailDto>), StatusCodes.Status200OK)]
	[ProducesResponseType(typeof(ServiceResponse<ProductDetailDto>), StatusCodes.Status404NotFound)]
	[ProducesResponseType(typeof(ServiceResponse<ProductDetailDto>), StatusCodes.Status500InternalServerError)]
	public async Task<ActionResult<ServiceResponse<ProductDetailDto>>> GetProductById(int id, CancellationToken cancellationToken = default)
	{
		var response = await _productSource.GetProductByIdAsync(id, cancellationToken);
		return HandleResponse(response);
	}

	/// <summary>
	/// Returns the list of available product category slugs, usable as the <c>category</c> filter above.
	/// </summary>
	[HttpGet("categories")]
	[ProducesResponseType(typeof(ServiceResponse<List<string>>), StatusCodes.Status200OK)]
	[ProducesResponseType(typeof(ServiceResponse<List<string>>), StatusCodes.Status500InternalServerError)]
	public async Task<ActionResult<ServiceResponse<List<string>>>> GetCategories(CancellationToken cancellationToken = default)
	{
		var response = await _productSource.GetCategoriesAsync(cancellationToken);
		return HandleResponse(response);
	}
}