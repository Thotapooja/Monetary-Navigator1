using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class FinancingValues
    {
        [Key]
        public int FinancingValueId { get; set; }
        public int FinancingId { get; set; }
        public int ScenarioId { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int FinancingValue { get; set; }
        public int Total { get; set; }
        public int ValueType { get; set; }
    }
}
