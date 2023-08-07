using Microsoft.AspNetCore.Mvc;
using Web_API.Interfaces;
using Web_API.Model;
using Web_API.Repositories;

namespace Web_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : Controller
    {
        private readonly IEmailSender _emailSender;
        public ContactController(IEmailSender emailSender)
        {
            this._emailSender = emailSender;
        }

        [HttpPost]
        public Contacts SendMail([FromBody] Contacts contact)
        {
            try
            {
                EmailSender emailSender = new EmailSender();
                emailSender.SendEmailAsync(contact.EmailAddress, contact.Subject, contact.Message);
                return contact;
            }
            catch (Exception ex) { throw new Exception(ex.Message); }
        }
    }
}
