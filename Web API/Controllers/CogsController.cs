using Microsoft.AspNetCore.Mvc;
using Web_API.Details;
using Web_API.Model;
using Web_API.ValueType;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CogsController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public CogsController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpGet("{orgId}/{scenarioId}")]
        public List<CogsDetails> GetCogsByScenarioandOrganisation(Guid orgId, int scenarioId)
        {
            try
            {
                List<CogsDetails> cogsDetails = new List<CogsDetails>();
                var orgId1 = Convert.ToString(orgId);
                var cogs = _DBContext.Cogs.Where(x => x.OrganisationId == orgId1 && x.ScenarioId == scenarioId).ToList();
                foreach (var cog in cogs)
                {
                    CogsDetails cogsDetail =  new CogsDetails();
                    var cogsValues = _DBContext.CogsValues.Where(x => x.ScenarioId == cog.ScenarioId && x.CogsId == cog.CogsId).ToList();
                    cogsDetail.CogsId = cog.CogsId;
                    cogsDetail.ScenarioId = cog.ScenarioId;
                    cogsDetail.OrganisationId = cog.OrganisationId;
                    cogsDetail.Assumptions = cog.Assumptions;
                    cogsDetail.StartMonth = cog.StartMonth;
                    cogsDetail.CostsinStartMonth = cog.CostsinStartMonth;
                    cogsDetail.StartYear = cog.StartYear;
                    cogsDetail.MonthlyCostChange = cog.MonthlyCostChange;
                    cogsDetail.RevenueId = cog.RevenueId;
                    cogsDetail.Name = cog.Name;
                    cogsDetail.DaystoPay = cog.DaystoPay;
                    cogsDetail.InventoryDays = cog.InventoryDays;
                    cogsDetail.Disable = false;
                    cogsDetail.CogsValues = cogsValues;
                    cogsDetails.Add(cogsDetail);
                }
                return cogsDetails;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
        [HttpPost]
        public async Task<IActionResult> CreateCogs([FromBody] Cogs cogs)
        {
            try
            {
                var CogsList = _DBContext.Cogs.ToList();
                if (CogsList.Count == 0)
                {
                    cogs.CogsId = 1;
                }
                else
                {
                    cogs.CogsId = CogsList[CogsList.Count - 1].CogsId + 1;
                }

                await _DBContext.Cogs.AddAsync(cogs);
                await _DBContext.SaveChangesAsync();
                CogsValues cogsValue = new CogsValues();
                //List<RevenueValues> createRevenueValues = new List<RevenueValues>();
                cogsValue.CogsId = cogs.CogsId;
                cogsValue.ScenarioId = cogs.ScenarioId;
                var forecastPeriod = _DBContext.Scenario.Where(x => x.ScenarioId == cogs.ScenarioId).FirstOrDefault().ForecastPeriod;
                var startYear = _DBContext.Scenario.Where(x => x.ScenarioId == cogs.ScenarioId).FirstOrDefault().StartYear;

                for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    for (int j = 1; j <= 12; j++)
                    {
                        if (i < cogs.StartYear)
                        {
                            cogsValue.Year = i;
                            cogsValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(CogsValueType)))
                            {
                                var CogsValuesList = _DBContext.CogsValues.ToList();
                                if (CogsValuesList.Count == 0)
                                {
                                    cogsValue.CogsValueId = 1;
                                }
                                else
                                {
                                    cogsValue.CogsValueId = CogsValuesList[CogsValuesList.Count - 1].CogsValueId + 1;
                                }
                                cogsValue.ValueType = valueType;
                                cogsValue.CogsValue = 0;
                                cogsValue.Total = 0;
                                await _DBContext.CogsValues.AddAsync(cogsValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                        else if (i == cogs.StartYear && j < cogs.StartMonth)
                        {
                            cogsValue.Year = i;
                            cogsValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(CogsValueType)))
                            {
                                var cogsValuesList = _DBContext.CogsValues.ToList();
                                if (cogsValuesList.Count == 0)
                                {
                                    cogsValue.CogsValueId = 1;
                                }
                                else
                                {
                                    cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                }
                                cogsValue.ValueType = valueType;
                                cogsValue.CogsValue = 0;
                                cogsValue.Total = 0;
                                await _DBContext.CogsValues.AddAsync(cogsValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                        else if (i > cogs.StartYear)
                        {
                            cogsValue.Year = i;
                            cogsValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(CogsValueType)))
                            {
                                var cogsValuesList = _DBContext.CogsValues.ToList();
                                if (cogsValuesList.Count == 0)
                                {
                                    cogsValue.CogsValueId = 1;
                                }
                                else
                                {
                                    cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                }
                                if (valueType == 1)
                                {
                                    cogsValue.ValueType = valueType;
                                    if(j == 1)
                                    {
                                        var previousMonthValue = _DBContext.CogsValues.Where(x => x.Month == 12 && x.Year == i - 1 && x.ValueType == valueType).FirstOrDefault().CogsValue;
                                        cogsValue.CogsValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(((previousMonthValue * cogs.MonthlyCostChange) / 100) + previousMonthValue)));
                                    }
                                    if (j > 1)
                                    {
                                        var previousMonthValue = _DBContext.CogsValues.Where(x => x.Month == j - 1 && x.Year == i && x.ValueType == valueType).FirstOrDefault().CogsValue;
                                        cogsValue.CogsValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(((previousMonthValue * cogs.MonthlyCostChange) / 100) + previousMonthValue)));
                                    }
                                    await _DBContext.CogsValues.AddAsync(cogsValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if(valueType == 2)
                                {
                                    RevenueValueType revenueValueType = RevenueValueType.NoofUnitsSold;
                                    var revenueUnitsSold = _DBContext.RevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)revenueValueType).FirstOrDefault().RevenueValue;
                                    cogsValue.CogsValue = revenueUnitsSold;
                                    cogsValue.ValueType = valueType;
                                    await _DBContext.CogsValues.AddAsync(cogsValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 3)
                                {
                                    cogsValue.ValueType = valueType;
                                    var unitsSold = _DBContext.CogsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)CogsValueType.NoofUnitsSold).FirstOrDefault().CogsValue;
                                    var costPerUnit = _DBContext.CogsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)CogsValueType.CostsperUnit).FirstOrDefault().CogsValue;
                                    cogsValue.CogsValue = unitsSold * costPerUnit;
                                    await _DBContext.CogsValues.AddAsync(cogsValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 4)
                                {
                                    cogsValue.ValueType = valueType;
                                    cogsValue.CogsValue = cogs.DaystoPay;
                                    await _DBContext.CogsValues.AddAsync(cogsValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 5)
                                {
                                    cogsValue.ValueType = valueType;
                                    cogsValue.CogsValue = 0;
                                    await _DBContext.CogsValues.AddAsync(cogsValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 6)
                                {
                                    cogsValue.ValueType = valueType;
                                    cogsValue.CogsValue = 0;
                                    await _DBContext.CogsValues.AddAsync(cogsValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 7)
                                {
                                    cogsValue.ValueType = valueType;
                                    cogsValue.CogsValue = 0;
                                    await _DBContext.CogsValues.AddAsync(cogsValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 8)
                                {
                                    cogsValue.ValueType = valueType;
                                    cogsValue.CogsValue = 0;
                                    await _DBContext.CogsValues.AddAsync(cogsValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 9)
                                {
                                    var costs = _DBContext.CogsValues.Where(c => c.Year == i && c.Month == j && c.ValueType == (int)CogsValueType.Costs).FirstOrDefault().CogsValue;
                                    cogsValue.ValueType = valueType;
                                    cogsValue.CogsValue = costs;
                                    await _DBContext.CogsValues.AddAsync(cogsValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                        }
                        else if(i == cogs.StartYear && j >= cogs.StartMonth)
                        {
                            if (j == cogs.StartMonth)
                            {
                                cogsValue.Year = i;
                                cogsValue.Month = j;
                                foreach (int valueType in Enum.GetValues(typeof(CogsValueType)))
                                {
                                    if (valueType == 1)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = cogs.CostsinStartMonth;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 2)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        var revenueUnitsSold = _DBContext.RevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)RevenueValueType.NoofUnitsSold).FirstOrDefault().RevenueValue;
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = revenueUnitsSold;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 3)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        var unitsSold = _DBContext.CogsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)CogsValueType.NoofUnitsSold).FirstOrDefault().CogsValue;
                                        var costPerUnit = _DBContext.CogsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)CogsValueType.CostsperUnit).FirstOrDefault().CogsValue;
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = unitsSold * costPerUnit;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 4)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = cogs.DaystoPay;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 5)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = 0;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 6)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = 0;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 7)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = 0;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 8)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = 0;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 9)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        var costs = _DBContext.CogsValues.Where(c => c.Year == i && c.Month == j && c.ValueType == (int)CogsValueType.Costs).FirstOrDefault().CogsValue;
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = costs;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                }
                            }
                            else
                            {
                                cogsValue.Year = i;
                                cogsValue.Month = j;
                                foreach (int valueType in Enum.GetValues(typeof(CogsValueType)))
                                {
                                    if (valueType == 1)
                                    {
                                        var previousMonthValue = _DBContext.CogsValues.Where(x => x.Month == j - 1 && x.Year == i && x.ValueType == valueType).FirstOrDefault().CogsValue;
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        if (j == 1)
                                        {
                                            cogsValue.CogsValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(((previousMonthValue * cogs.MonthlyCostChange) / 100) + previousMonthValue)));
                                        }
                                        if (j > 1)
                                        {
                                            cogsValue.CogsValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(((previousMonthValue * cogs.MonthlyCostChange) / 100) + previousMonthValue)));
                                        }
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 2)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        RevenueValueType revenueValueType = RevenueValueType.NoofUnitsSold;
                                        var revenueUnitsSold = _DBContext.RevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)revenueValueType).FirstOrDefault().RevenueValue;
                                        cogsValue.CogsValue = revenueUnitsSold;
                                        cogsValue.ValueType = valueType;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 3)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        var unitsSold = _DBContext.CogsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)CogsValueType.NoofUnitsSold).FirstOrDefault().CogsValue;
                                        var costPerUnit = _DBContext.CogsValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)CogsValueType.CostsperUnit).FirstOrDefault().CogsValue;
                                        cogsValue.CogsValue = unitsSold * costPerUnit;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 4)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = cogs.DaystoPay;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 5)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = 0;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 6)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = 0;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 7)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = 0;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 8)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = 0;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 9)
                                    {
                                        var cogsValuesList = _DBContext.CogsValues.ToList();
                                        if (cogsValuesList.Count == 0)
                                        {
                                            cogsValue.CogsValueId = 1;
                                        }
                                        else
                                        {
                                            cogsValue.CogsValueId = cogsValuesList[cogsValuesList.Count - 1].CogsValueId + 1;
                                        }
                                        var costs = _DBContext.CogsValues.Where(c => c.Year == i && c.Month == j && c.ValueType == (int)CogsValueType.Costs).FirstOrDefault().CogsValue;
                                        cogsValue.ValueType = valueType;
                                        cogsValue.CogsValue = costs;
                                        await _DBContext.CogsValues.AddAsync(cogsValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                }
                            }
                        }
                    }
                }


                return Ok(cogs);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }

        }
    }
}
