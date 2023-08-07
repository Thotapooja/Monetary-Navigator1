using System.Net.Mail;
using System.Net;
using Web_API.Interfaces;

namespace Web_API.Repositories
{
    public class EmailSender : IEmailSender
    {
        public void SendEmailAsync(string email, string subject, string message)
        {
            /*string fromMail = "thotapooja210699@gmail.com";
            string fromPassword = "unaqbjplblrzqbzu";
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(email);
            mailMessage.Subject = subject; 
            mailMessage.To.Add(new MailAddress(email));
            mailMessage.Body = message;
          
            var smtpClient = new SmtpClient("smtp.gmail.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(fromMail, fromPassword),
                EnableSsl = true
            };
            smtpClient.Send(mailMessage);*/
            using (MailMessage mailMessage = new MailMessage("thotapooja210699@gmail.com", email))
            {
                mailMessage.Subject = subject;
                mailMessage.Body = "Your requested questions are" + message;
                SmtpClient smtpClient = new SmtpClient();
                smtpClient.Host = "smtp.gmail.com";
                smtpClient.UseDefaultCredentials = false;
                NetworkCredential networkCredential = new NetworkCredential("thotapooja210699@gmail.com", "unaqbjplblrzqbzu");
                smtpClient.Credentials = networkCredential;
                smtpClient.EnableSsl = true;
                smtpClient.Port = 587;
                smtpClient.Send(mailMessage);

            }

        }
    }
}
