namespace ProductCatalog.Infrastructure.DummyJson.Dtos;

public class DummyJsonProductListResponseDto
{
	public List<DummyJsonProductDto> Products { get; set; } = new();
	public int Total { get; set; }
	public int Skip { get; set; }
	public int Limit { get; set; }
}