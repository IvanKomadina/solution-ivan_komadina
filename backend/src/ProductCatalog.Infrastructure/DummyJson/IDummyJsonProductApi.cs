using ProductCatalog.Application.Common;
using ProductCatalog.Application.Products;
using ProductCatalog.Application.Products.Dtos;

namespace ProductCatalog.Infrastructure.DummyJson;

public interface IDummyJsonProductApi
{
	Task<ServiceResponse<PagedResult<ProductListItemDto>>> GetProductsAsync(ProductQuery query, CancellationToken cancellationToken = default);
	Task<ServiceResponse<ProductDetailDto>> GetProductByIdAsync(int id, CancellationToken cancellationToken = default);
	Task<ServiceResponse<List<string>>> GetCategoriesAsync(CancellationToken cancellationToken = default);
}
