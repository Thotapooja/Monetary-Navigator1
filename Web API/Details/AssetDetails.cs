using System.ComponentModel.DataAnnotations;
using Web_API.Model;

namespace Web_API.Details
{
    public class AssetDetails
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
        public Boolean Disable { get; set; }
        public List<AssetsValues> AssetValues { get; set; }
    }
}
