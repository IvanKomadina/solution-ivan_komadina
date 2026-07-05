using ProductCatalog.Application.Products;
using ProductCatalog.Infrastructure.Caching;
using ProductCatalog.Infrastructure.DummyJson;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
	options.SwaggerDoc("v1", new Microsoft.OpenApi.OpenApiInfo
	{
		Title = "Product Catalog API",
		Version = "v1",
		Description = "Middleware REST API that fetches products from DummyJSON and exposes them to the frontend SPA."
	});

	var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
	var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
	if (File.Exists(xmlPath))
	{
		options.IncludeXmlComments(xmlPath);
	}
});

builder.Services.AddExceptionHandler<ProductCatalog.Api.Middleware.GlobalExceptionHandler>();
builder.Services.AddProblemDetails();
builder.Services.AddMemoryCache();

builder.Services.Configure<DummyJsonOptions>(builder.Configuration.GetSection(DummyJsonOptions.SectionName));

builder.Services.AddHttpClient<IDummyJsonProductApi, DummyJsonProductApi>((sp, client) =>
{
	var options = builder.Configuration.GetSection(DummyJsonOptions.SectionName).Get<DummyJsonOptions>()
		?? new DummyJsonOptions();
	client.BaseAddress = new Uri(options.BaseUrl.TrimEnd('/') + "/");
});

builder.Services.AddScoped<IProductSource, CachedProductSource>();

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
