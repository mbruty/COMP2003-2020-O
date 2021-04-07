using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Events.Restaurants;
using api.Backend.Security;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace api.Backend.Events.FoodItems
{
    class Fetch
    {
        [WebEvent(typeof(string), "/fooditem/me", "GET", false, SecurityGroup.Administrator)]
        public static async Task GetAllMyFoodItems(string body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Table table = Binding.GetTable<Data.Obj.FoodItem>();
            Data.Obj.FoodItem[] items = await table.SelectCustom<Data.Obj.FoodItem>(
                what: "DISTINCT FoodItem.*",
                tables: "tat.FoodItem, tat.LinkMenuFood, tat.Menu, tat.LinkMenuRestaurant, tat.Restaurant, tat.RestaurantAdmin",
                where: "(tat.FoodItem.FoodID=tat.LinkMenuFood.FoodID AND tat.LinkMenuFood.FoodID = tat.Menu.MenuID AND tat.Menu.MenuID = tat.LinkMenuRestaurant.MenuID AND tat.LinkMenuRestaurant.RestaurantID = tat.Restaurant.RestaurantID AND tat.Restaurant.OwnerID=@OID)",
                new System.Collections.Generic.List<System.Tuple<string, object>>()
                {
                    new System.Tuple<string, object>("OID",perm.admin_id)
                }
                );

            response.AddToData("message", "Fetched menu");
            response.AddObjectToData("items", items);
            response.StatusCode = 200;
        }
    }
}
