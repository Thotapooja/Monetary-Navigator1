using Microsoft.AspNetCore.Mvc;
using Web_API.Details;
using Web_API.Model;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BalancesheetController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public BalancesheetController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpGet("{orgId}/{scenarioId}")]
        public async Task<IActionResult> GetPersonnelByScenarioandOrganisation(Guid orgId, int scenarioId)
        {
            List<AssetsValues> equipment = new List<AssetsValues>();
            List<AssetsValues> building = new List<AssetsValues>();
            List<AssetsValues> electronics = new List<AssetsValues>();
            List<AssetsValues> others = new List<AssetsValues>();
            var forecastPeriod = _DBContext.Scenario.Where(x => x.ScenarioId == scenarioId).FirstOrDefault().ForecastPeriod;
            var startYear = _DBContext.Scenario.Where(x => x.ScenarioId == scenarioId).FirstOrDefault().StartYear;
            var assetEquipment = _DBContext.Assets.Where(x => x.ScenarioId == scenarioId && x.OrganisationId == orgId.ToString() && x.AssetType == 1).ToList();
            foreach(var asset in assetEquipment)
            {
                var assetValues = _DBContext.AssetsValues.Where(x => x.AssetId == asset.AssetId && x.ScenarioId == scenarioId).ToList();
                foreach(var assetValue  in assetValues)
                {
                    equipment.Add(assetValue);
                }
            }
            var assetbuilding = _DBContext.Assets.Where(x => x.ScenarioId == scenarioId && x.OrganisationId == orgId.ToString() && x.AssetType == 2).ToList();
            foreach (var asset in assetbuilding)
            {
                var assetValues = _DBContext.AssetsValues.Where(x => x.AssetId == asset.AssetId && x.ScenarioId == scenarioId).ToList();
                foreach (var assetValue in assetValues)
                {
                    building.Add(assetValue);
                }
            }
            var assetElectronics = _DBContext.Assets.Where(x => x.ScenarioId == scenarioId && x.OrganisationId == orgId.ToString() && x.AssetType == 3).ToList();
            foreach (var asset in assetbuilding)
            {
                var assetValues = _DBContext.AssetsValues.Where(x => x.AssetId == asset.AssetId && x.ScenarioId == scenarioId).ToList();
                foreach (var assetValue in assetValues)
                {
                    electronics.Add(assetValue);
                }
            }
            var assetOthers = _DBContext.Assets.Where(x => x.ScenarioId == scenarioId && x.OrganisationId == orgId.ToString() && x.AssetType == 4).ToList();
            foreach (var asset in assetbuilding)
            {
                var assetValues = _DBContext.AssetsValues.Where(x => x.AssetId == asset.AssetId && x.ScenarioId == scenarioId).ToList();
                foreach (var assetValue in assetValues)
                {
                    others.Add(assetValue);
                }
            }
            List<Income> income = new List<Income>();
            for (int i = startYear; i < startYear + forecastPeriod; i++)
            {
                for (int j = 1; j <= 12; j++)
                {
                    var totalSales = 0;
                    var equi = equipment.Where(x => x.Year == i && x.Month == j).ToList();
                    foreach (var k in equi)
                    {
                        totalSales = totalSales + k.AssetValue;
                    }
                    income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = totalSales, Type = "Equipment" });
                }
                for (int j = 1; j <= 12; j++)
                {
                    var totalSales = 0;
                    var build = building.Where(x => x.Year == i && x.Month == j).ToList();
                    foreach (var k in build)
                    {
                        totalSales = totalSales + k.AssetValue;
                    }
                    income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = totalSales, Type = "Building" });
                }
                for (int j = 1; j <= 12; j++)
                {
                    var totalSales = 0;
                    var ele = electronics.Where(x => x.Year == i && x.Month == j).ToList();
                    foreach (var k in ele)
                    {
                        totalSales = totalSales + k.AssetValue;
                    }
                    income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = totalSales, Type = "Electronics" });
                }
                for (int j = 1; j <= 12; j++)
                {
                    var totalSales = 0;
                    var build = others.Where(x => x.Year == i && x.Month == j).ToList();
                    foreach (var k in build)
                    {
                        totalSales = totalSales + k.AssetValue;
                    }
                    income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = totalSales, Type = "Others" });
                }
            }
            List<FinancingValues> financingValues = new List<FinancingValues>();
            var loans = _DBContext.Financing.Where(x=> x.ScenarioId == scenarioId && x.OrganisationId == orgId.ToString() && x.FinancingType == 2).ToList();
            foreach(var k in loans)
            {
                var loanValues = _DBContext.FinancingValues.Where(x=> x.FinancingId == k.FinancingId && x.ScenarioId == scenarioId).ToList();
                foreach(var  v in loanValues)
                {
                    financingValues.Add(v);
                }
            }
            for (int i = startYear; i < startYear + forecastPeriod; i++)
            {
                for (int j = 1; j <= 12; j++)
                {
                    var totalSales = 0;
                    var equi = financingValues.Where(x => x.Year == i && x.Month == j).ToList();
                    foreach (var k in equi)
                    {
                        totalSales = totalSales + k.FinancingValue;
                    }
                    income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = totalSales, Type = "Loan" });
                }
            }
            for(int i = startYear;i < startYear + forecastPeriod;i++)
            {
                for (int j = 1; j <= 12; j++)
                {
                    var total = 0;
                    var equi = income.Where(x => x.ScenarioId == scenarioId && x.Year == i && x.Month == j && x.Type == "Equipment").FirstOrDefault().Values;
                    var build = income.Where(x => x.ScenarioId == scenarioId && x.Year == i && x.Month == j && x.Type == "Building").FirstOrDefault().Values;
                    var elec = income.Where(x => x.ScenarioId == scenarioId && x.Year == i && x.Month == j && x.Type == "Building").FirstOrDefault().Values;
                    var otherAsset = income.Where(x => x.ScenarioId == scenarioId && x.Year == i && x.Month == j && x.Type == "Building").FirstOrDefault().Values;
                    total = equi + build + elec + otherAsset;
                    income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = total, Type = "Total" });
                }
            }

            return Ok(income);
        }
    }
}
