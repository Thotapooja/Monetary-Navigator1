using Microsoft.AspNetCore.Mvc;
using Web_API.Details;
using Web_API.Model;
using Web_API.ValueType;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonnelController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public PersonnelController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpGet("{orgId}/{scenarioId}")]
        public List<PersonnelDetails> GetPersonnelByScenarioandOrganisation(Guid orgId, int scenarioId)
        {
            try
            {
                List<PersonnelDetails> personnelDetails = new List<PersonnelDetails>();
                var orgId1 = Convert.ToString(orgId);
                var personnels = _DBContext.Personnel.Where(x => x.OrganisationId == orgId1 && x.ScenarioId == scenarioId).ToList();
                foreach (var personnel in personnels)
                {
                    PersonnelDetails personnelDetail = new PersonnelDetails();
                    var personnelValues = _DBContext.PersonnelValues.Where(x => x.ScenarioId == personnel.ScenarioId && x.PersonnelId == personnel.PersonnelId).ToList();
                    personnelDetail.PersonnelId = personnel.PersonnelId;
                    personnelDetail.ScenarioId = personnel.ScenarioId;
                    personnelDetail.OrganisationId = personnel.OrganisationId;
                    personnelDetail.Position = personnel.Position;
                    personnelDetail.PersonnelType = personnel.PersonnelType;
                    personnelDetail.StartYear = personnel.StartYear;
                    personnelDetail.StartMonth = personnel.StartMonth;
                    personnelDetail.NoofFTEs = personnel.NoofFTEs;
                    personnelDetail.GrossSalary = personnel.GrossSalary;
                    personnelDetail.AdditionalEmployeeCosts = personnel.AdditionalEmployeeCosts;
                    personnelDetail.PerSalaryIncrease = personnel.PerSalaryIncrease;
                    personnelDetail.Assumptions = personnel.Assumptions;
                    personnelDetail.PersonnelValues = personnelValues;
                    personnelDetail.Disable = false;
                    personnelDetails.Add(personnelDetail);
                }
                return personnelDetails;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
        [HttpPost]
        public async Task<IActionResult> CreatePersonnel([FromBody] Personnel personnel)
        {
            try
            {
                var personnelList = _DBContext.Personnel.ToList();
                if (personnelList.Count == 0)
                {
                    personnel.PersonnelId = 1;
                }
                else
                {
                    personnel.PersonnelId = personnelList[personnelList.Count - 1].PersonnelId + 1;
                }

                await _DBContext.Personnel.AddAsync(personnel);
                await _DBContext.SaveChangesAsync(); 
                PersonnelValues personnelValue = new PersonnelValues();
                personnelValue.PersonnelId = personnel.PersonnelId;
                personnelValue.ScenarioId = personnel.ScenarioId;
                var forecastPeriod = _DBContext.Scenario.Where(x => x.ScenarioId == personnelValue.ScenarioId).FirstOrDefault().ForecastPeriod;
                var startYear = _DBContext.Scenario.Where(x => x.ScenarioId == personnelValue.ScenarioId).FirstOrDefault().StartYear;
                for (int i = startYear; i < startYear + forecastPeriod; i++)
                {
                    for (int j = 1; j <= 12; j++)
                    {
                        if (i < personnel.StartYear || i == personnel.StartYear && j < personnel.StartMonth)
                        {
                            personnelValue.Year = i;
                            personnelValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(PersonnelValueType)))
                            {
                                var personnelValuesList = _DBContext.PersonnelValues.ToList();
                                if (personnelValuesList.Count == 0)
                                {
                                    personnelValue.PersonnelValueId = 1;
                                }
                                else
                                {
                                    personnelValue.PersonnelValueId = personnelValuesList[personnelValuesList.Count - 1].PersonnelValueId + 1;
                                }
                                personnelValue.ValueType = valueType;
                                personnelValue.PersonnelValue = 0;
                                personnelValue.Total = 0;
                                await _DBContext.PersonnelValues.AddAsync(personnelValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                        else if (i == personnel.StartYear && j >= personnel.StartMonth)
                        {
                            personnelValue.Year = i;
                            personnelValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(PersonnelValueType)))
                            {
                                var personnelValuesList = _DBContext.PersonnelValues.ToList();
                                if (personnelValuesList.Count == 0)
                                {
                                    personnelValue.PersonnelValueId = 1;
                                }
                                else
                                {
                                    personnelValue.PersonnelValueId = personnelValuesList[personnelValuesList.Count - 1].PersonnelValueId + 1;
                                }
                                if(valueType == 1)
                                {
                                    personnelValue.PersonnelValue = personnel.NoofFTEs;
                                }
                                if(valueType == 2)
                                {
                                    personnelValue.PersonnelValue = personnel.GrossSalary;
                                }
                                if(valueType == 3)
                                {
                                    personnelValue.PersonnelValue = personnel.AdditionalEmployeeCosts;
                                }
                               // personnelValue.PersonnelValue = valueType == 1 ? personnel.NoofFTEs : valueType == 2 ? personnel.GrossSalary : valueType == 3 ? personnel.AdditionalEmployeeCosts : 0;
                                if(valueType == 4)
                                {
                                    var addCostperSalary = _DBContext.PersonnelValues.Where(x => x.Year == i && x.Month == j && x.ValueType == 3).FirstOrDefault().PersonnelValue;
                                    personnelValue.PersonnelValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal((addCostperSalary * 100)/100)));
                                }
                                if (valueType == 5)
                                {
                                    var noofFTEs = _DBContext.PersonnelValues.Where(c => c.Year == i && c.Month == j && c.ValueType == 1).FirstOrDefault().PersonnelValue;
                                    var salaryPerFTE = _DBContext.PersonnelValues.Where(c => c.Year == i && c.Month == j && c.ValueType == 2).FirstOrDefault().PersonnelValue;
                                    var addCostperSalary = _DBContext.PersonnelValues.Where(x => x.Year == i && x.Month == j && x.ValueType == 4).FirstOrDefault().PersonnelValue;
                                    personnelValue.PersonnelValue = (noofFTEs * salaryPerFTE) + (noofFTEs * addCostperSalary);
                                }
                                personnelValue.ValueType = valueType;
                                personnelValue.Total = 0; 
                                await _DBContext.PersonnelValues.AddAsync(personnelValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                        else if (i > personnel.StartYear)
                        {
                            personnelValue.Year = i;
                            personnelValue.Month = j;
                            foreach (int valueType in Enum.GetValues(typeof(PersonnelValueType)))
                            {
                                var personnelValuesList = _DBContext.PersonnelValues.ToList();
                                if (personnelValuesList.Count == 0)
                                {
                                    personnelValue.PersonnelValueId = 1;
                                }
                                else
                                {
                                    personnelValue.PersonnelValueId = personnelValuesList[personnelValuesList.Count - 1].PersonnelValueId + 1;
                                }
                                personnelValue.ValueType = valueType;
                                personnelValue.PersonnelValue = valueType == 1 ? personnel.NoofFTEs : valueType == 3 ? personnel.AdditionalEmployeeCosts : 0;
                                if(valueType == 2)
                                {
                                    var salaryperFTE = _DBContext.PersonnelValues.Where(x => x.Year == i - 1 && x.Month == 12 && x.ValueType == 2).FirstOrDefault().PersonnelValue;
                                    personnelValue.PersonnelValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal((salaryperFTE * personnel.PerSalaryIncrease) / 100))) + salaryperFTE;
                                }
                                if (valueType == 4)
                                {
                                    var addCostperSalary = _DBContext.PersonnelValues.Where(x => x.Year == i && x.Month == j && x.ValueType == 3).FirstOrDefault().PersonnelValue;
                                    personnelValue.PersonnelValue = Convert.ToInt32(Math.Ceiling(Convert.ToDecimal((addCostperSalary * 100) / 100)));
                                }
                                if (valueType == 5)
                                {
                                    var noofFTEs = _DBContext.PersonnelValues.Where(c => c.Year == i && c.Month == j && c.ValueType == 1).FirstOrDefault().PersonnelValue;
                                    var salaryPerFTE = _DBContext.PersonnelValues.Where(c => c.Year == i && c.Month == j && c.ValueType == 2).FirstOrDefault().PersonnelValue;
                                    var addCostperSalary = _DBContext.PersonnelValues.Where(x => x.Year == i && x.Month == j && x.ValueType == 4).FirstOrDefault().PersonnelValue;
                                    personnelValue.PersonnelValue = (noofFTEs * salaryPerFTE) + (noofFTEs * addCostperSalary);
                                }
                                personnelValue.Total = 0;
                                await _DBContext.PersonnelValues.AddAsync(personnelValue);
                                await _DBContext.SaveChangesAsync();
                            }
                        }
                    }
                }

                return Ok(personnel);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
    }
}
