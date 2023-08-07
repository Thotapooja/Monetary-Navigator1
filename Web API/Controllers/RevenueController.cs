using Microsoft.AspNetCore.Mvc;
using Web_API.Details;
using Web_API.Interfaces;
using Web_API.Model;
using Web_API.Repositories;
using Web_API.ValueType;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RevenueController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public RevenueController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpGet("{orgId}/{scenarioId}")]
        public List<ProductDetails> GetProductDetailsByScenarioandOrganisation(Guid orgId, int scenarioId){
            try
            {
                List<ProductDetails> productDetails = new List<ProductDetails>();
                var orgId1 = Convert.ToString(orgId);
                var revenues = _DBContext.Revenue.Where(x => x.OrganisationId == orgId1 && x.ScenarioId == scenarioId).ToList();
                foreach(var revenue in revenues)
                {
                    ProductDetails product = new ProductDetails();
                    var revenueValues = _DBContext.RevenueValues.Where(x=>x.ScenarioId == revenue.ScenarioId && x.RevenueId == revenue.RevenueId).ToList();
                    product.RevenueId = revenue.RevenueId;
                    product.ScenarioId = revenue.ScenarioId;
                    product.OrganisationId  = revenue.OrganisationId;
                    product.RevenueCategory = revenue.RevenueCategory;
                    product.RevenueName = revenue.RevenueName;
                    product.StartYear = revenue.StartYear;
                    product.StartMonth = revenue.StartMonth;
                    product.ClientsInStartMonth = revenue.ClientsInStartMonth;
                    product.UnitsSoldperclientpermonth = revenue.UnitsSoldperclientpermonth;
                    product.FrequencyClientIncr = revenue.FrequencyClientIncr;
                    product.PerClientIncr = revenue.PerClientIncr;
                    product.DaysPaid = revenue.DaysPaid;
                    product.PricePerUnit = revenue.PricePerUnit;
                    product.Assumptions = revenue.Assumptions;
                    product.Disable = false;
                    product.RevenueValues = revenueValues;
                    productDetails.Add(product);
                }
                return productDetails;
            }
            catch(Exception ex) { throw new Exception(ex.Message); }    
        }
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] Revenue revenue)
        {
            try
            {
                var revenues = _DBContext.Revenue.ToList();
                if(revenues.Count==0)
                {
                    revenue.RevenueId = 1;
                }
                else
                {
                    revenue.RevenueId = revenues[revenues.Count - 1].RevenueId + 1;
                }
                
                await _DBContext.Revenue.AddAsync(revenue);
                await _DBContext.SaveChangesAsync();
                RevenueValues revenueValue = new RevenueValues();
                //List<RevenueValues> createRevenueValues = new List<RevenueValues>();
                revenueValue.RevenueId = revenue.RevenueId;
                revenueValue.ScenarioId = revenue.ScenarioId;
                var forecastPeriod = _DBContext.Scenario.Where(x=>x.ScenarioId == revenue.ScenarioId).FirstOrDefault().ForecastPeriod;
                var startYear = _DBContext.Scenario.Where(x => x.ScenarioId == revenue.ScenarioId).FirstOrDefault().StartYear;
                for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    for(int j = 1; j<= 12;j ++)
                    {
                        if( i < revenue.StartYear)
                        {
                            revenueValue.Year = i;
                            revenueValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(RevenueValueType)))
                            {
                                var revenueValues = _DBContext.RevenueValues.ToList();
                                if (revenueValues.Count == 0)
                                {
                                    revenueValue.RevenueValueId = 1;
                                }
                                else
                                {
                                    revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                }
                                revenueValue.ValueType = valueType;
                                revenueValue.RevenueValue = 0;
                                revenueValue.Total = 0;
                                await _DBContext.RevenueValues.AddAsync(revenueValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                        else if(i == revenue.StartYear && j < revenue.StartMonth)
                        {
                            revenueValue.Year = i;
                            revenueValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(RevenueValueType)))
                            {
                                var revenueValues = _DBContext.RevenueValues.ToList();
                                if (revenueValues.Count == 0)
                                {
                                    revenueValue.RevenueValueId = 1;
                                }
                                else
                                {
                                    revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                }
                                revenueValue.ValueType = valueType;
                                revenueValue.RevenueValue = 0;
                                revenueValue.Total = 0;
                                await _DBContext.RevenueValues.AddAsync(revenueValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                        else if(i > revenue.StartYear)
                        {
                            revenueValue.Year = i;
                            revenueValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(RevenueValueType)))
                            {
                                var revenueValues = _DBContext.RevenueValues.ToList();
                                if (revenueValues.Count == 0)
                                {
                                    revenueValue.RevenueValueId = 1;
                                }
                                else
                                {
                                    revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                }
                                if (valueType == 1)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.UnitsSoldperclientpermonth;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 2)
                                {
                                    revenueValue.ValueType = valueType;
                                    if (j == 1)
                                    {
                                        var previousMonthValue = _DBContext.RevenueValues.Where(x => x.Month == 12 && x.Year == i - 1 && x.ValueType == valueType).FirstOrDefault().RevenueValue;
                                        if (revenue.FrequencyClientIncr == "Monthly")
                                        {
                                            revenueValue.RevenueValue = ((previousMonthValue * revenue.PerClientIncr) / 100) + previousMonthValue;
                                        }
                                        if (revenue.FrequencyClientIncr == "Yearly")
                                        {
                                            revenueValue.RevenueValue = ((previousMonthValue * ((revenue.PerClientIncr) / 12)) / 100) + previousMonthValue;
                                        }
                                    }
                                    if (j > 1)
                                    {
                                        var previousMonthValue = _DBContext.RevenueValues.Where(x => x.Month == j - 1 && x.Year == i && x.ValueType == valueType).FirstOrDefault().RevenueValue;
                                        if (revenue.FrequencyClientIncr == "Monthly")
                                        {
                                            revenueValue.RevenueValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(((previousMonthValue * revenue.PerClientIncr) / 100) + previousMonthValue)));
                                        }
                                        if (revenue.FrequencyClientIncr == "Yearly")
                                        {
                                            revenueValue.RevenueValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(((previousMonthValue * ((revenue.PerClientIncr) / 12)) / 100) + previousMonthValue)));
                                        }
                                    }
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 3)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.ClientsInStartMonth * revenue.UnitsSoldperclientpermonth;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 4)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.PricePerUnit;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 5)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.DaysPaid;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 6)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = 0;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 7)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = 0;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if(valueType == 8)
                                {
                                    var noofClients = _DBContext.RevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)RevenueValueType.NoofClients).FirstOrDefault().RevenueValue;
                                    var priceperUnit = _DBContext.RevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)RevenueValueType.PriceperUnit).FirstOrDefault().RevenueValue;
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = noofClients * priceperUnit;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                        }
                        else if(i == revenue.StartYear && j >= revenue.StartMonth)
                        {
                            if(j== revenue.StartMonth)
                            {
                                revenueValue.Year = i;
                                revenueValue.Month = j;
                                foreach (int valueType in Enum.GetValues(typeof(RevenueValueType)))
                                {
                                    if (valueType == 1)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.UnitsSoldperclientpermonth;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 2)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.ClientsInStartMonth;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 3)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.ClientsInStartMonth * revenue.UnitsSoldperclientpermonth;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 4)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.PricePerUnit;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 5)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.DaysPaid;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 6)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = 0;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 7)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = 0;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 8)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        var noofClients = _DBContext.RevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)RevenueValueType.NoofClients).FirstOrDefault().RevenueValue;
                                        var priceperUnit = _DBContext.RevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)RevenueValueType.PriceperUnit).FirstOrDefault().RevenueValue;
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = noofClients * priceperUnit;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                }
                            }

                            if( j > revenue.StartMonth)
                            {
                                revenueValue.Year = i;
                                revenueValue.Month = j;
                                foreach (int valueType in Enum.GetValues(typeof(RevenueValueType)))
                                {
                                    if (valueType == 1)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.UnitsSoldperclientpermonth;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 2)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        var previousMonthValue = _DBContext.RevenueValues.Where(x => x.Month == j - 1 && x.Year == i && x.ValueType == valueType).FirstOrDefault().RevenueValue;
                                        if (revenue.FrequencyClientIncr == "Monthly")
                                        {
                                            int b = ((previousMonthValue * revenue.PerClientIncr) / 100) +previousMonthValue;
                                            var c = Math.Ceiling(Convert.ToDecimal(((previousMonthValue * revenue.PerClientIncr) / 100) + previousMonthValue));
                                            var d = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(((previousMonthValue * revenue.PerClientIncr) / 100) + previousMonthValue)));

                                            //Int32 a = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(((previousMonthValue * revenue.PerClientIncr) / 100) + previousMonthValue)));

                                            revenueValue.RevenueValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(((previousMonthValue * revenue.PerClientIncr) / 100) + previousMonthValue)));
                                        }
                                        if (revenue.FrequencyClientIncr == "Yearly")
                                        {
                                            revenueValue.RevenueValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal(((previousMonthValue * ((revenue.PerClientIncr) / 12)) / 100) + previousMonthValue)));
                                        }
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 3)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.ClientsInStartMonth * revenue.UnitsSoldperclientpermonth;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 4)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.PricePerUnit;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 5)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = revenue.DaysPaid;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 6)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = 0;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 7)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = 0;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                    else if (valueType == 8)
                                    {
                                        var revenueValues = _DBContext.RevenueValues.ToList();
                                        if (revenueValues.Count == 0)
                                        {
                                            revenueValue.RevenueValueId = 1;
                                        }
                                        else
                                        {
                                            revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                        }
                                        var noofClients = _DBContext.RevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)RevenueValueType.NoofClients).FirstOrDefault().RevenueValue;
                                        var priceperUnit = _DBContext.RevenueValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)RevenueValueType.PriceperUnit).FirstOrDefault().RevenueValue;
                                        revenueValue.ValueType = valueType;
                                        revenueValue.RevenueValue = noofClients * priceperUnit;
                                        await _DBContext.RevenueValues.AddAsync(revenueValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                }
                            }
                        }
                    }

                }
                /*for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    int total = 0;
                    for (int j = 1; j <= 12; j++)
                    {
                        if(i == revenue.StartYear && j >= revenue.StartMonth)
                        {
                            foreach (int valueType in Enum.GetValues(typeof(RevenueValueType)))
                            {
                                if(valueType == 1)
                                {
                                    var revenueValues = _DBContext.RevenueValues.ToList();
                                    if (revenueValues.Count == 0)
                                    {
                                        revenueValue.RevenueValueId = 1;
                                    }
                                    else
                                    {
                                        revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                    }
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.UnitsSoldperclientpermonth;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 2)
                                {
                                    var revenueValues = _DBContext.RevenueValues.ToList();
                                    if (revenueValues.Count == 0)
                                    {
                                        revenueValue.RevenueValueId = 1;
                                    }
                                    else
                                    {
                                        revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                    }
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.ClientsInStartMonth;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if(valueType == 3)
                                {
                                    var revenueValues = _DBContext.RevenueValues.ToList();
                                    if (revenueValues.Count == 0)
                                    {
                                        revenueValue.RevenueValueId = 1;
                                    }
                                    else
                                    {
                                        revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                    }
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.ClientsInStartMonth * revenue.UnitsSoldperclientpermonth;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 4)
                                {
                                    var revenueValues = _DBContext.RevenueValues.ToList();
                                    if (revenueValues.Count == 0)
                                    {
                                        revenueValue.RevenueValueId = 1;
                                    }
                                    else
                                    {
                                        revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                    }
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.PricePerUnit;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 5)
                                {
                                    var revenueValues = _DBContext.RevenueValues.ToList();
                                    if (revenueValues.Count == 0)
                                    {
                                        revenueValue.RevenueValueId = 1;
                                    }
                                    else
                                    {
                                        revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                    }
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.DaysPaid;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 6)
                                {
                                    var revenueValues = _DBContext.RevenueValues.ToList();
                                    if (revenueValues.Count == 0)
                                    {
                                        revenueValue.RevenueValueId = 1;
                                    }
                                    else
                                    {
                                        revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                    }
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = 0;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 7)
                                {
                                    var revenueValues = _DBContext.RevenueValues.ToList();
                                    if (revenueValues.Count == 0)
                                    {
                                        revenueValue.RevenueValueId = 1;
                                    }
                                    else
                                    {
                                        revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                    }
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = 0;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                        }
                    }
                }*/
                /*for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    int total = 0;
                    for (int j = 1; j <= 12; j++)
                    {
                        if (i > revenue.StartYear )
                        {
                            foreach (int valueType in Enum.GetValues(typeof(RevenueValueType)))
                            {
                                var revenueValues = _DBContext.RevenueValues.ToList();
                                if (revenueValues.Count == 0)
                                {
                                    revenueValue.RevenueValueId = 1;
                                }
                                else
                                {
                                    revenueValue.RevenueValueId = revenueValues[revenueValues.Count - 1].RevenueValueId + 1;
                                }
                                if (valueType == 1)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.UnitsSoldperclientpermonth;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 2)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.ClientsInStartMonth;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 3)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.ClientsInStartMonth * revenue.UnitsSoldperclientpermonth;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 4)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.PricePerUnit;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 5)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = revenue.DaysPaid;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 6)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = 0;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                else if (valueType == 7)
                                {
                                    revenueValue.ValueType = valueType;
                                    revenueValue.RevenueValue = 0;
                                    await _DBContext.RevenueValues.AddAsync(revenueValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                        }
                    }
                }*/
                return Ok(revenue);

            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
    }
}
