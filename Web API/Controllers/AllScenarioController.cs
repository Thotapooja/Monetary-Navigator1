using Microsoft.AspNetCore.Mvc;
using Web_API.Model;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AllScenarioController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public AllScenarioController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpGet]
        public List<Scenario> GetScenarios()
        {
            if (_DBContext.Scenario == null)
            {
                throw new Exception("Not found");
            }
            var scenarios = _DBContext.Scenario.ToList();
            if (scenarios == null)
            {
                throw new Exception("Not found");
            }
            return scenarios;
        }
    }
}
