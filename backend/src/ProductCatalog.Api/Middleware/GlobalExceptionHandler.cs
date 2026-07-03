using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Application.Common;

namespace ProductCatalog.Api.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
	private readonly ILogger<GlobalExceptionHandler> _logger;

	public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
	{
		_logger = logger;
	}

	public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
	{
		var (statusCode, title) = exception switch
		{
			ProductSourceUnavailableException => (StatusCodes.Status502BadGateway, "The product data source is currently unavailable."),
			_ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
		};

		_logger.LogError(exception, "Unhandled exception while processing {Method} {Path}",
			httpContext.Request.Method, httpContext.Request.Path);

		httpContext.Response.StatusCode = statusCode;

		await httpContext.Response.WriteAsJsonAsync(new ProblemDetails
		{
			Status = statusCode,
			Title = title
		}, cancellationToken);

		return true;
	}
}