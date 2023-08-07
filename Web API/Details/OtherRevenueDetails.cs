using Microsoft.AspNetCore.Cors;
using Web_API.Model;

namespace Web_API.Details
{
    public class OtherRevenueDetails
    {
        public int OtherRevenueId { get; set; }
        public int ScenarioId { get; set; }
        public int OrganisationId { get; set; }
        public string ReveneueCategory { get; set; }
        public string RevenueName { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int RevenueinStartMonth { get; set; }
        public string FrequencyClientIncr { get; set; }
        public int PerClientIncr { get; set; }
        public int DaysPaid { get; set; }
        public string Assumptions { get; set; }
        public List<OtherRevenueValues> OtherRevenueValues { get; set; }
        public Boolean Disable { get; set; }
    }
}
