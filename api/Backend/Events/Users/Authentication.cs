using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Collections.Specialized;
using System.Threading;

namespace api.Backend.Events.Users
{
    public static class Authentication
    {
        #region Methods

        [WebEvent("/auth", "POST", false)]
        public static async void CheckAuth(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            if (!await Sessions.CheckSession(headers, response)) return;

            response.StatusCode = 200;
            response.AddToData("message", "You are logged in");
        }

        [WebEvent("/login", "POST", false)]
        public static async void Login(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            string email = headers["email"], password = headers["password"];

            if (email == null || password == null)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing email or password");
                return;
            }

            User[] users = await Binding.GetTable<User>().Select<User>("email", email);

            if (users.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Email is not in use");
                return;
            }

            if (!Hashing.Match(password, users[0].Password))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Password is incorrect");
                return;
            }

            response.AddToData("authtoken", Token);
            response.AddToData("userid", users[0].Id);

            response.StatusCode = 200;
            response.AddToData("message", "Logged in");
        }

        [WebEvent("/signup", "POST", false)]
        public static async void SignUp(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            string email = headers["email"], password = headers["password"], yearOfBirth = headers["yearOfBirth"], nickname = headers["nickname"];

            if (email == null || password == null)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing email or password");
                return;
            }

            if (!ValidityChecks.IsStrongPassword(password))
            {
                response.AddToData("error", "Password is too weak");
                response.StatusCode = 401;
                return;
            }

            User[] users = await Binding.GetTable<User>().Select<User>("email", email, 1);

            if (users.Length > 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Email is in use");
                return;
            }

            User user = new User() { Email = email, Password="PASSWORD PENDING" };


            if (!int.TryParse(yearOfBirth, out user.YearOfBirth))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Year of Birth is invalid");
                return;
            }

            if (nickname != null) user.Nickname = nickname;

            await user.Insert(true);

            new Thread(async () => { user.Password = Security.Hashing.Hash(password); await user.Update(); }).Start();

            string Token = await Sessions.AddSession(user);

            response.AddToData("authtoken", Token);
            response.AddToData("userid", user.Id);

            response.StatusCode = 200;
            response.AddToData("message", "Signed Up");
        }

        #endregion Methods
    }
}