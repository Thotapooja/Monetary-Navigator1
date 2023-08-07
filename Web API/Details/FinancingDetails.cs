using System.ComponentModel.DataAnnotations;
using Web_API.Model;

namespace Web_API.Details
{
    public class FinancingDetails
    {
        [Key]
        public int FinancingId { get; set; }
        public int ScenarioId { get; set; }
        public string OrganisationId { get; set; }
        public int FinancingType { get; set; }
        public string Name { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int FinancingAmount { get; set; }
        public string Assumptions { get; set; }
        public int InterestPerYear { get; set; }
        public int Payback { get; set; }
        public int FinancingPeriodMonths { get; set; }
        
        public List<FinancingValues> FinancingValues { get; set; }
        public Boolean Disable { get;set; }
    }
}
