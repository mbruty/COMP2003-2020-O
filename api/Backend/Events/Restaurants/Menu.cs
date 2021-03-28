using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.Threading.Tasks;

namespace api.Backend.Events.Restaurants
{
    public static class Menu
    {
        public class MenuBody
        {
            public uint MenuID, RestaurantID;
            public bool IsChildMenu;
            public string MenuName;
        }

        [WebEvent(typeof(MenuBody), "/menu", "GET", false, SecurityGroup.None)]
        public static async Task GetRestaurant(MenuBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Table table = Binding.GetTable<Data.Obj.Menu>();
            Data.Obj.Menu[] menus = await table.Select<Data.Obj.Menu>(body.MenuID);

            if (menus.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "That Menu Id does not exist");
                return;
            }

            Data.Obj.Menu menu = menus[0];

            //if (menu.OwnerID != perm.admin_id)
            //{
            //    response.StatusCode = 401;
            //    response.AddToData("error", "This is not your restaurant");
            //    return;
            //}

            response.AddToData("message", "Fetched menu");
            response.AddObjectToData("menu", menu);
            response.StatusCode = 200;
        }
    }
}
