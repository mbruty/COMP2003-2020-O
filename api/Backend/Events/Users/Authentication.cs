using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System;
using System.Collections.Specialized;
using System.Threading;

namespace api.Backend.Events.Users
{
    public static class Authentication
    {
        #region Methods

        [WebEvent("/authcheck", "POST", false)]
        public static async void CheckAuthHttp(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            if (!await Sessions.CheckSession(headers, response)) return;

            response.StatusCode = 200;
            response.AddToData("message", "You are logged in");
        }

        [WebEvent("/authcheck")]
        public static async void CheckAuthWebSocket(WebSockets.SocketInstance instance, WebSockets.SocketRequest @event, WebSockets.SocketResponse response)
        {
            if (!await Sessions.CheckSession(@event.Data, response)) return;

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

            User[] users = await Binding.GetTable<User>().Select<User>("email", email, 1);

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

            string Token = Sessions.RandomString();
            await Sessions.AddSession(users[0], Token);

            response.AddToData("authtoken", Token);
            response.AddToData("userid", users[0].UserID);

            response.StatusCode = 200;
            response.AddToData("message", "Logged in");
        }

        [WebEvent("/signup", "POST", false)]
        public static async void SignUp(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            string email = headers["email"], password = headers["password"], dateOfBirth = headers["dateOfBirth"], nickname = headers["nickname"];

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

            User user = new User() { Email = email, Password = "PASSWORD PENDING" };

            if (!DateTime.TryParse(dateOfBirth, out user.DateOfBirth))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Year of Birth is invalid");
                return;
            }

            if (nickname != null) user.Nickname = nickname;

            if (!await user.Insert(true))
            {
                response.StatusCode = 501;
                response.AddToData("error", "Database Insertion Failure");
                return;
            }

            string token = Sessions.RandomString();

            new Thread(async () => { user.Password = Hashing.Hash(password); await user.Update(); await Sessions.AddSession(user, token); }).Start();

            response.AddToData("authtoken", token);
            response.AddToData("userid", user.UserID);

            response.StatusCode = 200;
            response.AddToData("message", "Signed Up");
        }

        #endregion Methods
    }
}
