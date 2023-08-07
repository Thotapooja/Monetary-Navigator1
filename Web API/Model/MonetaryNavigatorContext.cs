using Microsoft.EntityFrameworkCore;
using System.Data;
namespace Web_API.Model
{
    public class MonetaryNavigatorContext:DbContext
    {
        public MonetaryNavigatorContext(DbContextOptions<MonetaryNavigatorContext> dbContextOptions)
            : base(dbContextOptions)
        {

        }
        public DbSet<Role> Role { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<Organisation> Organisation { get; set; }
        public DbSet<Scenario> Scenario { get; set; }
        public DbSet<Revenue> Revenue { get; set; }
        public DbSet<RevenueValues> RevenueValues { get; set; }
        public DbSet<OtherRevenue> OtherRevenue { get; set; }
        public DbSet<OtherRevenueValues> OtherRevenueValues { get; set; }
        public DbSet<Cogs> Cogs { get; set; }
        public DbSet<CogsValues> CogsValues { get; set; }
        public DbSet<Personnel> Personnel { get; set; }
        public DbSet<PersonnelValues> PersonnelValues { get; set; }
        public DbSet<Assets> Assets { get; set; }
        public DbSet<AssetsValues> AssetsValues { get; set; }
        public DbSet<Financing> Financing { get; set; }
        public DbSet<FinancingValues>  FinancingValues { get;set; }
    }
}
