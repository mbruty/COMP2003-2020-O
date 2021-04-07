using System;
using System.Net;
using System.Net.Mail;

namespace api.Backend.Events.Users
{
    internal class Email
    {
        #region Methods

        public static void SendConfirmation(string name, string code, string to)
        {
            try
            {
                MailMessage message = new MailMessage();
                SmtpClient smtp = new SmtpClient();
                message.From = new MailAddress("confirm@trackandtaste.com");
                message.To.Add(new MailAddress(to));
                message.Subject = "Please confirm your email address";
                message.IsBodyHtml = true; //to make message body as html
                message.Body = $"<table width=\"100%\"><tr><td style=\"width: 800px\" align=\"center\"><img src=\"https://raw.githubusercontent.com/mbruty/COMP2003-2020-O/main/logo-01.png?token=ANXUVG5KA4EEGMT6MCLDQY3AH5QHW\" width=\"400px\"/><h1>Confirm your email address</h1><h3>Hi {name}, your confirmation code is below - enter it to get set up!</h3><div style=\"width: 300px; border-radius: 10px; background-color: #d5d8df; padding-top: 5px; padding-bottom: 5px;\"><h3 style=\"text-align: center\">{code}</h3></div><p style=\"color: #3b3b3b\">If you didn't request this code, don't worry! You can ignore it</p></td></tr></table>";
                smtp.Port = 587;
                smtp.Host = "mail.privateemail.com ";
                smtp.EnableSsl = true;
                smtp.UseDefaultCredentials = false;
                smtp.Credentials = new NetworkCredential("confirm@trackandtaste.com", "2@yGsu5hf^woBrj471*^");
                smtp.DeliveryMethod = SmtpDeliveryMethod.Network;
                smtp.Send(message);
            }
            catch (Exception e)
            {
                Console.Write(e.Message);
            }
        }

        #endregion Methods
    }
}
