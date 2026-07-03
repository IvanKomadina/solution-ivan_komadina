using ProductCatalog.Application.Common;
using ProductCatalog.Application.Products.Dtos;

namespace ProductCatalog.Application.Products;

public interface IProductSource
{
	Task<PagedResult<ProductListItemDto>> GetProductsAsync(ProductQuery query, CancellationToken cancellationToken = default);
	Task<ProductDetailDto?> GetProductByIdAsync(int id, CancellationToken cancellationToken = default);
}