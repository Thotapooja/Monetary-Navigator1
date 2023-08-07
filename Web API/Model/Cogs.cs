using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class Cogs
    {
        [Key]
        public int CogsId { get; set; }
        public int ScenarioId { get; set; }
        public string OrganisationId { get; set; }
        public int RevenueId { get; set; }
        public string Name { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int CostsinStartMonth { get; set; }
        public int MonthlyCostChange { get; set; }
        public int DaystoPay { get; set; }
        public int InventoryDays { get; set; }
        public string Assumptions { get; set; }
    }
}
