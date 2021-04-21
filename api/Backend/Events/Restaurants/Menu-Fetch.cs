using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Linq;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Threading.Tasks;

namespace api.Backend.Events.Restaurants
{
    public class MenuBody
    {
        public uint MenuID, RestaurantID;
        public bool? IsChildMenu;
        public string MenuName;
    }

    public class MenuWithTimes
    {
        public Menu menu { get; set; }
        public MenuTimes[] times { get; set; }
    }

    public static class Menu_Fetch
    {
        [WebEvent(typeof(string), "/menu/:id:", "GET", false, SecurityGroup.None)]
        public static async Task GetMenu(string body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Table table = Binding.GetTable<Data.Obj.Menu>();
            if (!int.TryParse(body, out int id))
            {
                // We couldn't convert it to an int
                response.StatusCode = 400; // BadRequest
                response.AddToData("Error", "Menu ID is not a number");
                return;
            }
            Data.Obj.Menu[] menus = await table.Select<Data.Obj.Menu>(id);

            if (menus.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "That Menu Id does not exist");
                return;
            }

            Data.Obj.Menu menu = menus[0];

            response.AddToData("message", "Fetched menu");
            response.AddObjectToData("menu", menu);
            response.AddObjectToData("menu-times", await menu.GetMenuTimes());
            response.StatusCode = 200;
        }

        [WebEvent(typeof(string), "/menu/items/:id:", "GET", false, SecurityGroup.None)]
        public static async Task GetMenuItems(string body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Table table = Binding.GetTable<Data.Obj.Menu>();
            if(!int.TryParse(body, out int id))
            {
                // We couldn't convert it to an int
                response.StatusCode = 400; // BadRequest
                response.AddToData("Error", "Menu ID is not a number");
                return;
            }
            Data.Obj.Menu[] menus = await table.Select<Data.Obj.Menu>(id);

            if (menus.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "That Menu Id does not exist");
                return;
            }

            Data.Obj.Menu menu = menus[0];
            await menu.GetFoodItemsAndStore();
            await menu.GetMenuTimesAndStore();
            response.AddToData("message", "Fetched menu");
            response.AddObjectToData("menu", menu);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(string), "/menu/me", "GET", false, SecurityGroup.Administrator)]
        public static async Task GetAllMyMenus(string body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Table table = Binding.GetTable<Data.Obj.Menu>();
            Data.Obj.Menu[] menus = await table.SelectCustom<Data.Obj.Menu>(
                what: "tat.Menu.MenuID,tat.Menu.MenuName,tat.Menu.IsChildMenu",
                tables: "tat.Menu, tat.LinkMenuRestaurant, tat.Restaurant",
                where: "(tat.Menu.MenuID=tat.LinkMenuRestaurant.MenuID AND tat.LinkMenuRestaurant.RestaurantID = tat.Restaurant.RestaurantID AND tat.Restaurant.OwnerID=@OID)",
                new System.Collections.Generic.List<System.Tuple<string, object>>()
                {
                    new System.Tuple<string, object>("OID",perm.admin_id)
                }
                );

            var tasks = new List<Task>();
            foreach (Menu menu in menus)
            {
                tasks.Add(menu.GetMenuTimesAndStore());
            }

            Task t = Task.WhenAll(tasks);
            try
            {
                t.Wait();
                response.AddToData("message", "Fetched menu");
                response.AddObjectToData("menus", menus);
                response.StatusCode = 200;
            }
            catch
            {
                response.StatusCode = 500;
            }
        }


        [WebEvent(typeof(MenuBody), "/menu/me/with-items", "GET", false, SecurityGroup.Administrator)]
        public static async Task GetAllMenusWithItems(MenuBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Table table = Binding.GetTable<Data.Obj.Menu>();
            Data.Obj.Menu[] menus = await table.SelectCustom<Data.Obj.Menu>(
                what: "tat.Menu.MenuID,tat.Menu.MenuName,tat.Menu.IsChildMenu",
                tables: "tat.Menu, tat.LinkMenuRestaurant, tat.Restaurant",
                where: "(tat.Menu.MenuID=tat.LinkMenuRestaurant.MenuID AND tat.LinkMenuRestaurant.RestaurantID = tat.Restaurant.RestaurantID AND tat.Restaurant.OwnerID=@OID)",
                new System.Collections.Generic.List<System.Tuple<string, object>>()
                {
                    new System.Tuple<string, object>("OID",perm.admin_id)
                }
                );


            var tasks = new List<Task>();
            foreach (Menu menu in menus)
            {
                tasks.Add(menu.GetFoodItemsAndStore());
                // We're getting an error here and I can't fix
                //tasks.Add(menu.GetMenuTimesAndStore());
            }

            Task t = Task.WhenAll(tasks);
            try
            {
                t.Wait();
                response.AddToData("message", "Fetched menu");
                response.AddObjectToData("menus", menus);
                response.StatusCode = 200;
            }
            catch (System.Exception e)
            {
                response.StatusCode = 500;
            }
        }
    }
}
