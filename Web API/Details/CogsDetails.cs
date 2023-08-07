using System.ComponentModel.DataAnnotations;
using Web_API.Model;

namespace Web_API.Details
{
    public class CogsDetails
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
        public Boolean Disable { get; set; }
        public List<CogsValues> CogsValues { get; set; }
    }
}
