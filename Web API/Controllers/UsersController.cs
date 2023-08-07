using Microsoft.AspNetCore.Mvc;
using Web_API.Model;
using Web_API.Repositories;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public UsersController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }
        [HttpGet]
        public List<Users> GetAllUsers()
        {
            if (_DBContext.Users == null)
            {
                throw new Exception("Not found");
            }
            var users = _DBContext.Users.ToList();
            if (users == null)
            {
                throw new Exception("Not found");
            }
            foreach (var i in users)
            {
                i.Password = Password.DecryptPassword(i.Password);
                i.ConfirmPassword = Password.DecryptPassword(i.ConfirmPassword);
            }
            return users;
        }
    }
}
