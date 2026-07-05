using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ProductCatalog.Infrastructure.Auth;

public sealed class JwtOptions
{
	public const string SectionName = "Jwt";
	public string Issuer { get; set; } = string.Empty;
	public string Audience { get; set; } = string.Empty;
	public string SigningKey { get; set; } = string.Empty;
	public int ExpirationMinutes { get; set; } = 120;
}

public interface IJwtTokenService
{
	string CreateToken(DummyJsonLoginResult user);
}

public class JwtTokenService : IJwtTokenService
{
	private readonly JwtOptions _options;

	public JwtTokenService(IOptions<JwtOptions> options)
	{
		_options = options.Value;
	}

	public string CreateToken(DummyJsonLoginResult user)
	{
		var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SigningKey));
		var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
		var claims = new List<Claim>
		{
			new(ClaimTypes.NameIdentifier, user.Id.ToString()),
			new(ClaimTypes.Name, user.Username),
			new(ClaimTypes.Email, user.Email),
			new("dummyjson_user_id", user.Id.ToString()),
			new("username", user.Username),
			new("email", user.Email),
			new("firstName", user.FirstName),
			new("lastName", user.LastName)
		};

		var token = new JwtSecurityToken(
			issuer: _options.Issuer,
			audience: _options.Audience,
			claims: claims,
			notBefore: DateTime.UtcNow,
			expires: DateTime.UtcNow.AddMinutes(_options.ExpirationMinutes),
			signingCredentials: credentials);

		return new JwtSecurityTokenHandler().WriteToken(token);
	}
}
