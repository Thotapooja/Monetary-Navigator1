using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class Personnel
    {
        [Key]
        public int PersonnelId { get; set; }
        public int ScenarioId { get; set; }
        public string OrganisationId { get; set; }
        public string Position { get; set; }
        public int PersonnelType { get; set; }
        public int NoofFTEs { get; set; }
        public int StartYear { get; set; }
        public int StartMonth { get; set; }
        public int GrossSalary { get; set; }
        public int PerSalaryIncrease { get; set; }
        public int AdditionalEmployeeCosts { get; set; }
        public string Assumptions { get; set; }
    }
}
