using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Events.Users;
using api.Backend.Security;
using Newtonsoft.Json;
using System;
using System.Collections.Specialized;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace api.Backend.Events.RestaurantAdmins
{
    public static class Authentication
    {
        #region Fields

        private static Regex codePattern = new Regex(@"\d{3}-\d{3}-\d{3}");

        #endregion Fields

        #region Methods

        [WebEvent(typeof(string), "/admin/logout", "DELETE", false, SecurityGroup.Administrator)]
        public static async Task LogoutAdmin(string Data, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            RAdminSession[] admins = await Binding.GetTable<RAdminSession>().Select<RAdminSession>(perm.admin_id);

            await admins[0].Delete();

            response.StatusCode = 200;
            response.AddToData("message", "You are now logged out");
        }

            [WebEvent(typeof(string),"/admin/authcheck", "POST", false, SecurityGroup.Administrator)]
        public static async Task CheckAuthHttp(string Data, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            response.StatusCode = 200;
            response.AddToData("message", "You are logged in");

            RestaurantAdmin[] u = await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>(perm.admin_id);
            response.AddToData("verified", u[0].IsVerified);
        }

        [WebEvent(typeof(string), "GET", false, SecurityGroup.Administrator)]
        public static async Task CheckAuthWebSocket(WebSockets.SocketInstance instance, WebSockets.SocketRequest @event, WebSockets.SocketResponse response, Security.SecurityPerm perm)
        {
            response.StatusCode = 200;
            response.AddToData("message", "You are logged in");

            RestaurantAdmin[] u = await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>(perm.admin_id);
            response.AddToData("verified", u[0].IsVerified);
        }

        [WebEvent(typeof(LoginCredentials), "/admin/login", "POST", false)]
        public static async Task Login(LoginCredentials creds, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            // Convert the string to a credential object
            string email = creds.Email, password = creds.Password;

            if (email == null || password == null)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing email or password");
                return;
            }

            RestaurantAdmin[] users = await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>("email", email, 1);

            if (users.Length == 0 || !Hashing.Match(password, users[0].Password))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Email or Password is invalid");
                return;
            }

            string Token = Sessions.RandomString();
            await Sessions.AddSession(users[0], Token);

            // Add a cookie for the website
            response.AddCookie("authtoken", Token + "&admin_id=" + users[0].RAdminID, true, "/");
            // We're using the auth token from the body in the mobile app
            response.AddToData("authtoken", Token);
            response.AddToData("admin_id", users[0].RAdminID);

            response.StatusCode = 200;
            response.AddToData("message", "Logged in");
        }

        [WebEvent(typeof(AdminIdWithToken),"/admin/resendcode", "POST", false, SecurityGroup.Administrator)]
        public static async Task resendcode(AdminIdWithToken user, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            // Get the user
            RestaurantAdmin[] users = await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>("radminid", user.AdminID, 1);

            // Users will always be of length 1 if they exist, and 0 if they don't as we're
            // selecting by pk
            if (users.Length == 0)
            {
                response.StatusCode = 404;
                response.AddToData("error", "User not found");
                return;
            }

            // If the user is already verified
            if (users[0].IsVerified)
            {
                // 208: Already Reported
                response.StatusCode = 208;
                return;
            }

            // Send confirmation email
            Random r = new Random();
            string code = $"{r.Next(100, 999)}-{r.Next(100, 999)}-{r.Next(100, 999)}";
            Email.SendConfirmation(users[0].Email, code, users[0].Email);

            // Update the database with the code
            Backend.Data.Redis.Instance.SetStringWithExpiration($"admin-signup-code:{user.AdminID}", code, new TimeSpan(0, 30, 0));
        }

        [WebEvent(typeof(RestaurantAdmin),"/admin/signup", "POST", false)]
        public static async Task SignUp(RestaurantAdmin creds, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            string email = creds.Email, password = creds.Password;

            if (email == null || password == null)
            {
                response.StatusCode = 400;
                response.AddToData("error", "Missing email or password");
                return;
            }

            if (!ValidityChecks.IsValidEmail(email))
            {
                response.AddToData("error", "Email is invalid");
                response.StatusCode = 400;
                return;
            }

            if (!ValidityChecks.IsStrongPassword(password))
            {
                response.AddToData("error", "Password is too weak");
                response.StatusCode = 400;
                return;
            }

            RestaurantAdmin[] users = await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>("email", email, 1);

            if (users.Length > 0)
            {
                response.StatusCode = 208;
                response.AddToData("error", "Email is in use");
                return;
            }

            RestaurantAdmin user = new RestaurantAdmin() { Email = email, Password = "PASSWORD PENDING" };

            if (!await user.Insert(true))
            {
                response.StatusCode = 500;
                response.AddToData("error", "Database Insertion Failure");
                return;
            }

            string token = Sessions.RandomString();

            new Thread(async () => { user.Password = Hashing.Hash(password); await user.UpdatePassword(); await Sessions.AddSession(user, token); }).Start();

            // Send confirmation email
            Random r = new Random();
            string code = $"{r.Next(100, 999)}-{r.Next(100, 999)}-{r.Next(100, 999)}";
            Email.SendConfirmation(email, code, email);

            // Update the database with the code
            Backend.Data.Redis.Instance.SetStringWithExpiration($"admin-signup-code:{user.RAdminID}", code, new TimeSpan(0, 30, 0));

            response.AddToData("authtoken", token);
            response.AddToData("adminid", user.RAdminID);
            response.AddCookie("authtoken", token + "&admin_id=" + user.RAdminID, true, "/");

            response.StatusCode = 200;
            response.AddToData("message", "Signed Up");
        }

        [WebEvent(typeof(ValidationCode),"/admin/validatecode", "POST", false)]
        public static async Task ValidateCode(ValidationCode validation, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            if (validation.AdminID == null || validation.Code == null || !codePattern.IsMatch(validation.Code))
            {
                // Bad Request
                response.StatusCode = 400;
                return;
            }

            // Get the user
            RestaurantAdmin[] users = await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>("radminid", validation.AdminID, 1);

            // Users will always be of length 1 if they exist, and 0 if they don't as we're
            // selecting by pk
            if (users.Length == 0)
            {
                response.StatusCode = 404;
                response.AddToData("error", "User not found");
                return;
            }

            // If the user is already verified
            if (users[0].IsVerified)
            {
                // 208: Already Reported
                response.StatusCode = 208;
                return;
            }

            string code = await Backend.Data.Redis.Instance.GetString($"admin-signup-code:{validation.AdminID}");

            // Correct code!
            if (code == validation.Code)
            {
                response.StatusCode = 200;

                users[0].IsVerified = true;
                bool updated = await users[0].UpdateIsVerified();
                if (updated)
                {
                    // Remove the key
                    Backend.Data.Redis.Instance.InvalidateKey($"admin-signup-code:{validation.AdminID}");
                    // Invalidate the user in the cache
                    Backend.Data.Redis.Instance.InvalidateKey($"RestaurantAdmin-{validation.AdminID}");
                    response.StatusCode = 200;
                }
                else
                {
                    response.StatusCode = 500;
                }
            }
            else
            {
                response.StatusCode = 400;
                response.AddToData("reason", "Invalid Code");
            }
        }

        #endregion Methods

        #region Classes

        public class AdminIdWithToken
        {
            #region Properties

            public string AdminID { get; set; }
            public string AuthToken { get; set; }

            #endregion Properties
        }

        public class ValidationCode
        {
            #region Properties

            public string AdminID { get; set; }
            public string Code { get; set; }

            #endregion Properties
        }

        #endregion Classes
    }
}
