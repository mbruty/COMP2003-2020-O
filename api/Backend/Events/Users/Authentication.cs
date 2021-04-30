using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace api.Backend.Events.Users
{
    public static class Authentication
    {
        #region Fields

        private static Regex codePattern = new Regex(@"\d{3}-\d{3}-\d{3}");

        #endregion Fields

        #region Methods

        [WebEvent(typeof(string), "/user/authcheck", "POST", false, SecurityGroup.User)]
        public static async Task CheckAuthHttp(string Data, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            response.StatusCode = 200;
            response.AddToData("message", "You are logged in");

            User[] u = await Binding.GetTable<User>().Select<User>(perm.user_id);
            response.AddToData("verified", u[0].IsVerified);
        }

        [WebEvent(typeof(string), "/user/authcheck", "GET", false, SecurityGroup.User)]
        public static async Task CheckAuthWebSocket(WebSockets.SocketInstance instance, WebSockets.SocketRequest @event, WebSockets.SocketResponse response, Security.SecurityPerm perm)
        {
            response.StatusCode = 200;
            response.AddToData("message", "You are logged in");

            User[] u = await Binding.GetTable<User>().Select<User>(perm.user_id);
            response.AddToData("verified", u[0].IsVerified);
        }

        [WebEvent(typeof(LoginCredentials), "/user/login", "POST", false)]
        public static async Task Login(LoginCredentials creds, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            string email = creds.Email, password = creds.Password;

            if (email == null || password == null)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing email or password");
                return;
            }

            User[] users = await Binding.GetTable<User>().Select<User>("email", email, 1);

            if (users.Length == 0 || !Hashing.Match(password, users[0].Password))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Email or Password is invalid");
                return;
            }

            string Token = Sessions.RandomString();
            await Sessions.AddSession(users[0], Token);

            // Add a cookie for the website
            response.AddCookie("authtoken", Token + "&user_id=" + users[0].UserID, true, "/");
            // We're using the auth token from the body in the mobile app
            response.AddToData("authtoken", Token);
            response.AddToData("userid", users[0].UserID);

            response.StatusCode = 200;
            response.AddToData("message", "Logged in");
        }

        [WebEvent(typeof(string), "/user/logout", "DELETE", false, SecurityGroup.Administrator)]
        public static async Task LogoutAdmin(string Data, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Session[] users = await Binding.GetTable<Session>().Select<Session>(perm.user_id);

            await users[0].Delete<Session>();

            response.StatusCode = 200;
            response.AddToData("message", "You are now logged out");
        }

        [WebEvent(typeof(UserIdWithToken), "/user/resendcode", "POST", false, SecurityGroup.User)]
        public static async Task resendcode(UserIdWithToken user, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            // Get the user
            User[] users = await Binding.GetTable<User>().Select<User>("UserID", user.UserID, 1);

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
            Email.SendConfirmation(users[0].Nickname, code, users[0].Email);

            // Update the database with the code
            Backend.Data.Redis.Instance.SetStringWithExpiration($"signup-code:{user.UserID}", code, new TimeSpan(0, 30, 0));
        }

        [WebEvent(typeof(User), "/user/signup", "POST", false)]
        public static async Task SignUp(User creds, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            string email = creds.Email, password = creds.Password, dateOfBirth = creds.DateOfBirth.ToString(), nickname = creds.Nickname;

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

            User[] users = await Binding.GetTable<User>().Select<User>("email", email, 1);

            if (users.Length > 0)
            {
                response.StatusCode = 208;
                response.AddToData("error", "Email is in use");
                return;
            }

            User user = new User() { Email = email, Password = "PASSWORD PENDING" };

            if (!DateTime.TryParse(dateOfBirth, out user.DateOfBirth))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Date of Birth is invalid");
                return;
            }

            if (nickname != null) user.Nickname = nickname;

            if (!await user.Insert<User>(true))
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
            Email.SendConfirmation(nickname, code, email);

            // Update the database with the code
            Backend.Data.Redis.Instance.SetStringWithExpiration($"signup-code:{user.UserID}", code, new TimeSpan(0, 30, 0));

            response.AddToData("authtoken", token);
            response.AddToData("userid", user.UserID);
            response.AddCookie("authtoken", token + "&user_id=" + user.UserID, true, "/");

            response.StatusCode = 200;
            response.AddToData("message", "Signed Up");
        }

        [WebEvent(typeof(ValidationCode), "/user/validatecode", "POST", false)]
        public static async Task ValidateCode(ValidationCode validation, Endpoints.WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            if (validation.UserID == null || validation.Code == null || !codePattern.IsMatch(validation.Code))
            {
                // Bad Request
                response.StatusCode = 400;
                return;
            }

            // Get the user
            User[] users = await Binding.GetTable<User>().Select<User>("UserID", validation.UserID, 1);

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

            string code = await Backend.Data.Redis.Instance.GetString($"signup-code:{validation.UserID}");

            // Correct code!
            if (code == validation.Code)
            {
                response.StatusCode = 200;

                users[0].IsVerified = true;
                bool updated = await users[0].UpdateIsVerified();
                if (updated)
                {
                    // Remove the key
                    Backend.Data.Redis.Instance.InvalidateKey($"signup-code:{validation.UserID}");
                    // Invalidate the user in the cache
                    Backend.Data.Redis.Instance.InvalidateKey($"User-{validation.UserID}");
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
    }

    public class LoginCredentials
    {
        #region Fields

        public string Email;
        public string Password;

        #endregion Fields
    }

    public class UserIdWithToken
    {
        #region Fields

        public string AuthToken;
        public string UserID;

        #endregion Fields
    }

    public class ValidationCode
    {
        #region Fields

        public string Code;
        public string UserID;

        #endregion Fields
    }
}
