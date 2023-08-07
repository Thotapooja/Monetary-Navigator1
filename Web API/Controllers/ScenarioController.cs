using Microsoft.AspNetCore.Mvc;
using Web_API.Model;
using Web_API.Repositories;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScenarioController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public ScenarioController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpPost]
        public async Task<IActionResult> AddScenario([FromBody] Scenario scenario)
        {
            try
            {
                //user.UserId = Guid.NewGuid().ToString();
                scenario.Tax = 25;
                scenario.StartYear = 2023;
                scenario.ForecastPeriod = 5;
                Random rnd = new Random();
                //int num = rnd.Next();
                var scenarios = _DBContext.Scenario.ToList();
                var userScenarios = _DBContext.Scenario.Where(x=>x.OrganisationId == scenario.OrganisationId).ToList();
                scenario.ScenarioName = "Scenario" + userScenarios.Count;

                scenario.ScenarioId = scenarios.Count()+1;
                await _DBContext.Scenario.AddAsync(scenario);
                await _DBContext.SaveChangesAsync();
                return Ok(scenario);

            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
        [HttpGet("{id}")]
        //[Route("{id:guid}")]
        [ActionName("GetOrganisation")]
        public List<Scenario> GetUserScenarios(Guid id)
        {
            try
            {
                //var userId = Convert.ToString(id);                //var userId = Convert.ToString(id);
                //var user =  _DBContext.Users.Where( x=> x.UserId == userId).FirstOrDefault();
                //if(user == null) { throw new Exception("Not found"); }
                var orgId = Convert.ToString(id);
                var organisation = _DBContext.Scenario.Where(x => x.OrganisationId == orgId).ToList();
                if (organisation == null)
                {
                    throw new Exception("Not found");
                }
                return organisation;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }

    }
}
