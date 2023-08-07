using Microsoft.AspNetCore.Mvc;
using Web_API.Details;
using Web_API.Model;
using Web_API.ValueType;

namespace Web_API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class OtherRevenueController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public OtherRevenueController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] OtherRevenue revenue)
        {
            try
            {
                var revenues = _DBContext.OtherRevenue.ToList();
                if (revenues.Count == 0)
                {
                    revenue.OtherRevenueId = 1;
                }
                else
                {
                    revenue.OtherRevenueId = revenues[revenues.Count - 1].OtherRevenueId + 1;
                }

                await _DBContext.OtherRevenue.AddAsync(revenue);
                await _DBContext.SaveChangesAsync();
                OtherRevenueValues revenueValue = new OtherRevenueValues();
                //List<RevenueValues> createRevenueValues = new List<RevenueValues>();
                revenueValue.OtherRevenueId = revenue.OtherRevenueId;
                revenueValue.ScenarioId = revenue.ScenarioId;
                var forecastPeriod = _DBContext.Scenario.Where(x => x.ScenarioId == revenue.ScenarioId).FirstOrDefault().ForecastPeriod;
                var startYear = _DBContext.Scenario.Where(x => x.ScenarioId == revenue.ScenarioId).FirstOrDefault().StartYear;
                for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    for (int j = 1; j <= 12; j++)
                    {
                        if (i < revenue.StartYear)
                        {
                            revenueValue.Year = i;
                            revenueValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(OtherRevenueValueType)))
                            {
                                var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                if (revenueValues.Count == 0)
                                {
                                    revenueValue.OtherRevenueValueId = 1;
                                }
                                else
                                {
                                    revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                }
                                revenueValue.ValueType = valueType;
                                revenueValue.RevenueValue = 0;
                                revenueValue.Total = 0;
                                await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                        else if (i == revenue.StartYear && j < revenue.StartMonth)
                        {
                            revenueValue.Year = i;
                            revenueValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(OtherRevenueValueType)))
                            {
                                var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                if (revenueValues.Count == 0)
                                {
                                    revenueValue.OtherRevenueValueId = 1;
                                }
                                else
                                {
                                    revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                }
                                revenueValue.ValueType = valueType;
                                revenueValue.RevenueValue = 0;
                                revenueValue.Total = 0;
                                await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                        else if (i > revenue.StartYear)
                        {
                            revenueValue.Year = i;
                            revenueValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(OtherRevenueValueType)))
                            {
                                var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                if (revenueValues.Count == 0)
                                {
                                    revenueValue.OtherRevenueValueId = 1;
                                }
                                else
                                {
                                    revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                }
                                if (valueType == 1)
                                {
                                    revenueValue.ValueType = valueType;
                                    if(j == 1)
                                    {
                                        var previousMonthValue = _DBContext.OtherRevenueValues.Where(x => x.Month == 12 && x.Year == i - 1 && x.ValueType == valueType).FirstOrDefault().RevenueValue;
                                        if (revenue.FrequencyClientIncr == "Monthly")
                                        {
                                            revenueValue.RevenueValue = ((previousMonthValue * revenue.PerClientIncr) / 100) + previousMonthValue;
                                        }
                                        if (revenue.FrequencyClientIncr == "Yearly")
                                        {
                                            revenueValue.RevenueValue = ((previousMonthValue * ((revenue.PerClientIncr) / 12)) / 100) + previousMonthValue;
                                        }
                                    }
                                    if(j > 1)
                                    {
                                        var previousMonthValue = _DBContext.OtherRevenueValues.Where(x => x.Month == j - 1 && x.Year == i && x.ValueType == valueType).FirstOrDefault().RevenueValue;
                                        if (revenue.FrequencyClientIncr == "Monthly")
                                        {
                                            revenueValue.RevenueValue = ((previousMonthValue * revenue.PerClientIncr) / 100) + previousMonthValue;
                                        }
                                        if (revenue.FrequencyClientIncr == "Yearly")
                                        {
                                            revenueValue.RevenueValue = ((previousMonthValue * ((revenue.PerClientIncr) / 12)) / 100) + previousMonthValue;
                                        }
                                    }
                                    await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 2)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.DaysPaid;
                                    await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 3)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = 0;
                                    await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 4)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = 0;
                                    await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 5)
                                {
                                    var revenueCogs = _DBContext.OtherRevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)OtherRevenueValueType.Revenue).FirstOrDefault().RevenueValue;
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenueCogs;
                                    await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                        }
                        else if (i == revenue.StartYear && j >= revenue.StartMonth)
                        {
                            if(j==revenue.StartMonth)
                            {
                                revenueValue.Year = i;
                                revenueValue.Month = j;
                                foreach (int valueType in Enum.GetValues(typeof(OtherRevenueValueType)))
                                {
                                    if (valueType == 1)
                                    {
                                        var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.OtherRevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.RevenueinStartMonth;
                                        await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 2)
                                    {
                                        var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.OtherRevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.DaysPaid;
                                        await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 3)
                                    {
                                        var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.OtherRevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = 0;
                                        await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 4)
                                    {
                                        var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.OtherRevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = 0;
                                        await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 5)
                                    {
                                        var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.OtherRevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                        }
                                        var revenueCogs = _DBContext.OtherRevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)OtherRevenueValueType.Revenue).FirstOrDefault().RevenueValue;
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenueCogs;
                                        await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                }
                            }
                            else
                            {
                                revenueValue.Year = i;
                                revenueValue.Month = j;
                                foreach (int valueType in Enum.GetValues(typeof(OtherRevenueValueType)))
                                {

                                    var previousMonthValue = _DBContext.OtherRevenueValues.Where(x => x.Month == j - 1 && x.Year == i && x.ValueType == valueType).FirstOrDefault().RevenueValue;
                                    if (valueType == 1)
                                    {
                                        var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.OtherRevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        if(revenue.FrequencyClientIncr == "Monthly")
                                        {
                                            revenueValue.RevenueValue = ((previousMonthValue * revenue.PerClientIncr) / 100) + previousMonthValue;
                                        }
                                        if(revenue.FrequencyClientIncr == "Yearly")
                                        {
                                            revenueValue.RevenueValue = ((previousMonthValue * ((revenue.PerClientIncr)/12)) / 100) + previousMonthValue;
                                        }
                                        await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 2)
                                    {
                                        var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.OtherRevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.DaysPaid;
                                        await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 3)
                                    {
                                        var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.OtherRevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = 0;
                                        await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 4)
                                    {
                                        var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.OtherRevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = 0;
                                        await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 5)
                                    {
                                        var revenueValues = _DBContext.OtherRevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.OtherRevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.OtherRevenueValueId = revenueValues[revenueValues.Count - 1].OtherRevenueValueId + 1;
                                        }
                                        var revenueCogs = _DBContext.OtherRevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)OtherRevenueValueType.Revenue).FirstOrDefault().RevenueValue;
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenueCogs;
                                        await _DBContext.OtherRevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                }
                            }
                        }
                    }

                }
                return Ok(revenue);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }

        }
        [HttpGet("{orgId}/{scenarioId}")]
        public List<OtherRevenueDetails> GetProductDetailsByScenarioandOrganisation(Guid orgId, int scenarioId)
        {
            try
            {
                List<OtherRevenueDetails> productDetails = new List<OtherRevenueDetails>();
                var orgId1 = Convert.ToString(orgId);
                var revenues = _DBContext.OtherRevenue.Where(x => x.OrganisationId == orgId1 && x.ScenarioId == scenarioId).ToList();
                foreach (var revenue in revenues)
                {
                    OtherRevenueDetails product = new OtherRevenueDetails();
                    var revenueValues = _DBContext.OtherRevenueValues.Where(x => x.ScenarioId == revenue.ScenarioId && x.OtherRevenueId == revenue.OtherRevenueId).ToList();
                    product.OtherRevenueId= revenue.OtherRevenueId;
                    product.ScenarioId = revenue.ScenarioId;
                    product.RevenueName = revenue.RevenueName;
                    product.ReveneueCategory = revenue.RevenueCategory;
                    product.StartYear = revenue.StartYear;
                    product.StartMonth = revenue.StartMonth;
                    product.RevenueinStartMonth = revenue.RevenueinStartMonth;
                    product.FrequencyClientIncr = revenue.FrequencyClientIncr;
                    product.PerClientIncr = revenue.PerClientIncr;
                    product.DaysPaid = revenue.DaysPaid;
                    product.Assumptions = revenue.Assumptions;
                    product.OtherRevenueValues = revenueValues;
                    product.Disable = false;
                    productDetails.Add(product);
                }
                return productDetails;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
    }
}
