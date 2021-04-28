using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Linq;
using System.Threading.Tasks;

namespace api.Backend.Events.RestaurantAdmins
{
    class Modify
    {
        [WebEvent(typeof(RestaurantAdmin), "/admin/modify", "PUT", false, SecurityGroup.Administrator)]
        public static async Task ModifyAdmin(RestaurantAdmin body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Table table = Binding.GetTable<RestaurantAdmin>();
            RestaurantAdmin[] admins = await table.Select<RestaurantAdmin>(perm.admin_id);

            RestaurantAdmin u = admins[0];

            if (body.Password != null && ValidityChecks.IsStrongPassword(body.Password)) { u.Password = Hashing.Hash(body.Password); }
            if (body.Email != null && ValidityChecks.IsValidEmail(body.Email)) { u.Email = body.Email; }
            if (body.DashLayout != null) { u.DashLayout = body.DashLayout; }

            response.AddToData("message", "Updated admin");
            response.StatusCode = 200;
        }
    }
}
