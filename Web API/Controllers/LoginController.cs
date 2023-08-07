using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Web_API.Model;
using Web_API.Repositories;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : Controller
    {
        private readonly MonetaryNavigatorContext _DBContext;
        public LoginController(MonetaryNavigatorContext dbContext)
        {
            _DBContext = dbContext;
        }

        [HttpGet]
        public List<Users> Getuser()
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

        [HttpGet]
        [Route("{id:guid}")]
        [ActionName("GetUser")]
        public async Task<Users> Getuser(Guid id)
        {
            var userID = Convert.ToString(id);
            var user = await _DBContext.Users.Where(x => x.UserId == userID).FirstOrDefaultAsync();
            if (user == null)
            {
                throw new Exception("Not found");
            }
            return user;
        }
        [HttpGet]
        [Route("api/Login/{email}/{password}")]
        [ActionName("GetUser")]
        public IActionResult  GetUserbyCredentials(string email, string password)
        {
           // var userID = Convert.ToString(id);
           var encryptedPassword = Password.EncryptPassword(password);
            var user =  _DBContext.Users.Where(x => x.Email == email && x.Password == encryptedPassword).FirstOrDefault();
            if (user == null)
            {
                throw new Exception("Not found");
            }
            user.Password = Password.DecryptPassword(encryptedPassword);
            return Ok(user);
        }
    }
}
