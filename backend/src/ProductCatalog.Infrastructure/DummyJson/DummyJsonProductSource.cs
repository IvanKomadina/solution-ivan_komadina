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

	public async Task<PagedResult<ProductListItemDto>> GetProductsAsync(ProductQuery query, CancellationToken cancellationToken = default)
	{
		var hasPriceFilter = query.MinPrice.HasValue || query.MaxPrice.HasValue;
		var url = BuildUrl(query, hasPriceFilter);

		_logger.LogInformation("Fetching products from DummyJSON: {Url}", url);

		try
		{
			var response = await _httpClient.GetFromJsonAsync<DummyJsonProductListResponseDto>(url, cancellationToken)
				?? new DummyJsonProductListResponseDto();

			IEnumerable<DummyJsonProductDto> products = response.Products;

			if (hasPriceFilter)
			{
				products = products.Where(p =>
					(!query.MinPrice.HasValue || p.Price >= query.MinPrice.Value) &&
					(!query.MaxPrice.HasValue || p.Price <= query.MaxPrice.Value));
			}

			var filteredList = products.ToList();

			// If query has price filters, we need to manually paginate the results since
			// DummyJSON does not support server-side filtering by price.
			if (hasPriceFilter)
			{
				var totalCount = filteredList.Count;
				var pageItems = filteredList
					.Skip((query.Page - 1) * query.PageSize)
					.Take(query.PageSize)
					.Select(MapToListItem)
					.ToList();

				return new PagedResult<ProductListItemDto>
				{
					Items = pageItems,
					Page = query.Page,
					PageSize = query.PageSize,
					TotalCount = totalCount
				};
			}

			return new PagedResult<ProductListItemDto>
			{
				Items = filteredList.Select(MapToListItem).ToList(),
				Page = query.Page,
				PageSize = query.PageSize,
				TotalCount = response.Total
			};
		}
		catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or JsonException)
		{
			_logger.LogError(ex, "Failed to fetch product list from DummyJSON ({Url})", url);
			throw new ProductSourceUnavailableException("Unable to retrieve products from the external product source.", ex);
		}
	}

	public async Task<ProductDetailDto?> GetProductByIdAsync(int id, CancellationToken cancellationToken = default)
	{
		_logger.LogInformation("Fetching product {ProductId} from DummyJSON", id);

		try
		{
			var response = await _httpClient.GetAsync($"products/{id}", cancellationToken);

			if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
			{
				_logger.LogWarning("Product {ProductId} not found in DummyJSON", id);
				return null;
			}

			response.EnsureSuccessStatusCode();

			var product = await response.Content.ReadFromJsonAsync<DummyJsonProductDto>(cancellationToken: cancellationToken);

			return product is null ? null : MapToDetail(product);
		}
		catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or JsonException)
		{
			_logger.LogError(ex, "Failed to fetch product {ProductId} from DummyJSON", id);
			throw new ProductSourceUnavailableException($"Unable to retrieve product {id} from the external product source.", ex);
		}
	}

	public async Task<List<string>> GetCategoriesAsync(CancellationToken cancellationToken = default)
	{
		_logger.LogInformation("Fetching categories from DummyJSON");

		try
		{
			var categories = await _httpClient.GetFromJsonAsync<List<DummyJsonCategoryDto>>("products/categories", cancellationToken)
				?? new List<DummyJsonCategoryDto>();

			return categories.Select(c => c.Slug).ToList();
		}
		catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException or JsonException)
		{
			_logger.LogError(ex, "Failed to fetch categories from DummyJSON");
			throw new ProductSourceUnavailableException("Unable to retrieve categories from the external product source.", ex);
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

	private static string BuildUrl(ProductQuery query, bool hasPriceFilter)
	{
		var hasCategory = !string.IsNullOrWhiteSpace(query.Category);
		var skip = (query.Page - 1) * query.PageSize;

		if (hasCategory && hasPriceFilter)
		{
			var category = Uri.EscapeDataString(query.Category!);
			return $"products/category/{category}?limit=0";
		}

		if (hasCategory)
		{
			var category = Uri.EscapeDataString(query.Category!);
			return $"products/category/{category}?limit={query.PageSize}&skip={skip}";
		}

		if (hasPriceFilter)
		{
			return "products?limit=0";
		}

		return $"products?limit={query.PageSize}&skip={skip}";
	}
}