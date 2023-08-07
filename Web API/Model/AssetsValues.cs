using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class AssetsValues
    {
        [Key]
        public int AssetValueId { get;set; }
        public int AssetId { get;set; }
        public int ScenarioId { get;set; }
        public int Year { get;set; }
        public int Month {  get;set; }
        public int AssetValue { get;set; }
        public int Total { get;set; }
        public int ValueType {  get;set; }
    }
}
