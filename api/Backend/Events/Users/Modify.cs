﻿using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Collections.Specialized;
using System.Threading.Tasks;

namespace api.Backend.Events.Users
{
    public static class Modify
    {
        #region Methods

        [WebEvent("/modify/user", "DELETE", false, SecurityGroup.User)]
        public static async Task DeleteUser(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            User[] users = await Binding.GetTable<User>().Select<User>("id", headers["userid"]);

            await users[0].Delete();

            response.AddToData("message", "Deleted User");
            response.StatusCode = 200;
        }

        [WebEvent("/modify/user", "PUT", false, SecurityGroup.User)]
        public static async Task ModifyUser(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            Table table = Binding.GetTable<User>();
            User[] users = await table.Select<User>("userid", headers["userid"]);

            users[0].UpdateContents<User>(headers);

            response.AddToData("message", "Updated user");
            response.StatusCode = 200;
        }

        [WebEvent("/modify/user/foods", "PUT", false, SecurityGroup.User)]
        public static async Task ModifyUserFoodChecks(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            if (!await Sessions.CheckSession(headers, response)) return;

            User[] users = await Binding.GetTable<User>().Select<User>("userid", headers["userid"]);

            Table table = Binding.GetTable<FoodChecks>();
            FoodChecks[] foods = await table.Select<FoodChecks>("userid", users[0].FoodCheckID);

            foods[0].UpdateContents<FoodChecks>(headers);

            response.AddToData("message", "Updated Foods");
            response.StatusCode = 200;
        }

        [WebEvent("/modify/user/password", "POST", false, SecurityGroup.User)]
        public static async Task ModifyUserPassword(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
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
            User[] users = await table.Select<User>("userid", headers["userid"]);

            users[0].Password = Hashing.Hash(headers["password"]);
            await users[0].UpdatePassword();

            response.AddToData("message", "Updated User Password");
            response.StatusCode = 200;
        }

        #endregion Methods
    }
}
