using Microsoft.AspNetCore.Mvc;
using ProductCatalog.Application.Common;

namespace ProductCatalog.Api.Controllers;

[ApiController]
public abstract class BaseController : ControllerBase
{
	protected ActionResult<T> HandleResponse<T>(ServiceResponse<T> response)
	{
		if (response is null)
		{
			return StatusCode(500, "Null response");
		}

		return StatusCode(response.StatusCode, response);
	}

	protected ActionResult<TResult> HandleResponse<T, TResult>(
		ServiceResponse<T> response,
		Func<T, TResult> transform)
	{
		if (response is null)
		{
			return StatusCode(500, "Null response");
		}

		if (!response.Success)
		{
			return StatusCode(response.StatusCode, response);
		}

		var newData = transform(response.Data!);
		var shaped = ServiceResponse<TResult>.Ok(newData, response.Message, response.StatusCode);
		return StatusCode(response.StatusCode, shaped);
	}
}