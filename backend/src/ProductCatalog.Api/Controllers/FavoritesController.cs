using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Application.Common;
using ProductCatalog.Application.Favorites;
using ProductCatalog.Application.Favorites.Dtos;

namespace ProductCatalog.Api.Controllers;

[Authorize]
[Route("api/favorites")]
public class FavoritesController : BaseController
{
	private readonly IFavoriteService _favoriteService;

	public FavoritesController(IFavoriteService favoriteService)
	{
		_favoriteService = favoriteService;
	}

	[HttpGet]
	public async Task<ActionResult<ServiceResponse<List<FavoriteProductDto>>>> GetFavorites(CancellationToken cancellationToken = default)
	{
		var userId = GetCurrentUserId();
		if (userId is null)
		{
			return Unauthorized();
		}

		var response = await _favoriteService.GetFavoritesAsync(userId.Value, cancellationToken);
		return HandleResponse(response);
	}

	[HttpPost("{productId:int}")]
	public async Task<ActionResult<ServiceResponse<string>>> AddFavorite(int productId, CancellationToken cancellationToken = default)
	{
		var userId = GetCurrentUserId();
		if (userId is null)
		{
			return Unauthorized();
		}

		var response = await _favoriteService.AddFavoriteAsync(userId.Value, productId, cancellationToken);
		return HandleResponse(response);
	}

	[HttpDelete("{productId:int}")]
	public async Task<ActionResult<ServiceResponse<string>>> RemoveFavorite(int productId, CancellationToken cancellationToken = default)
	{
		var userId = GetCurrentUserId();
		if (userId is null)
		{
			return Unauthorized();
		}

		var response = await _favoriteService.RemoveFavoriteAsync(userId.Value, productId, cancellationToken);
		return HandleResponse(response);
	}

	private int? GetCurrentUserId()
	{
		var raw = User.FindFirstValue("dummyjson_user_id") ?? User.FindFirstValue(ClaimTypes.NameIdentifier);
		return int.TryParse(raw, out var userId) ? userId : null;
	}
}
