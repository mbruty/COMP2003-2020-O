﻿using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Linq;
using System.Threading.Tasks;

namespace api.Backend.Events.Users
{
    public static class Fetch
    {
        #region Methods

        [WebEvent(typeof(string), "/user/visits", "GET", false, SecurityGroup.User)]
        public static async Task GetRecentVisits(string Data, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            User[] users = await Binding.GetTable<User>().Select<User>("userid", perm.user_id);

            Visit[] visits = await users[0].GetVisits();
            response.AddObjectToData("visits", visits.OrderBy(x => x.DateOfVisit).Take(20).ToArray());
            response.StatusCode = 200;
        }

        [WebEvent(typeof(string), "/user/me", "GET", false, SecurityGroup.User)]
        public static async Task GetUserData(string Data, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            User[] users = await Binding.GetTable<User>().Select<User>("userid", perm.user_id);

            response.AddObjectToData("user", users[0]);
            response.StatusCode = 200;
        }

        #endregion Methods
    }
}
