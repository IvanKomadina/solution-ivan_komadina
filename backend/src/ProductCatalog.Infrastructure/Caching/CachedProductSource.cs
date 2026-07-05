using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using ProductCatalog.Application.Common;
using ProductCatalog.Application.Products;
using ProductCatalog.Application.Products.Dtos;
using ProductCatalog.Infrastructure.DummyJson;

namespace ProductCatalog.Infrastructure.Caching;

public class CachedProductSource : IProductSource
{
	private static readonly TimeSpan ProductsCacheDuration = TimeSpan.FromMinutes(5);
	private static readonly TimeSpan ProductDetailsCacheDuration = TimeSpan.FromMinutes(10);
	private static readonly TimeSpan CategoriesCacheDuration = TimeSpan.FromHours(24);

	private const string CategoriesCacheKey = "dummyjson:categories";

	private readonly IDummyJsonProductApi _productApi;
	private readonly IMemoryCache _cache;
	private readonly ILogger<CachedProductSource> _logger;

	public CachedProductSource(IDummyJsonProductApi productApi, IMemoryCache cache, ILogger<CachedProductSource> logger)
	{
		_productApi = productApi;
		_cache = cache;
		_logger = logger;
	}

	public Task<ServiceResponse<PagedResult<ProductListItemDto>>> GetProductsAsync(ProductQuery query, CancellationToken cancellationToken = default)
	{
		var cacheKey = BuildProductsCacheKey(query);
		return GetOrCreateAsync(cacheKey, ProductsCacheDuration, () => _productApi.GetProductsAsync(query, cancellationToken));
	}

	public Task<ServiceResponse<ProductDetailDto>> GetProductByIdAsync(int id, CancellationToken cancellationToken = default)
	{
		var cacheKey = $"dummyjson:product:{id}";
		return GetOrCreateAsync(cacheKey, ProductDetailsCacheDuration, () => _productApi.GetProductByIdAsync(id, cancellationToken));
	}

	public Task<ServiceResponse<List<string>>> GetCategoriesAsync(CancellationToken cancellationToken = default)
	{
		return GetOrCreateAsync(CategoriesCacheKey, CategoriesCacheDuration, () => _productApi.GetCategoriesAsync(cancellationToken));
	}

	private async Task<ServiceResponse<T>> GetOrCreateAsync<T>(string cacheKey, TimeSpan duration, Func<Task<ServiceResponse<T>>> valueFactory)
	{
		if (_cache.TryGetValue(cacheKey, out ServiceResponse<T>? cachedValue) && cachedValue is not null)
		{
			_logger.LogDebug("Cache hit for {CacheKey}", cacheKey);
			return cachedValue;
		}

		_logger.LogDebug("Cache miss for {CacheKey}", cacheKey);

		var value = await valueFactory();
		if (value.Success)
		{
			_cache.Set(cacheKey, value, new MemoryCacheEntryOptions
			{
				AbsoluteExpirationRelativeToNow = duration
			});
		}

		return value;
	}

	private static string BuildProductsCacheKey(ProductQuery query)
	{
		return string.Join("|",
			"dummyjson:products",
			$"page={query.Page}",
			$"size={query.PageSize}",
			$"category={query.Category ?? string.Empty}",
			$"min={query.MinPrice?.ToString() ?? string.Empty}",
			$"max={query.MaxPrice?.ToString() ?? string.Empty}",
			$"search={query.SearchTerm ?? string.Empty}");
	}
}
