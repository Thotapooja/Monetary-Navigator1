using Microsoft.AspNetCore.Mvc;
using Web_API.Details;
using Web_API.Model;
using Web_API.ValueType;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AssetsController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public AssetsController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpGet("{orgId}/{scenarioId}")]
        public List<AssetDetails> GetPersonnelByScenarioandOrganisation(Guid orgId, int scenarioId)
        {
            try
            {
                List<AssetDetails> assetDetails = new List<AssetDetails>();
                var orgId1 = Convert.ToString(orgId);
                var assets = _DBContext.Assets.Where(x => x.OrganisationId == orgId1 && x.ScenarioId == scenarioId).ToList();
                foreach (var asset in assets)
                {
                    AssetDetails assetDetail = new AssetDetails();
                    var assetValues = _DBContext.AssetsValues.Where(x => x.ScenarioId == asset.ScenarioId && x.AssetId == asset.AssetId).ToList();
                    assetDetail.AssetId = asset.AssetId;
                    assetDetail.ScenarioId = asset.ScenarioId;
                    assetDetail.OrganisationId = asset.OrganisationId;
                    assetDetail.Name = asset.Name;
                    assetDetail.AssetType = asset.AssetType;
                    assetDetail.NoofUnits = asset.NoofUnits;
                    assetDetail.PurchaseYear = asset.PurchaseYear;
                    assetDetail.PurchaseMonth = asset.PurchaseMonth;    
                    assetDetail.CostsperUnit = asset.CostsperUnit;
                    assetDetail.UsefulLifetime = asset.UsefulLifetime;
                    assetDetail.ResidualValue = asset.ResidualValue;
                    assetDetail.DaystoPay = asset.DaystoPay;
                    assetDetail.AssetValues = assetValues;
                    assetDetail.Disable = false;
                    assetDetails.Add(assetDetail);
                }
                return assetDetails;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
        [HttpPost]
        public async Task<IActionResult> CreatePersonnel([FromBody] Assets assets)
        {
            try
            {
                var assetsList = _DBContext.Assets.ToList();
                if (assetsList.Count == 0)
                {
                    assets.AssetId = 1;
                }
                else
                {
                    assets.AssetId = assetsList[assetsList.Count - 1].AssetId + 1;
                }

                await _DBContext.Assets.AddAsync(assets);
                await _DBContext.SaveChangesAsync();
                AssetsValues assetValue = new AssetsValues();
                assetValue.AssetId = assets.AssetId;
                assetValue.ScenarioId = assets.ScenarioId;
                var forecastPeriod = _DBContext.Scenario.Where(x => x.ScenarioId == assetValue.ScenarioId).FirstOrDefault().ForecastPeriod;
                var startYear = _DBContext.Scenario.Where(x => x.ScenarioId == assetValue.ScenarioId).FirstOrDefault().StartYear;
                for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    for (int j = 1; j <= 12; j++)
                    {
                        if (i < assets.PurchaseYear || i == assets.PurchaseYear && j < assets.PurchaseMonth)
                        {
                            assetValue.Year = i;
                            assetValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(AssetValueType)))
                            {
                                var assetValuesList = _DBContext.AssetsValues.ToList();
                                if (assetValuesList.Count == 0)
                                {
                                    assetValue.AssetValueId = 1;
                                }
                                else
                                {
                                    assetValue.AssetValueId = assetValuesList[assetValuesList.Count - 1].AssetValueId + 1;
                                }
                                assetValue.ValueType = valueType;
                                assetValue.AssetValue = 0;
                                assetValue.Total = 0;
                                await _DBContext.AssetsValues.AddAsync(assetValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                        else if (i == assets.PurchaseYear && j >= assets.PurchaseMonth)
                        {
                            if(j == assets.PurchaseMonth)
                            {
                                assetValue.Year = i;
                                assetValue.Month = j;
                                foreach (int valueType in Enum.GetValues(typeof(AssetValueType)))
                                {
                                    var assetValuesList = _DBContext.AssetsValues.ToList();
                                    if (assetValuesList.Count == 0)
                                    {
                                        assetValue.AssetValueId = 1;
                                    }
                                    else
                                    {
                                        assetValue.AssetValueId = assetValuesList[assetValuesList.Count - 1].AssetValueId + 1;
                                    }
                                    //assetValue.AssetValue = valueType == 1 ? assets.NoofUnits : valueType == 2 ? assets.CostsperUnit : valueType == 5 ? assets.DaystoPay : valueType == 6 ? 0 : valueType == 7 ? 0 : 0;
                                    if (valueType == 1)
                                    {
                                        assetValue.AssetValue = assets.NoofUnits;
                                    }
                                    if (valueType == 2)
                                    {
                                        assetValue.AssetValue = assets.CostsperUnit;
                                    }
                                    if (valueType == 5)
                                    {
                                        assetValue.AssetValue = assets.DaystoPay;
                                    }
                                    if (valueType == 6)
                                    {
                                        assetValue.AssetValue = 0;
                                    }
                                    if (valueType == 7)
                                    {
                                        assetValue.AssetValue = 0;
                                    }
                                    if (valueType == 3)
                                    {
                                        var noofUnits = _DBContext.AssetsValues.Where(x => x.Year == i && x.Month == j && x.ValueType ==(int)AssetValueType.NoofUnits).FirstOrDefault().AssetValue;
                                        var costsperUnit = _DBContext.AssetsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)AssetValueType.CostsperUnit).FirstOrDefault().AssetValue;
                                        assetValue.AssetValue = noofUnits * costsperUnit;
                                    }
                                    if (valueType == 4)
                                    {
                                        var totalCosts = _DBContext.AssetsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)AssetValueType.TotalCosts).FirstOrDefault().AssetValue;
                                        var depreciation = (totalCosts - (assets.ResidualValue * assets.NoofUnits)) / assets.UsefulLifetime;
                                        assetValue.AssetValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(depreciation)));

                                    }
                                    if (valueType == 8)
                                    {
                                        var totalCosts = _DBContext.AssetsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)AssetValueType.TotalCosts).FirstOrDefault().AssetValue;
                                        var depreciation = _DBContext.AssetsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)AssetValueType.Depreciation).FirstOrDefault().AssetValue;
                                        assetValue.AssetValue = totalCosts + depreciation;
                                    }
                                    assetValue.ValueType = valueType;
                                    assetValue.Total = 0;
                                    _DBContext.AssetsValues.Add(assetValue);
                                    _DBContext.SaveChanges();
                                }
                                
                            }
                            if (j > assets.PurchaseMonth)
                            {
                                assetValue.Year = i;
                                assetValue.Month = j;
                                foreach (int valueType in Enum.GetValues(typeof(AssetValueType)))
                                {
                                    var assetValuesList = _DBContext.AssetsValues.ToList();
                                    if (assetValuesList.Count == 0)
                                    {
                                        assetValue.AssetValueId = 1;
                                    }
                                    else
                                    {
                                        assetValue.AssetValueId = assetValuesList[assetValuesList.Count - 1].AssetValueId + 1;
                                    }
                                    assetValue.ValueType = valueType;
                                    assetValue.AssetValue = valueType == 1 ? 0 : valueType == 2 ? 0 : valueType == 3 ? 0 : valueType == 5 ? assets.DaystoPay : valueType == 6 ? 0 : valueType == 7 ? 0 : 0;
                                    if(valueType == 4)
                                    {
                                        assetValue.AssetValue = _DBContext.AssetsValues.Where(x => x.Year == i && x.Month == j - 1 && x.ValueType == 4).FirstOrDefault().AssetValue;
                                    }
                                    if(valueType == 8)
                                    {
                                        var carryingAmount = _DBContext.AssetsValues.Where(x => x.Year == i && x.Month == j - 1 && x.ValueType == 8).FirstOrDefault().AssetValue;
                                        var depreciation = _DBContext.AssetsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == 4).FirstOrDefault().AssetValue;
                                        assetValue.AssetValue = carryingAmount + depreciation;
                                    }
                                    assetValue.Total = 0;
                                    await _DBContext.AssetsValues.AddAsync(assetValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                        }
                        else if(i > assets.PurchaseYear)
                        {
                            assetValue.Year = i;
                            assetValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(AssetValueType)))
                            {
                                var assetValuesList = _DBContext.AssetsValues.ToList();
                                if (assetValuesList.Count == 0)
                                {
                                    assetValue.AssetValueId = 1;
                                }
                                else
                                {
                                    assetValue.AssetValueId = assetValuesList[assetValuesList.Count - 1].AssetValueId + 1;
                                }
                                assetValue.AssetValue = valueType == 1 ? 0 : valueType == 2 ? 0 : valueType == 3 ? 0 : valueType == 5 ? assets.DaystoPay : valueType == 6 ? 0 : valueType == 7 ? 0 : 0;
                                if (valueType == 4)
                                {
                                    if(j == 1)
                                    {
                                        assetValue.AssetValue = _DBContext.AssetsValues.Where(x => x.Year == i - 1 && x.Month == 12 && x.ValueType == 4).FirstOrDefault().AssetValue;
                                    }
                                    else
                                    {
                                        assetValue.AssetValue = _DBContext.AssetsValues.Where(x => x.Year == i && x.Month == j - 1 && x.ValueType == 4).FirstOrDefault().AssetValue;
                                    }
                                }
                                if (valueType == 8)
                                {
                                    var carryingAmount = 0;
                                    if (j == 1)
                                    {
                                        carryingAmount = _DBContext.AssetsValues.Where(x => x.Year == i - 1 && x.Month == 12 && x.ValueType == 8).FirstOrDefault().AssetValue;
                                    }
                                    else
                                    {
                                        carryingAmount = _DBContext.AssetsValues.Where(x => x.Year == i && x.Month == j - 1 && x.ValueType == 8).FirstOrDefault().AssetValue;
                                    }
                                    var depreciation = _DBContext.AssetsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == 4).FirstOrDefault().AssetValue;
                                    assetValue.AssetValue = carryingAmount + depreciation;
                                }
                                assetValue.ValueType = valueType;
                                assetValue.Total = 0;
                                await _DBContext.AssetsValues.AddAsync(assetValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                    }
                }
                return Ok(assets);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }

        }
    }
}
