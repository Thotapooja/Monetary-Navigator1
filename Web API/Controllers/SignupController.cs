using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Web_API.Model;
using Web_API.Repositories;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SignupController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public SignupController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] Users user)
        {
            try
            {
                user.UserId = Guid.NewGuid().ToString();
                user.Password = Password.EncryptPassword(user.Password);
                user.ConfirmPassword = Password.EncryptPassword(user.ConfirmPassword);
                user.UserRoleId = _DBContext.Role.Where(x => x.RoleName == "User").FirstOrDefault().RoleId;
                user.UserStatus = 0;
                user.UserRoleId = "EBB2DDBC-5E74-4247-83D4-A8A314AB12A3";
                user.organisationId = Guid.NewGuid().ToString();
                Organisation org = new Organisation();
                org.OrganisationId = user.organisationId;
                org.Name = "";
                org.Website = "";
                org.Sector = "";
                org.SubSector = "";
                org.Description = "";
                org.Country = "";
                org.Currency = "";
                org.FoundedYear = 1800;
                if(user.Password != user.ConfirmPassword)
                {
                    throw new Exception("Incorrect Password");
                }
                await _DBContext.Organisation.AddAsync(org);
                await _DBContext.SaveChangesAsync();
                await _DBContext.Users.AddAsync(user);
                await _DBContext.SaveChangesAsync();
                return Ok(user);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
        [HttpPut]
        public async Task<IActionResult> UpdateUser(Users user)
        {
            try
            {
                user.Password = Password.EncryptPassword(user.Password);
                user.ConfirmPassword = Password.EncryptPassword(user.ConfirmPassword);
                _DBContext.Users.Update(user);
                await _DBContext.SaveChangesAsync();
                return Ok(user);
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }

    }
}
