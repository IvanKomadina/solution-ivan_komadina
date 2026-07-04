using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using ProductCatalog.Application.Common;
using ProductCatalog.Application.Products;
using ProductCatalog.Application.Products.Dtos;
using ProductCatalog.Infrastructure.DummyJson.Dtos;

namespace ProductCatalog.Infrastructure.DummyJson;

public class DummyJsonProductSource : IProductSource
{
	private readonly HttpClient _httpClient;
	private readonly ILogger<DummyJsonProductSource> _logger;

	public DummyJsonProductSource(HttpClient httpClient, ILogger<DummyJsonProductSource> logger)
	{
		_httpClient = httpClient;
		_logger = logger;
	}

	public async Task<ServiceResponse<PagedResult<ProductListItemDto>>> GetProductsAsync(ProductQuery query, CancellationToken cancellationToken = default)
	{
		var hasSearch = !string.IsNullOrWhiteSpace(query.SearchTerm);
		var hasCategory = !string.IsNullOrWhiteSpace(query.Category);
		var hasPriceFilter = query.MinPrice.HasValue || query.MaxPrice.HasValue;

		var needsManualPaging = hasPriceFilter || hasCategory;

		var url = BuildUrl(query, hasSearch, hasCategory, hasPriceFilter);

		_logger.LogInformation("Fetching products from DummyJSON: {Url}", url);

		try
		{
			var response = await _httpClient.GetFromJsonAsync<DummyJsonProductListResponseDto>(url, cancellationToken)
				?? new DummyJsonProductListResponseDto();

			IEnumerable<DummyJsonProductDto> products = response.Products;

			if (hasCategory)
			{
				products = products.Where(p =>
					string.Equals(p.Category, query.Category, StringComparison.OrdinalIgnoreCase));
			}

			if (hasPriceFilter)
			{
				products = products.Where(p =>
					(!query.MinPrice.HasValue || p.Price >= query.MinPrice.Value) &&
					(!query.MaxPrice.HasValue || p.Price <= query.MaxPrice.Value));
			}

			var filteredList = products.ToList();

			// Manually handle paging if we had to filter in-memory, otherwise rely on the API's paging.
			if (needsManualPaging)
			{
				var totalCount = filteredList.Count;
				var pageItems = filteredList
					.Skip((query.Page - 1) * query.PageSize)
					.Take(query.PageSize)
					.Select(MapToListItem)
					.ToList();

				var pagedResult = new PagedResult<ProductListItemDto>
				{
					Items = pageItems,
					Page = query.Page,
					PageSize = query.PageSize,
					TotalCount = totalCount
				};

				return ServiceResponse<PagedResult<ProductListItemDto>>.Ok(pagedResult);
			}

			var result = new PagedResult<ProductListItemDto>
			{
				Items = filteredList.Select(MapToListItem).ToList(),
				Page = query.Page,
				PageSize = query.PageSize,
				TotalCount = response.Total
			};

			return ServiceResponse<PagedResult<ProductListItemDto>>.Ok(result);
		}
		catch (HttpRequestException ex)
		{
			_logger.LogError(ex, "HTTP error while fetching products from DummyJSON ({Url})", url);
			return ServiceResponse<PagedResult<ProductListItemDto>>.Error("Unable to connect to the product service.");
		}
		catch (TaskCanceledException ex)
		{
			_logger.LogError(ex, "Request timed out while fetching products from DummyJSON ({Url})", url);
			return ServiceResponse<PagedResult<ProductListItemDto>>.Error("The request to the product service timed out.");
		}
		catch (JsonException ex)
		{
			_logger.LogError(ex, "Invalid response received from DummyJSON ({Url})", url);
			return ServiceResponse<PagedResult<ProductListItemDto>>.Error("Invalid response received from the product service.");
		}
	}

	public async Task<ServiceResponse<ProductDetailDto>> GetProductByIdAsync(int id, CancellationToken cancellationToken = default)
	{
		_logger.LogInformation("Fetching product {ProductId} from DummyJSON", id);

		try
		{
			var response = await _httpClient.GetAsync($"products/{id}", cancellationToken);

			if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
			{
				_logger.LogWarning("Product {ProductId} not found in DummyJSON", id);
				return ServiceResponse<ProductDetailDto>.Fail("Product not found.", 404);
			}

			response.EnsureSuccessStatusCode();

			var product = await response.Content.ReadFromJsonAsync<DummyJsonProductDto>(cancellationToken: cancellationToken);

			if (product is null)
			{
				return ServiceResponse<ProductDetailDto>.Error("No response received from the product service.");
			}

			return ServiceResponse<ProductDetailDto>.Ok(MapToDetail(product));
		}
		catch (HttpRequestException ex)
		{
			_logger.LogError(ex, "HTTP error while fetching product {ProductId} from DummyJSON", id);
			return ServiceResponse<ProductDetailDto>.Error("Unable to connect to the product service.");
		}
		catch (TaskCanceledException ex)
		{
			_logger.LogError(ex, "Request timed out while fetching product {ProductId} from DummyJSON", id);
			return ServiceResponse<ProductDetailDto>.Error("The request to the product service timed out.");
		}
		catch (JsonException ex)
		{
			_logger.LogError(ex, "Invalid response received from DummyJSON for product {ProductId}", id);
			return ServiceResponse<ProductDetailDto>.Error("Invalid response received from the product service.");
		}
	}

	public async Task<ServiceResponse<List<string>>> GetCategoriesAsync(CancellationToken cancellationToken = default)
	{
		_logger.LogInformation("Fetching categories from DummyJSON");

		try
		{
			var categories = await _httpClient.GetFromJsonAsync<List<DummyJsonCategoryDto>>("products/categories", cancellationToken)
				?? new List<DummyJsonCategoryDto>();

			return ServiceResponse<List<string>>.Ok(categories.Select(c => c.Slug).ToList());
		}
		catch (HttpRequestException ex)
		{
			_logger.LogError(ex, "HTTP error while fetching categories from DummyJSON");
			return ServiceResponse<List<string>>.Error("Unable to connect to the product service.");
		}
		catch (TaskCanceledException ex)
		{
			_logger.LogError(ex, "Request timed out while fetching categories from DummyJSON");
			return ServiceResponse<List<string>>.Error("The request to the product service timed out.");
		}
		catch (JsonException ex)
		{
			_logger.LogError(ex, "Invalid response received from DummyJSON categories endpoint");
			return ServiceResponse<List<string>>.Error("Invalid response received from the product service.");
		}
	}

	private static ProductListItemDto MapToListItem(DummyJsonProductDto product)
	{
		return new ProductListItemDto
		{
			Id = product.Id,
			Title = product.Title,
			Thumbnail = product.Thumbnail,
			Price = product.Price,
			ShortDescription = Truncate(product.Description, 100)
		};
	}

	private static ProductDetailDto MapToDetail(DummyJsonProductDto product)
	{
		return new ProductDetailDto
		{
			Id = product.Id,
			Title = product.Title,
			Description = product.Description,
			Category = product.Category,
			Price = product.Price,
			Rating = product.Rating,
			Stock = product.Stock,
			Brand = product.Brand,
			Thumbnail = product.Thumbnail,
			Images = product.Images
		};
	}

	internal static string Truncate(string text, int maxLength)
	{
		if (string.IsNullOrEmpty(text) || text.Length <= maxLength)
		{
			return text;
		}

		return text[..(maxLength - 3)].TrimEnd() + "...";
	}

	private static string BuildUrl(ProductQuery query, bool hasSearch, bool hasCategory, bool hasPriceFilter)
	{
		var skip = (query.Page - 1) * query.PageSize;

		if (hasSearch)
		{
			var q = Uri.EscapeDataString(query.SearchTerm!);

			// If category or price also need in-memory filtering on top, fetch everything matching the search term.
			return (hasCategory || hasPriceFilter)
				? $"products/search?q={q}&limit=0"
				: $"products/search?q={q}&limit={query.PageSize}&skip={skip}";
		}

		if (hasCategory || hasPriceFilter)
		{
			return "products?limit=0";
		}

		return $"products?limit={query.PageSize}&skip={skip}";
	}
}