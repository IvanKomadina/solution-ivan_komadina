using System.Net.Http.Json;
using System.Text.Json.Serialization;

namespace ProductCatalog.Infrastructure.Auth;

public interface IDummyJsonLoginClient
{
	Task<DummyJsonLoginResult?> LoginAsync(string username, string password, CancellationToken cancellationToken = default);
}

public class DummyJsonLoginClient : IDummyJsonLoginClient
{
	private readonly HttpClient _httpClient;

	public DummyJsonLoginClient(HttpClient httpClient)
	{
		_httpClient = httpClient;
	}

	public async Task<DummyJsonLoginResult?> LoginAsync(string username, string password, CancellationToken cancellationToken = default)
	{
		var response = await _httpClient.PostAsJsonAsync("auth/login", new DummyJsonLoginRequest(username, password), cancellationToken);
		if (!response.IsSuccessStatusCode)
		{
			return null;
		}

		return await response.Content.ReadFromJsonAsync<DummyJsonLoginResult>(cancellationToken: cancellationToken);
	}
}

public sealed record DummyJsonLoginRequest(string Username, string Password);

public sealed class DummyJsonLoginResult
{
	[JsonPropertyName("id")]
	public int Id { get; set; }

	[JsonPropertyName("username")]
	public string Username { get; set; } = string.Empty;

	[JsonPropertyName("email")]
	public string Email { get; set; } = string.Empty;

	[JsonPropertyName("firstName")]
	public string FirstName { get; set; } = string.Empty;

	[JsonPropertyName("lastName")]
	public string LastName { get; set; } = string.Empty;

	[JsonPropertyName("gender")]
	public string? Gender { get; set; }

	[JsonPropertyName("image")]
	public string? Image { get; set; }

	[JsonPropertyName("token")]
	public string Token { get; set; } = string.Empty;
}
