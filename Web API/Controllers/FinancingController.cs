using Microsoft.AspNetCore.Mvc;
using Swashbuckle.SwaggerUi;
using System;
using Web_API.Details;
using Web_API.Model;
using Web_API.ValueType;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinancingController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public FinancingController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpGet("{orgId}/{scenarioId}")]
        public async Task<IActionResult> GetPersonnelByScenarioandOrganisation(Guid orgId, int scenarioId)
        {
            try
            {
                List<FinancingDetails> financingDetails = new List<FinancingDetails>();
                var orgId1 = Convert.ToString(orgId);
                var finances = _DBContext.Financing.Where(x => x.OrganisationId == orgId1 && x.ScenarioId == scenarioId).ToList();
                foreach (var finance in finances)
                {
                    FinancingDetails financeDetail = new FinancingDetails();
                    var financeValues = _DBContext.FinancingValues.Where(x => x.ScenarioId == finance.ScenarioId && x.FinancingId == finance.FinancingId).ToList();
                    financeDetail.FinancingId = finance.FinancingId;
                    financeDetail.ScenarioId = finance.ScenarioId;
                    financeDetail.OrganisationId = finance.OrganisationId;
                    financeDetail.FinancingType = finance.FinancingType;
                    financeDetail.Name = finance.Name;
                    financeDetail.StartYear = finance.StartYear;
                    financeDetail.StartMonth = finance.StartMonth;
                    financeDetail.InterestPerYear = finance.InterestPerYear;
                    financeDetail.Payback = finance.Payback;
                    financeDetail.FinancingPeriodMonths = finance.FinancingPeriodMonths;
                    financeDetail.Assumptions = finance.Assumptions;
                    financeDetail.FinancingValues = financeValues;
                    financeDetail.Disable = false;
                    financingDetails.Add(financeDetail);
                }
                return Ok(financingDetails);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
        [HttpPost]
        public async Task<IActionResult> CreateFinancing([FromBody] Financing financing)
        {
            try
            {
                var financingList = _DBContext.Financing.ToList();
                if (financingList.Count == 0)
                {
                    financing.FinancingId = 1;
                }
                else
                {
                    financing.FinancingId = financingList[financingList.Count - 1].FinancingId + 1;
                }
                if(financing.FinancingType == 1 || financing.FinancingType == 3)
                {
                    financing.InterestPerYear = 0;
                    financing.Payback = 0;
                    financing.FinancingPeriodMonths = 0;
                }
                await _DBContext.Financing.AddAsync(financing);
                await _DBContext.SaveChangesAsync();
                FinancingValues financingValue = new FinancingValues();
                financingValue.FinancingId = financing.FinancingId;
                financingValue.ScenarioId = financing.ScenarioId;
                var forecastPeriod = _DBContext.Scenario.Where(x => x.ScenarioId == financingValue.ScenarioId).FirstOrDefault().ForecastPeriod;
                var startYear = _DBContext.Scenario.Where(x => x.ScenarioId == financingValue.ScenarioId).FirstOrDefault().StartYear;

                for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    for (int j = 1; j <= 12; j++)
                    {
                        var financingMonths = financing.StartMonth + financing.FinancingPeriodMonths;
                        if(financing.FinancingType == 1 || financing.FinancingType == 3)
                        {
                            if(i < financing.StartYear || i == financing.StartYear && j < financing.StartMonth)
                            {
                                var financingValuesList = _DBContext.FinancingValues.ToList();
                                if (financingValuesList.Count == 0)
                                {
                                    financingValue.FinancingValueId = 1;
                                }
                                else
                                {
                                    financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                }
                                financingValue.Year = i;
                                financingValue.Month = j;
                                financingValue.ValueType = 1;
                                financingValue.FinancingValue = 0;
                                financingValue.Total = 0;
                                await _DBContext.FinancingValues.AddAsync(financingValue);
                                await _DBContext.SaveChangesAsync();
                            }
                            else if(i == financing.StartYear && j >= financing.StartMonth)
                            {
                                var financingValuesList = _DBContext.FinancingValues.ToList();
                                if (financingValuesList.Count == 0)
                                {
                                    financingValue.FinancingValueId = 1;
                                }
                                else
                                {
                                    financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                }
                                if (j ==  financing.StartMonth)
                                {
                                    financingValue.Year = i;
                                    financingValue.Month = j;
                                    financingValue.ValueType = 1;
                                    financingValue.FinancingValue = financing.FinancingAmount;
                                    financingValue.Total = 0;
                                    await _DBContext.FinancingValues.AddAsync(financingValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                                if(j > financing.StartMonth)
                                {
                                    financingValue.Year = i;
                                    financingValue.Month = j;
                                    financingValue.ValueType = 1;
                                    financingValue.FinancingValue = 0;
                                    financingValue.Total = 0;
                                    await _DBContext.FinancingValues.AddAsync(financingValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                            else if (i > financing.StartYear)
                            {
                                var financingValuesList = _DBContext.FinancingValues.ToList();
                                if (financingValuesList.Count == 0)
                                {
                                    financingValue.FinancingValueId = 1;
                                }
                                else
                                {
                                    financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                }
                                financingValue.Year = i;
                                financingValue.Month = j;
                                financingValue.ValueType = 1;
                                financingValue.FinancingValue = 0;
                                financingValue.Total = 0;
                                await _DBContext.FinancingValues.AddAsync(financingValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                        else if(financing.FinancingType == 2 && financing.Payback == 2)
                        {
                            if (i < financing.StartYear || i == financing.StartYear && j < financing.StartMonth)
                            {                               
                                foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                {
                                    var financingValuesList = _DBContext.FinancingValues.ToList();
                                    if (financingValuesList.Count == 0)
                                    {
                                        financingValue.FinancingValueId = 1;
                                    }
                                    else
                                    {
                                        financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                    }
                                    financingValue.Year = i;
                                    financingValue.Month = j;
                                    financingValue.ValueType = valueType;
                                    financingValue.FinancingValue = 0;
                                    financingValue.Total = 0;
                                    await _DBContext.FinancingValues.AddAsync(financingValue);
                                    await _DBContext.SaveChangesAsync();
                                }                              
                            }
                            else if(i == financing.StartYear && j >= financing.StartMonth)
                            {
                                if( j == financing.StartMonth)
                                {
                                    foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                    {
                                        var financingValuesList = _DBContext.FinancingValues.ToList();
                                        if (financingValuesList.Count == 0)
                                        {
                                            financingValue.FinancingValueId = 1;
                                        }
                                        else
                                        {
                                            financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                        }
                                        financingValue.Year = i;
                                        financingValue.Month = j;
                                        if(valueType == 1)
                                        {
                                            financingValue.FinancingValue = financing.FinancingAmount;
                                        }
                                        else if(valueType == 2)
                                        {
                                            financingValue.FinancingValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal((financing.FinancingAmount/financing.FinancingPeriodMonths))));
                                        }
                                        else if(valueType == 3)
                                        {
                                            var amountReceived = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.AmountReceived).FirstOrDefault().FinancingValue;
                                            var paybackAmount = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.PaybackAmount).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = amountReceived - paybackAmount;
                                        }
                                        else if(valueType == 4)
                                        {
                                            financingValue.FinancingValue = financing.InterestPerYear / 12;
                                        }
                                        else if(valueType == 5)
                                        {
                                            var interestRate = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.InterestRate).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = (interestRate * financing.FinancingAmount) / 100;
                                        }
                                        financingValue.ValueType = valueType;
                                        financingValue.Total = 0;
                                        await _DBContext.FinancingValues.AddAsync(financingValue);
                                        await _DBContext.SaveChangesAsync();
                                    }

                                }
                                if(j > financing.StartMonth && j < financingMonths)
                                {

                                    foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                    {
                                        var financingValuesList = _DBContext.FinancingValues.ToList();
                                        if (financingValuesList.Count == 0)
                                        {
                                            financingValue.FinancingValueId = 1;
                                        }
                                        else
                                        {
                                            financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                        }
                                        financingValue.Year = i;
                                        financingValue.Month = j;
                                        if (valueType == 1)
                                        {
                                            financingValue.FinancingValue = 0;
                                        }
                                        else if (valueType == 2)
                                        {
                                            financingValue.FinancingValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal((financing.FinancingAmount / financing.FinancingPeriodMonths))));
                                        }
                                        else if (valueType == 3)
                                        {
                                            var previousLoanOutStanding = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j - 1 && x.ValueType == (int)Loan.LoanOutstanding).FirstOrDefault().FinancingValue;
                                            var paybackAmount = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.PaybackAmount).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = previousLoanOutStanding - paybackAmount;
                                        }
                                        else if (valueType == 4)
                                        {
                                            financingValue.FinancingValue = financing.InterestPerYear / 12;
                                        }
                                        else if (valueType == 5)
                                        {
                                            var previousLoanOutStanding = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j - 1 && x.ValueType == (int)Loan.LoanOutstanding).FirstOrDefault().FinancingValue;
                                            var interestRate = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.InterestRate).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = (interestRate * previousLoanOutStanding) / 100;
                                        }
                                        financingValue.ValueType = valueType;
                                        financingValue.Total = 0;
                                        await _DBContext.FinancingValues.AddAsync(financingValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                }
                                else
                                {
                                    foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                    {
                                        var financingValuesList = _DBContext.FinancingValues.ToList();
                                        if (financingValuesList.Count == 0)
                                        {
                                            financingValue.FinancingValueId = 1;
                                        }
                                        else
                                        {
                                            financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                        }
                                        financingValue.Year = i;
                                        financingValue.Month = j;
                                        financingValue.ValueType = valueType;
                                        financingValue.FinancingValue = 0;
                                        financingValue.Total = 0;
                                        await _DBContext.FinancingValues.AddAsync(financingValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                }
                            }
                            else if(i> financing.StartYear)
                            {
                                foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                {
                                    var financingValuesList = _DBContext.FinancingValues.ToList();
                                    if (financingValuesList.Count == 0)
                                    {
                                        financingValue.FinancingValueId = 1;
                                    }
                                    else
                                    {
                                        financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                    }
                                    financingValue.Year = i;
                                    financingValue.Month = j;
                                    financingValue.ValueType = valueType;
                                    financingValue.FinancingValue = 0;
                                    financingValue.Total = 0;
                                    await _DBContext.FinancingValues.AddAsync(financingValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                        }
                        else if(financing.FinancingType == 2 && financing.Payback == 1)
                        {
                            if (i < financing.StartYear || i == financing.StartYear && j < financing.StartMonth)
                            {
                                foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                {
                                    var financingValuesList = _DBContext.FinancingValues.ToList();
                                    if (financingValuesList.Count == 0)
                                    {
                                        financingValue.FinancingValueId = 1;
                                    }
                                    else
                                    {
                                        financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                    }
                                    financingValue.Year = i;
                                    financingValue.Month = j;
                                    financingValue.ValueType = valueType;
                                    financingValue.FinancingValue = 0;
                                    financingValue.Total = 0;
                                    await _DBContext.FinancingValues.AddAsync(financingValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                            else if(i == financing.StartYear && j == financing.StartMonth)
                            {
                                foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                {
                                    var financingValuesList = _DBContext.FinancingValues.ToList();
                                    if (financingValuesList.Count == 0)
                                    {
                                        financingValue.FinancingValueId = 1;
                                    }
                                    else
                                    {
                                        financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                    }
                                    financingValue.Year = i;
                                    financingValue.Month = j;
                                    if (valueType == 1)
                                    {
                                        financingValue.FinancingValue = financing.FinancingAmount;
                                    }
                                    else if (valueType == 2)
                                    {
                                        financingValue.FinancingValue = 0;
                                    }
                                    else if (valueType == 3)
                                    {
                                        var amountReceived = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.AmountReceived).FirstOrDefault().FinancingValue;
                                        var paybackAmount = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.PaybackAmount).FirstOrDefault().FinancingValue;
                                        financingValue.FinancingValue = amountReceived - paybackAmount;
                                    }
                                    else if (valueType == 4)
                                    {
                                        financingValue.FinancingValue = financing.InterestPerYear / 12;
                                    }
                                    else if (valueType == 5)
                                    {
                                        var interestRate = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.InterestRate).FirstOrDefault().FinancingValue;
                                        financingValue.FinancingValue = (interestRate * financing.FinancingAmount) / 100;
                                    }
                                    financingValue.ValueType = valueType;
                                    financingValue.Total = 0;
                                    await _DBContext.FinancingValues.AddAsync(financingValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                            else if(i == financing.StartYear && j > financing.StartMonth || i > financing.StartYear)
                            {
                                foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                {
                                    var financingValuesList = _DBContext.FinancingValues.ToList();
                                    if (financingValuesList.Count == 0)
                                    {
                                        financingValue.FinancingValueId = 1;
                                    }
                                    else
                                    {
                                        financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                    }
                                    financingValue.Year = i;
                                    financingValue.Month = j;
                                    if(valueType == 1)
                                    {
                                        financingValue.FinancingValue = 0;
                                    }
                                    else if(valueType == 2)
                                    {
                                        financingValue.FinancingValue = 0;
                                    }
                                    else if(valueType == 3)
                                    {
                                        if( j == 1)
                                        {
                                            var previousLoanOustanding = _DBContext.FinancingValues.Where(x => x.Year == i - 1 && x.Month == 12 && x.ValueType == (int)Loan.LoanOutstanding).FirstOrDefault().FinancingValue;
                                            var paybackAmount = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.PaybackAmount).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = previousLoanOustanding - paybackAmount;
                                        }
                                        else
                                        {
                                            var previousLoanOustanding = _DBContext.FinancingValues.Where(x => x.Year == i  && x.Month == j-1 && x.ValueType == (int)Loan.LoanOutstanding).FirstOrDefault().FinancingValue;
                                            var paybackAmount = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.PaybackAmount).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = previousLoanOustanding - paybackAmount;
                                        }
                                    }
                                    else if (valueType == 4)
                                    {
                                        financingValue.FinancingValue = financing.InterestPerYear / 12;
                                    }
                                    else if (valueType == 5)
                                    {
                                        if (j == 1)
                                        {
                                            var previousLoanOustanding = _DBContext.FinancingValues.Where(x => x.Year == i - 1 && x.Month == 12 && x.ValueType == (int)Loan.LoanOutstanding).FirstOrDefault().FinancingValue;
                                            var interestRate = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.InterestRate).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = (interestRate * previousLoanOustanding) / 100;
                                        }
                                        else
                                        {
                                            var previousLoanOustanding = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j - 1 && x.ValueType == (int)Loan.LoanOutstanding).FirstOrDefault().FinancingValue;
                                            var interestRate = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.InterestRate).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = (interestRate * previousLoanOustanding) / 100;
                                        }
                                    }
                                    financingValue.ValueType = valueType;
                                    //financingValue.FinancingValue = 0;
                                    financingValue.Total = 0;
                                    await _DBContext.FinancingValues.AddAsync(financingValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                        }
                        else if (financing.FinancingType == 2 && financing.Payback == 3)
                        {
                            if (i < financing.StartYear || i == financing.StartYear && j < financing.StartMonth)
                            {
                                foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                {
                                    var financingValuesList = _DBContext.FinancingValues.ToList();
                                    if (financingValuesList.Count == 0)
                                    {
                                        financingValue.FinancingValueId = 1;
                                    }
                                    else
                                    {
                                        financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                    }
                                    financingValue.Year = i;
                                    financingValue.Month = j;
                                    financingValue.ValueType = valueType;
                                    financingValue.FinancingValue = 0;
                                    financingValue.Total = 0;
                                    await _DBContext.FinancingValues.AddAsync(financingValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                            else if (i == financing.StartYear && j == financing.StartMonth)
                            {
                                foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                {
                                    financingValue.Year = i;
                                    financingValue.Month = j;
                                    var financingValuesList = _DBContext.FinancingValues.ToList();
                                    if (financingValuesList.Count == 0)
                                    {
                                        financingValue.FinancingValueId = 1;
                                    }
                                    else
                                    {
                                        financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                    }
                                    if(valueType == 1)
                                    {
                                        financingValue.FinancingValue = financing.FinancingAmount;
                                    }
                                    else if(valueType == 2)
                                    {
                                        financingValue.FinancingValue = 0;
                                    }
                                    else if (valueType == 3)
                                    {
                                        var amountReceived = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.AmountReceived).FirstOrDefault().FinancingValue;
                                        var paybackAmount = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.PaybackAmount).FirstOrDefault().FinancingValue;
                                        financingValue.FinancingValue = amountReceived - paybackAmount;
                                    }
                                    else if (valueType == 4)
                                    {
                                        financingValue.FinancingValue = financing.InterestPerYear / 12;
                                    }
                                    else if (valueType == 5)
                                    {
                                        var interestRate = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.InterestRate).FirstOrDefault().FinancingValue;
                                        financingValue.FinancingValue = (interestRate * financing.FinancingAmount) / 100;
                                    }
                                    
                                    financingValue.ValueType = valueType;
                                    //financingValue.FinancingValue = 0;
                                    financingValue.Total = 0;
                                    await _DBContext.FinancingValues.AddAsync(financingValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                            else if(i == financing.StartYear && j > financing.StartMonth)
                            {
                                var finacingMonths = financing.FinancingPeriodMonths + financing.StartMonth;
                                if( j < finacingMonths)
                                {
                                    foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                    {
                                        financingValue.Year = i;
                                        financingValue.Month = j;
                                        var financingValuesList = _DBContext.FinancingValues.ToList();
                                        if (financingValuesList.Count == 0)
                                        {
                                            financingValue.FinancingValueId = 1;
                                        }
                                        else
                                        {
                                            financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                        }
                                        if (valueType == 1)
                                        {
                                            financingValue.FinancingValue = 0;
                                        }
                                        else if (valueType == 2)
                                        {
                                            financingValue.FinancingValue = 0;
                                        }
                                        else if (valueType == 3)
                                        {
                                            var amountReceived = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j - 1 && x.ValueType == (int)Loan.LoanOutstanding).FirstOrDefault().FinancingValue;
                                            var paybackAmount = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.PaybackAmount).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = amountReceived - paybackAmount;
                                        }
                                        else if (valueType == 4)
                                        {
                                            financingValue.FinancingValue = financing.InterestPerYear / 12;
                                        }
                                        else if (valueType == 5)
                                        {
                                            var interestRate = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.InterestRate).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = (interestRate * financing.FinancingAmount) / 100;
                                        }

                                        financingValue.ValueType = valueType;
                                        //financingValue.FinancingValue = 0;
                                        financingValue.Total = 0;
                                        await _DBContext.FinancingValues.AddAsync(financingValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                }
                                else if (j == finacingMonths)
                                {
                                    foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                    {
                                        financingValue.Year = i;
                                        financingValue.Month = j;
                                        var financingValuesList = _DBContext.FinancingValues.ToList();
                                        if (financingValuesList.Count == 0)
                                        {
                                            financingValue.FinancingValueId = 1;
                                        }
                                        else
                                        {
                                            financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                        }
                                        if (valueType == 1)
                                        {
                                            financingValue.FinancingValue = 0;
                                        }
                                        else if (valueType == 2)
                                        {
                                            financingValue.FinancingValue = financing.FinancingAmount;
                                        }
                                        else if (valueType == 3)
                                        {
                                            var amountReceived = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j - 1 && x.ValueType == (int)Loan.LoanOutstanding).FirstOrDefault().FinancingValue;
                                            var paybackAmount = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.PaybackAmount).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = amountReceived - paybackAmount;
                                        }
                                        else if (valueType == 4)
                                        {
                                            financingValue.FinancingValue = financing.InterestPerYear / 12;
                                        }
                                        else if (valueType == 5)
                                        {
                                            var interestRate = _DBContext.FinancingValues.Where(x => x.Year == i && x.Month == j && x.ValueType == (int)Loan.InterestRate).FirstOrDefault().FinancingValue;
                                            financingValue.FinancingValue = (interestRate * financing.FinancingAmount) / 100;
                                        }

                                        financingValue.ValueType = valueType;
                                        //financingValue.FinancingValue = 0;
                                        financingValue.Total = 0;
                                        await _DBContext.FinancingValues.AddAsync(financingValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                }
                                else
                                {
                                    foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                    {
                                        var financingValuesList = _DBContext.FinancingValues.ToList();
                                        if (financingValuesList.Count == 0)
                                        {
                                            financingValue.FinancingValueId = 1;
                                        }
                                        else
                                        {
                                            financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                        }
                                        financingValue.Year = i;
                                        financingValue.Month = j;
                                        financingValue.ValueType = valueType;
                                        financingValue.FinancingValue = 0;
                                        financingValue.Total = 0;
                                        await _DBContext.FinancingValues.AddAsync(financingValue);
                                        await _DBContext.SaveChangesAsync();
                                    }
                                }
                            }
                            else if(i> financing.StartYear)
                            {
                                foreach (int valueType in Enum.GetValues(typeof(Loan)))
                                {
                                    var financingValuesList = _DBContext.FinancingValues.ToList();
                                    if (financingValuesList.Count == 0)
                                    {
                                        financingValue.FinancingValueId = 1;
                                    }
                                    else
                                    {
                                        financingValue.FinancingValueId = financingValuesList[financingValuesList.Count - 1].FinancingValueId + 1;
                                    }
                                    financingValue.Year = i;
                                    financingValue.Month = j;
                                    financingValue.ValueType = valueType;
                                    financingValue.FinancingValue = 0;
                                    financingValue.Total = 0;
                                    await _DBContext.FinancingValues.AddAsync(financingValue);
                                    await _DBContext.SaveChangesAsync();
                                }
                            }
                        }
                    }
                }
                return Ok(financing);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
    }
}
