using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class Scenario
    {
        [Key]
        public int ScenarioId { get; set; }
        public string ScenarioName { get; set; }
        public string OrganisationId { get; set;}
        public int Tax { get; set; }
        public int StartYear { get; set; }
        public int ForecastPeriod { get; set; }
        public int MarketSize { get; set; }
        public int SAM { get; set; }
        public int TAM { get; set; }
        public int SOM { get; set; }
    }
}
