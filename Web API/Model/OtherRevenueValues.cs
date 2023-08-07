using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class OtherRevenueValues
    {
        [Key]
        public int OtherRevenueValueId { get; set; }
        public int OtherRevenueId { get; set; }
        public int ScenarioId { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int ValueType { get; set; }
        public int RevenueValue { get; set; }
        public int Total { get; set; }
    }
}
