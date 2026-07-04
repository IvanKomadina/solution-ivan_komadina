namespace ProductCatalog.Application.Common;

public class ServiceResponse<T>
{
	public T? Data { get; set; }
	public bool Success { get; set; } = true;
	public string? Message { get; set; }
	public int StatusCode { get; set; }

	public static ServiceResponse<T> Ok(T? data, string? message = null, int statusCode = 200)
	{
		return new ServiceResponse<T> { Data = data, Success = true, Message = message, StatusCode = statusCode };
	}

	public static ServiceResponse<T> Fail(string message, int statusCode = 400)
	{
		return new ServiceResponse<T> { Data = default, Success = false, Message = message, StatusCode = statusCode };
	}

	public static ServiceResponse<T> Error(string message, int statusCode = 500)
	{
		return new ServiceResponse<T> { Success = false, Message = message, StatusCode = statusCode };
	}
}