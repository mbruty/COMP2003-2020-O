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
        public bool IsChildMenu;
        public string MenuName;
    }

    public static class Menu_Fetch
    {
        [WebEvent(typeof(MenuBody), "/menu", "GET", false, SecurityGroup.None)]
        public static async Task GetMenu(MenuBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
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

            response.AddToData("message", "Fetched menu");
            response.AddObjectToData("menu", menu);
            response.AddObjectToData("menu-times", await menu.GetMenuTimes());
            response.StatusCode = 200;
        }

        [WebEvent(typeof(MenuBody), "/menu/items", "GET", false, SecurityGroup.None)]
        public static async Task GetMenuItems(MenuBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
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

            response.AddToData("message", "Fetched menu");
            response.AddObjectToData("menu", menu);
            response.AddObjectToData("fooditems",await menu.GetFoodItems());
            response.StatusCode = 200;
        }

        [WebEvent(typeof(MenuBody), "/menu/me", "GET", false, SecurityGroup.Administrator)]
        public static async Task GetAllMyMenus(MenuBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
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

            response.AddToData("message", "Fetched menu");
            response.AddObjectToData("menus", menus);
            response.StatusCode = 200;
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


            Data.Obj.MenuTimes[] menutimes = await Binding.GetTable<Data.Obj.MenuTimes>().SelectCustom<Data.Obj.MenuTimes>(
                what: "tat.MenuTimes.MenuRestID,tat.MenuTimes.DayRef,tat.MenuTimes.StartServing,tat.MenuTimes.TimeServing",
                tables: "tat.MenuTimes, tat.LinkMenuRestaurant, tat.Restaurant",
                where: "(tat.MenuTimes.MenuRestID=tat.LinkMenuRestaurant.MenuRestID AND tat.LinkMenuRestaurant.RestaurantID = tat.Restaurant.RestaurantID AND tat.Restaurant.OwnerID=@OID)",
                new System.Collections.Generic.List<System.Tuple<string, object>>()
                {
                    new System.Tuple<string, object>("OID",perm.admin_id)
                }
                );

            var tasks = new List<Task>();
            foreach (Menu menu in menus)
            {
                tasks.Add(menu.GetFoodItemsAndStore());
            }

            Task t = Task.WhenAll(tasks);
            try
            {
                t.Wait();
                response.AddToData("message", "Fetched menu");
                response.AddObjectToData("menus", menus);
                response.AddObjectToData("menu-times", menutimes);
                response.StatusCode = 200;
            }
            catch
            {
                response.StatusCode = 500;
            }
        }
    }
}
