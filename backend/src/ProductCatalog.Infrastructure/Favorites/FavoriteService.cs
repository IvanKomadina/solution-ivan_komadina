using Microsoft.EntityFrameworkCore;
using ProductCatalog.Application.Common;
using ProductCatalog.Application.Favorites;
using ProductCatalog.Application.Favorites.Dtos;
using ProductCatalog.Application.Products;
using ProductCatalog.Domain.Entities;
using ProductCatalog.Infrastructure.Persistence;

namespace ProductCatalog.Infrastructure.Favorites;

public class FavoriteService : IFavoriteService
{
	private readonly AppDbContext _dbContext;
	private readonly IProductSource _productSource;

	public FavoriteService(AppDbContext dbContext, IProductSource productSource)
	{
		_dbContext = dbContext;
		_productSource = productSource;
	}

	public async Task<ServiceResponse<List<FavoriteProductDto>>> GetFavoritesAsync(int dummyJsonUserId, CancellationToken cancellationToken = default)
	{
		var favoriteProductIds = await _dbContext.Favorites
			.Where(x => x.DummyJsonUserId == dummyJsonUserId)
			.Select(x => x.DummyJsonProductId)
			.ToListAsync(cancellationToken);

		var favoriteProducts = new List<FavoriteProductDto>();
		foreach (var productId in favoriteProductIds)
		{
			var productResponse = await _productSource.GetProductByIdAsync(productId, cancellationToken);
			if (!productResponse.Success || productResponse.Data is null)
			{
				continue;
			}

			favoriteProducts.Add(new FavoriteProductDto
			{
				ProductId = productResponse.Data.Id,
				Title = productResponse.Data.Title,
				Description = productResponse.Data.Description,
				Category = productResponse.Data.Category,
				Price = productResponse.Data.Price,
				Thumbnail = productResponse.Data.Thumbnail
			});
		}

		return ServiceResponse<List<FavoriteProductDto>>.Ok(favoriteProducts);
	}

	public async Task<ServiceResponse<string>> AddFavoriteAsync(int dummyJsonUserId, int dummyJsonProductId, CancellationToken cancellationToken = default)
	{
		var alreadyExists = await _dbContext.Favorites.AnyAsync(
			x => x.DummyJsonUserId == dummyJsonUserId && x.DummyJsonProductId == dummyJsonProductId,
			cancellationToken);

		if (!alreadyExists)
		{
			_dbContext.Favorites.Add(new Favorite
			{
				DummyJsonUserId = dummyJsonUserId,
				DummyJsonProductId = dummyJsonProductId,
				CreatedAtUtc = DateTime.UtcNow
			});

			await _dbContext.SaveChangesAsync(cancellationToken);
		}

		return ServiceResponse<string>.Ok(string.Empty, statusCode: 200);
	}

	public async Task<ServiceResponse<string>> RemoveFavoriteAsync(int dummyJsonUserId, int dummyJsonProductId, CancellationToken cancellationToken = default)
	{
		var favorite = await _dbContext.Favorites.FirstOrDefaultAsync(
			x => x.DummyJsonUserId == dummyJsonUserId && x.DummyJsonProductId == dummyJsonProductId,
			cancellationToken);

		if (favorite is not null)
		{
			_dbContext.Favorites.Remove(favorite);
			await _dbContext.SaveChangesAsync(cancellationToken);
		}

		return ServiceResponse<string>.Ok(string.Empty, statusCode: 200);
	}
}
