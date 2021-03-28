using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Collections.Specialized;
using System.Threading.Tasks;
using System;

namespace api.Backend.Events.Users
{
    public static class Modify
    {
        #region Methods

        [WebEvent(typeof(string), "/user/modify", "DELETE", false, SecurityGroup.User)]
        public static async Task DeleteUser(string Data, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            User[] users = await Binding.GetTable<User>().Select<User>("userid", perm.user_id);

            await users[0].Delete();

            response.AddToData("message", "Deleted User");
            response.StatusCode = 200;
        }

        [WebEvent(typeof(User), "/user/modify", "PUT", false, SecurityGroup.User)]
        public static async Task ModifyUser(User user, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Table table = Binding.GetTable<User>();
            User[] users = await table.Select<User>("userid", perm.user_id);

            User u = users[0];

            if (user.Password!=null && ValidityChecks.IsStrongPassword(user.Password)) { u.Password = Hashing.Hash(user.Password); }
            if (user.Email!=null && ValidityChecks.IsValidEmail(user.Email)) { u.Email = user.Email; }
            if (user.DateOfBirth!=null && user.DateOfBirth!=DateTime.MinValue) { u.DateOfBirth = user.DateOfBirth; }
            if (user.Nickname != null) { u.Nickname = user.Nickname; }

            response.AddToData("message", "Updated user");
            response.StatusCode = 200;
        }

        [WebEvent(typeof(NameValueCollection),"/user/modify/foods", "PUT", false, SecurityGroup.User)]
        public static async Task ModifyUserFoodChecks(NameValueCollection headers, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            User[] users = await Binding.GetTable<User>().Select<User>("userid", perm.user_id);

            Table table = Binding.GetTable<FoodChecks>();
            FoodChecks[] foods = await table.Select<FoodChecks>("userid", users[0].FoodCheckID);

            foods[0].UpdateContents<FoodChecks>(headers);

            response.AddToData("message", "Updated Foods");
            response.StatusCode = 200;
        }

        [WebEvent(typeof(NameValueCollection),"/user/modify/password", "POST", false, SecurityGroup.User)]
        public static async Task ModifyUserPassword(NameValueCollection headers, WebRequest.HttpResponse response, Security.SecurityPerm perm)
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

            Table table = Binding.GetTable<User>();
            User[] users = await table.Select<User>("userid", perm.user_id);

            users[0].Password = Hashing.Hash(headers["password"]);
            await users[0].UpdatePassword();

            response.AddToData("message", "Updated User Password");
            response.StatusCode = 200;
        }

        #endregion Methods
    }
}
