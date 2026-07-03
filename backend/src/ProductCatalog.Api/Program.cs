using ProductCatalog.Application.Products;
using ProductCatalog.Infrastructure.DummyJson;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddExceptionHandler<ProductCatalog.Api.Middleware.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.Configure<DummyJsonOptions>(builder.Configuration.GetSection(DummyJsonOptions.SectionName));

builder.Services.AddHttpClient<IProductSource, DummyJsonProductSource>((sp, client) =>
{
	var options = builder.Configuration.GetSection(DummyJsonOptions.SectionName).Get<DummyJsonOptions>()
		?? new DummyJsonOptions();
	client.BaseAddress = new Uri(options.BaseUrl.TrimEnd('/') + "/");
});

var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
	options.AddPolicy("Frontend", policy =>
	{
		policy.WithOrigins(allowedOrigins)
			  .AllowAnyHeader()
			  .AllowAnyMethod();
	});
});

var app = builder.Build();

app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("Frontend");
app.UseAuthorization();
app.MapControllers();

app.Run();