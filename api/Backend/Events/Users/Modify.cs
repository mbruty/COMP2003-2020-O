using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System;
using System.Collections.Specialized;
using System.Linq;
using System.Reflection;

namespace api.Backend.Events.Users
{
    public static class Modify
    {
        #region Methods

        [WebEvent("/modify/user", "PUT", false)]
        public static void ModifyUser(NameValueCollection headers, string Data, ref WebRequest.HttpResponse response)
        {
            if (!Sessions.CheckSession(headers, ref response)) return;

            Type t = typeof(User);
            Table table = Binding.GetTable<User>();
            User[] users = table.Select<User>("id", headers["userid"]);

            foreach (FieldInfo field in t.GetFields())
            {
                if (headers.AllKeys.Contains(field.Name.ToLower()) && table.AutoIncrement.Count(x => x.Field.ToLower() == field.Name.ToLower()) == 0)
                {
                    field.SetValue(users[0], headers[field.Name]);
                }
            }

            users[0].Update();

            response.AddToData("message", "Updated user");
            response.StatusCode = 200;
        }

        #endregion Methods
    }
}