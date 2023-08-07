using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class OtherRevenue
    {
        [Key]
        public int OtherRevenueId { get; set; } 
        public int ScenarioId { get; set; }
        public string OrganisationId { get; set; }
        public string RevenueCategory { get; set; }
        public string RevenueName { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int RevenueinStartMonth {  get; set; }
        public string FrequencyClientIncr { get;set; }
        public int PerClientIncr { get; set; }
        public int DaysPaid { get; set; }
        public string Assumptions { get; set; }
    }
}
