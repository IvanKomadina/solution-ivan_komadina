namespace ProductCatalog.Application.Common;

public class ProductSourceUnavailableException : Exception
{
	public ProductSourceUnavailableException(string message, Exception innerException)
		: base(message, innerException)
	{
	}
}