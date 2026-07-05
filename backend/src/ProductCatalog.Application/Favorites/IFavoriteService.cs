using ProductCatalog.Application.Common;
using ProductCatalog.Application.Favorites.Dtos;

namespace ProductCatalog.Application.Favorites;

public interface IFavoriteService
{
	Task<ServiceResponse<List<FavoriteProductDto>>> GetFavoritesAsync(int dummyJsonUserId, CancellationToken cancellationToken = default);
	Task<ServiceResponse<string>> AddFavoriteAsync(int dummyJsonUserId, int dummyJsonProductId, CancellationToken cancellationToken = default);
	Task<ServiceResponse<string>> RemoveFavoriteAsync(int dummyJsonUserId, int dummyJsonProductId, CancellationToken cancellationToken = default);
}
