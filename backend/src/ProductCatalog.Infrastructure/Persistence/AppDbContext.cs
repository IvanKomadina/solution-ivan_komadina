using Microsoft.EntityFrameworkCore;
using ProductCatalog.Domain.Entities;

namespace ProductCatalog.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
	public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
	{
	}

	public DbSet<Favorite> Favorites => Set<Favorite>();

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<Favorite>(entity =>
		{
			entity.ToTable("Favorites");
			entity.HasKey(x => x.Id);
			entity.Property(x => x.CreatedAtUtc).IsRequired();
			entity.HasIndex(x => new { x.DummyJsonUserId, x.DummyJsonProductId }).IsUnique();
		});
	}
}
