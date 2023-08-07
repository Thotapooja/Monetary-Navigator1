using System.ComponentModel.DataAnnotations;

namespace Web_API.Model
{
    public class Users
    {
        [Key]
        public string UserId { get; set; }
        public string UserRoleId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public int UserStatus { get; set; }
        public string organisationId { get; set; }
        public DateTime DateofBirth { get; set; }
        public string ConfirmPassword { get; set; }

    }
}
