using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using System.Data.Entity;
using System.Web.Http.Controllers;
using Web_API.Model;
using Web_API.Repositories;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrganisationController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public OrganisationController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpGet]
        public  List<Organisation> GetAllOrganisations()
        {
            if (_DBContext.Organisation == null)
            {
                throw new Exception("No Organisations");
            }
            var organisation = _DBContext.Organisation.ToList();
            return organisation;
        }
        [HttpGet("{id}")]
        //[Route("{id:guid}")]
        [ActionName("GetOrganisation")]
        public async Task<IActionResult> GetOrganisation(Guid id)
        {
            try
            {
                //var userId = Convert.ToString(id);                //var userId = Convert.ToString(id);
                //var user =  _DBContext.Users.Where( x=> x.UserId == userId).FirstOrDefault();
                //if(user == null) { throw new Exception("Not found"); }
                var orgId = Convert.ToString(id);
                var organisation =   _DBContext.Organisation.Where(x => x.OrganisationId == orgId).FirstOrDefault();
                if (organisation == null)
                {
                    throw new Exception("Not found");
                }
                return Ok(organisation);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
        [HttpDelete("{id}")]
        //[Route("{id:guid}")]
        [ActionName("DeleteOrganisationandUser")]
        public async Task<IActionResult> DeleteOrganisationandUser(Guid id)
        {
            try
            {
                var userId = Convert.ToString(id);
                var user = _DBContext.Users.Where(x => x.UserId == userId).FirstOrDefault();
                if (user == null)
                {
                    throw new Exception("User not found");
                }
                var organisation = _DBContext.Organisation.Where(x=>x.OrganisationId == user.organisationId).FirstOrDefault();
                if(organisation == null)
                {
                    throw new Exception("Organisation not found");
                }
                _DBContext.Users.Remove(user);
                _DBContext.SaveChanges();
                _DBContext.Organisation.Remove(organisation);
                _DBContext.SaveChanges();
                return Ok(organisation);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
        [HttpPut]
        public async Task<IActionResult> UpdateOrganisation(Organisation org)
        {
            try
            {

                _DBContext.Organisation.Update(org);
                await _DBContext.SaveChangesAsync();
                return Ok(org);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
    }
}
