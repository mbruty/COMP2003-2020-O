using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Collections.Specialized;

namespace api.Backend.Events.Users
{
    public static class Authentication
    {
        #region Methods

        [WebEvent("/auth", "POST", false)]
        public static void CheckAuth(NameValueCollection headers, string Data, ref WebRequest.HttpResponse response)
        {
            if (!Sessions.CheckSession(headers, ref response)) return;

            response.StatusCode = 200;
            response.AddToData("message", "You are logged in");
        }

        [WebEvent("/login", "POST", false)]
        public static void Login(NameValueCollection headers, string Data, ref WebRequest.HttpResponse response)
        {
            string email = headers["email"], password = headers["password"];

            if (email == null || password == null)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing email or password");
                return;
            }

            User[] users = Binding.GetTable<User>().Select<User>("email", email);

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

            string Token = Sessions.AddSession(users[0]);

            response.AddToData("authtoken", Token);
            response.AddToData("userid", users[0].Id);

            response.StatusCode = 200;
            response.AddToData("message", "Logged in");
        }

        [WebEvent("/signup", "POST", false)]
        public static void SignUp(NameValueCollection headers, string Data, ref WebRequest.HttpResponse response)
        {
            string email = headers["email"], password = headers["password"], yearOfBirth = headers["yearOfBirth"];

            if (email == null || password == null)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing email or password");
                return;
            }

            User[] users = Binding.GetTable<User>().Select<User>("email", email);

            if (users.Length > 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Email is in use");
                return;
            }

            User user = new User();
            user.Email = email; user.Password = Security.Hashing.Hash(password);

            if (!int.TryParse(yearOfBirth, out user.YearOfBirth))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Year of Birth is invalid");
                return;
            }

            user.Insert(true);

            string Token = Sessions.AddSession(user);

            response.AddToData("authtoken", Token);
            response.AddToData("userid", user.Id);

            response.StatusCode = 200;
            response.AddToData("message", "Signed Up");
        }

        #endregion Methods
    }
}