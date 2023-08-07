using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class RevenueValues
    {
        [Key]
        public int RevenueValueId { get; set; }
        public int RevenueId { get; set; }
        public int ScenarioId { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int ValueType { get; set; }
        public int RevenueValue { get; set; }
        public int Total { get;set; }

    }
}
