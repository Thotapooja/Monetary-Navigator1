using Microsoft.AspNetCore.Mvc;
using Web_API.Details;
using Web_API.Model;
using Web_API.ValueType;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IncomeController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public IncomeController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpGet("{orgId}/{scenarioId}")]
        public async Task<IActionResult> GetPersonnelByScenarioandOrganisation(Guid orgId, int scenarioId)
        {
            try
            {
                List<RevenueValues> sales = new List<RevenueValues>();
                List<OtherRevenueValues> others = new List<OtherRevenueValues>();
                List<CogsValues> cogs = new List<CogsValues>();
                List<Income> income = new List<Income>();
                var revenues = _DBContext.Revenue.Where(x => x.ScenarioId == scenarioId && x.OrganisationId == orgId.ToString()).ToList();
                foreach(var revenue in revenues)
                {
                    var revenueValues = _DBContext.RevenueValues.Where(x => x.RevenueId == revenue.RevenueId && x.ScenarioId == revenue.ScenarioId && x.ValueType == 8).ToList();
                    foreach(var revenueValue in revenueValues)
                    {
                        sales.Add(revenueValue);
                    }
                }
                var otherRevenues = _DBContext.OtherRevenue.Where(x => x.ScenarioId == scenarioId && x.OrganisationId == orgId.ToString()).ToList();
                foreach (var otherRevenue in otherRevenues)
                {
                    var revenueValues = _DBContext.OtherRevenueValues.Where(x => x.OtherRevenueId == otherRevenue.OtherRevenueId && x.ValueType == (int)OtherRevenueValueType.TotalRevenue).ToList();
                    foreach (var revenueValue in revenueValues)
                    {
                        others.Add(revenueValue);
                    }
                }
                var cogsList = _DBContext.Cogs.Where(x => x.ScenarioId == scenarioId && x.OrganisationId == orgId.ToString()).ToList();
                foreach (var cog in cogsList)
                {
                    var cogsValues = _DBContext.CogsValues.Where(x => x.CogsId == cog.CogsId && x.ValueType == (int)CogsValueType.TotalCogs).ToList();
                    foreach (var cogsValue in cogsValues)
                    {
                        cogs.Add(cogsValue);
                    }
                }
                List<Income> income1 = new List<Income>();
                var forecastPeriod = _DBContext.Scenario.Where(x => x.ScenarioId == scenarioId).FirstOrDefault().ForecastPeriod;
                var startYear = _DBContext.Scenario.Where(x => x.ScenarioId == scenarioId).FirstOrDefault().StartYear;
                for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    for (int j = 1; j <= 12; j++)
                    {
                        var totalSales = 0;
                        var othersTotal = others.Where(x => x.Year == i && x.Month == j).ToList();
                        var revenueTotal = sales.Where(x => x.Year == i && x.Month == j).ToList();
                        foreach (var k in othersTotal)
                        {
                            totalSales = totalSales + k.RevenueValue;
                        }
                        foreach(var k in revenueTotal)
                        {
                            totalSales = totalSales + k.RevenueValue;
                        }
                        income1.Add(new Income {Year = i, Month = j, ScenarioId = scenarioId, Values = totalSales, Type = "Sales" });
                        income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = totalSales, Type = "Sales" });
                    }
                }
                for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    for (int j = 1; j <= 12; j++)
                    {
                        var totalCogs = 0;
                        var cogsTotal = cogs.Where(x => x.Year == i && x.Month == j).ToList();
                        foreach (var k in cogsTotal)
                        {
                            totalCogs = totalCogs + k.CogsValue;
                        }
                        income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = totalCogs, Type = "Cogs" });
                    }
                }
                for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    for (int j = 1; j <= 12; j++)
                    {
                        var grossMargin = 0;
                        var incomeSales = income.Where(x => x.Year == i && x.Month == j && x.Type == "Sales").FirstOrDefault();
                        var incomeCogs = income.Where(x => x.Year == i && x.Month == j && x.Type == "Cogs").FirstOrDefault();
                        grossMargin = incomeSales.Values - incomeCogs.Values;
                        income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = grossMargin, Type = "Gross Margin" });
                    }
                }
                for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    for (int j = 1; j <= 12; j++)
                    {
                        var grossMargin = 0;
                        var incomeSales = income.Where(x => x.Year == i && x.Month == j && x.Type == "Sales").FirstOrDefault();
                        var incomeGrossMargin = income.Where(x => x.Year == i && x.Month == j && x.Type == "Gross Margin").FirstOrDefault();
                        if(incomeSales.Values == 0)
                        {
                            income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = 0, Type = "Gross Margin %" });
                        }
                        else
                        {
                            grossMargin = Convert.ToInt32(Math.Round(Convert.ToDecimal((incomeGrossMargin.Values / incomeSales.Values) * 100)));
                            income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = grossMargin, Type = "Gross Margin %" });
                        }
                        

                    }
                }
                List<FinancingValues> interest = new List<FinancingValues>();
                var financings = _DBContext.Financing.Where(x=> x.ScenarioId == scenarioId && x.OrganisationId == orgId.ToString() && x.FinancingType == 2).ToList();
                foreach(var financing in financings)
                {
                    var financingValues = _DBContext.FinancingValues.Where(x => x.FinancingId == financing.FinancingId && x.ScenarioId == financing.ScenarioId && x.ValueType == (int)Loan.InterestRate).ToList();
                    foreach(var financingValue  in financingValues)
                    {
                        interest.Add(financingValue);
                    }
                }
                for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    for (int j = 1; j <= 12; j++)
                    {
                        var totalinterest = 0;
                        var othersTotal = interest.Where(x => x.Year == i && x.Month == j).ToList();
                        foreach (var k in othersTotal)
                        {
                            totalinterest = totalinterest + k.FinancingValue;
                        }
                        income.Add(new Income { Year = i, Month = j, ScenarioId = scenarioId, Values = totalinterest, Type = "Interest" });
                    }
                }
                return Ok(income);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
    }
}
