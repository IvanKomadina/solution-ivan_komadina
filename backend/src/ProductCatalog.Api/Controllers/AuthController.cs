using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Application.Auth;
using ProductCatalog.Application.Auth.Dtos;
using ProductCatalog.Application.Common;

namespace ProductCatalog.Api.Controllers;

[Route("api/auth")]
public class AuthController : BaseController
{
	private readonly IAuthService _authService;

	public AuthController(IAuthService authService)
	{
		_authService = authService;
	}

	[HttpPost("login")]
	public async Task<ActionResult<ServiceResponse<LoginResponseDto>>> Login([FromBody] LoginRequestDto request, CancellationToken cancellationToken = default)
	{
		var response = await _authService.LoginAsync(request, cancellationToken);
		return HandleResponse(response);
	}
}
