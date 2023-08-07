using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class Revenue
    {
        [Key]
        public int RevenueId { get; set; }
        public int ScenarioId { get; set; }
        public string OrganisationId { get; set; }
        public string RevenueCategory { get; set; }
        public string RevenueName { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int ClientsInStartMonth { get; set; }
        public int UnitsSoldperclientpermonth { get;set; }
        public string FrequencyClientIncr { get; set; }
        public int PerClientIncr { get; set; }
        public int DaysPaid { get;set; }
        public int PricePerUnit { get; set; }
        public string Assumptions { get; set; }
        
    }
}
