using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class CogsValues
    {
        [Key]
        public int CogsValueId { get; set; }
        public int CogsId { get; set; }
        public int ScenarioId { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int ValueType { get; set; }
        public int CogsValue { get; set; }
        public int Total { get; set; }
    }
}
