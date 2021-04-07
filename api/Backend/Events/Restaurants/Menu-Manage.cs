using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.Threading.Tasks;

namespace api.Backend.Events.Restaurants
{
    public static class Menu_Manage
    {
        [WebEvent(typeof(MenuBody), "/menu/create", "POST", false, SecurityGroup.Administrator)]
        public static async Task CreateRestaurant(MenuBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.Menu _menu = new Data.Obj.Menu() { MenuID = body.MenuID, IsChildMenu = body.IsChildMenu, MenuName = body.MenuName };

            if (!await _menu.Insert(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Created menu");
            response.AddObjectToData("menu", _menu);
            response.StatusCode = 200;
        }
    }
}
