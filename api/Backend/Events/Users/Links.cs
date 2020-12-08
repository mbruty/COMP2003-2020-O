using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Collections.Specialized;

namespace api.Backend.Events.Users
{
    public static class Fetch
    {
        [WebEvent("/fetch/user/me","GET",false,SecurityGroup.User)]
        public static async void GetUserData(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            User[] users = await Binding.GetTable<User>().Select<User>("userid", headers["userid"]);

            response.AddObjectToData("user", users[0]);
            response.StatusCode = 200;
        }
    }
}
