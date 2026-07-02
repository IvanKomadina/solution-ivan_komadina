using System.Net.Http.Json;
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
		var skip = (query.Page - 1) * query.PageSize;
		var url = $"products?limit={query.PageSize}&skip={skip}";

		_logger.LogInformation("Fetching products from DummyJSON: {Url}", url);

		var response = await _httpClient.GetFromJsonAsync<DummyJsonProductListResponseDto>(url, cancellationToken)
			?? new DummyJsonProductListResponseDto();

		var items = response.Products.Select(MapToListItem).ToList();

		return new PagedResult<ProductListItemDto>
		{
			Items = items,
			Page = query.Page,
			PageSize = query.PageSize,
			TotalCount = response.Total
		};
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

	internal static string Truncate(string text, int maxLength)
	{
		if (string.IsNullOrEmpty(text) || text.Length <= maxLength)
		{
			return text;
		}

		return text[..(maxLength - 3)].TrimEnd() + "...";
	}
}