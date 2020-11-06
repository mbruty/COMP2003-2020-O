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

            Table table = Binding.GetTable<User>();
            User[] users = table.Select<User>("id", headers["userid"]);

            users[0].UpdateContents<User>(headers);

            response.AddToData("message", "Updated user");
            response.StatusCode = 200;
        }

        #endregion Methods
    }
}