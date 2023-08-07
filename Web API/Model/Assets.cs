using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class Assets
    {
        [Key]
        public int AssetId { get; set; }
        public int ScenarioId { get; set; }
        public string OrganisationId { get; set; }
        public string Name { get; set; }
        public int AssetType { get; set; }
        public int NoofUnits { get; set; }
        public int PurchaseYear { get; set; }
        public int PurchaseMonth { get; set; }
        public int CostsperUnit { get; set; }
        public int UsefulLifetime { get; set; }
        public int ResidualValue { get; set; }
        public int DaystoPay { get; set; }
        public string Assumptions { get; set; }
    }
}
