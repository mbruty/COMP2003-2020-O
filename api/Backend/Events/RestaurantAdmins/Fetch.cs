using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Linq;
using System.Threading.Tasks;

namespace api.Backend.Events.RestaurantAdmins
{
    public static class Fetch
    {
        [WebEvent(typeof(string), "/admin/me", "GET", false, SecurityGroup.Administrator)]
        public static async Task GetUserData(string Data, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            RestaurantAdmin[] admins = await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>(perm.admin_id);

            response.AddObjectToData("admin", admins[0]);
            response.StatusCode = 200;
        }
    }
}
