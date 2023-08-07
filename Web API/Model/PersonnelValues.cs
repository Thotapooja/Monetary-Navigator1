using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class PersonnelValues
    {
        [Key]
        public int PersonnelValueId { get; set; }
        public int PersonnelId { get; set; }
        public int ScenarioId { get; set; }
        public int Year { get; set; }
        public int Month { get; set; }
        public int ValueType { get; set; }
        public int PersonnelValue { get; set; }
        public int Total { get; set; }
    }
}
