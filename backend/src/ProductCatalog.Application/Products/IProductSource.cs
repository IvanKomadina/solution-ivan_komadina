using ProductCatalog.Application.Common;
using ProductCatalog.Application.Products.Dtos;

namespace ProductCatalog.Application.Products;

public interface IProductSource
{
	Task<ServiceResponse<PagedResult<ProductListItemDto>>> GetProductsAsync(ProductQuery query, CancellationToken cancellationToken = default);
	Task<ServiceResponse<ProductDetailDto>> GetProductByIdAsync(int id, CancellationToken cancellationToken = default);
	Task<ServiceResponse<List<string>>> GetCategoriesAsync(CancellationToken cancellationToken = default);
}