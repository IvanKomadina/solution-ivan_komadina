using ProductCatalog.Application.Common;
using ProductCatalog.Application.Auth.Dtos;

namespace ProductCatalog.Application.Auth;

public interface IAuthService
{
	Task<ServiceResponse<LoginResponseDto>> LoginAsync(LoginRequestDto request, CancellationToken cancellationToken = default);
}
