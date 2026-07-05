using ProductCatalog.Application.Auth;
using ProductCatalog.Application.Auth.Dtos;
using ProductCatalog.Application.Common;
using ProductCatalog.Infrastructure.Persistence;

namespace ProductCatalog.Infrastructure.Auth;

public class AuthService : IAuthService
{
	private readonly IDummyJsonLoginClient _loginClient;
	private readonly IJwtTokenService _tokenService;

	public AuthService(IDummyJsonLoginClient loginClient, IJwtTokenService tokenService)
	{
		_loginClient = loginClient;
		_tokenService = tokenService;
	}

	public async Task<ServiceResponse<LoginResponseDto>> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default)
	{
		var result = await _loginClient.LoginAsync(request.Username, request.Password, cancellationToken);
		if (result is null)
		{
			return ServiceResponse<LoginResponseDto>.Fail("Invalid username or password.", 401);
		}

		var token = _tokenService.CreateToken(result);
		return ServiceResponse<LoginResponseDto>.Ok(new LoginResponseDto
		{
			Token = token,
			DummyJsonUserId = result.Id,
			Username = result.Username,
			Email = result.Email,
			FirstName = result.FirstName,
			LastName = result.LastName,
			AvatarUrl = result.Image
		});
	}
}
