using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Collections.Specialized;

namespace api.Backend.Events.Users
{
    public static class Modify
    {
        #region Methods

        [WebEvent("/modify/user", "DELETE", false)]
        public static async void DeleteUser(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            if (!await Sessions.CheckSession(headers, response)) return;

            User[] users = await Binding.GetTable<User>().Select<User>("id", headers["userid"]);

            await users[0].Delete();

            response.AddToData("message", "Deleted User");
            response.StatusCode = 200;
        }

        [WebEvent("/modify/user", "PUT", false)]
        public static async void ModifyUser(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            if (!await Sessions.CheckSession(headers, response)) return;

            Table table = Binding.GetTable<User>();
            User[] users = await table.Select<User>("id", headers["userid"]);

            users[0].UpdateContents<User>(headers);

            response.AddToData("message", "Updated user");
            response.StatusCode = 200;
        }

        [WebEvent("/modify/user/foods", "PUT", false)]
        public static async void ModifyUserFoodChecks(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            if (!await Sessions.CheckSession(headers, response)) return;

            User[] users = await Binding.GetTable<User>().Select<User>("id", headers["userid"]);

            Table table = Binding.GetTable<FoodChecks>();
            FoodChecks[] foods = await table.Select<FoodChecks>("id", users[0].CheckId);

            foods[0].UpdateContents<FoodChecks>(headers);

            response.AddToData("message", "Updated Foods");
            response.StatusCode = 200;
        }

        [WebEvent("/modify/user/password", "POST", false)]
        public static async void ModifyUserPassword(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            string password = headers["password"];

            if (password == null)
            {
                response.AddToData("error", "No password provided");
                response.StatusCode = 401;
                return;
            }

            if (!ValidityChecks.IsStrongPassword(password))
            {
                response.AddToData("error", "Password is too weak");
                response.StatusCode = 401;
                return;
            }

            if (!await Sessions.CheckSession(headers, response)) return;

            Table table = Binding.GetTable<User>();
            User[] users = await table.Select<User>("id", headers["userid"]);

            users[0].Password = Hashing.Hash(headers["password"]);
            await users[0].Update();

            response.AddToData("message", "Updated User Password");
            response.StatusCode = 200;
        }

        #endregion Methods
    }
}
