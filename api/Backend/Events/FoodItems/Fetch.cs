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

            response.AddObjectToData("items", items);
            response.StatusCode = 200;
        }




        // Get all the info for the item builder
        [WebEvent(typeof(string), "/fooditem/verbose/:id:", "GET", false, SecurityGroup.Administrator)]
        public static async Task GetFoodItemByID(string id, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            // Get the food items
            Table table = Binding.GetTable<Data.Obj.FoodItem>();
            Data.Obj.FoodItem[] items = await table.SelectCustom<Data.Obj.FoodItem>(
                what: "DISTINCT FoodItem.*",
                tables: "tat.FoodItem, tat.LinkMenuFood, tat.Menu, tat.LinkMenuRestaurant, tat.Restaurant, tat.RestaurantAdmin",
                where: "(tat.FoodItem.FoodID=tat.LinkMenuFood.FoodID AND tat.LinkMenuFood.FoodID = tat.Menu.MenuID AND tat.Menu.MenuID = tat.LinkMenuRestaurant.MenuID AND tat.LinkMenuRestaurant.RestaurantID = tat.Restaurant.RestaurantID AND tat.Restaurant.OwnerID=@OID AND tat.FoodItem.FoodID=@FID)",
                new System.Collections.Generic.List<System.Tuple<string, object>>()
                {
                    new System.Tuple<string, object>("OID",perm.admin_id),
                    new System.Tuple<string, object>("FID", id)
                }
                );

            if(items.Length == 0)
            {
                // Either it doesn't exist or they aren't the owner
                response.StatusCode = 404;
                return;
            }

            // We should only be getting 1 item so can just assume it's at [0]
            // Get the food checks
            Data.Obj.FoodChecks[] checks = await Binding.GetTable<Data.Obj.FoodChecks>().Select<Data.Obj.FoodChecks>("FoodCheckID", items[0].FoodCheckID);

            // Get the tags
            Table t2 = Binding.GetTable<Data.Obj.FoodTags>();
            Data.Obj.FoodTags[] tags = await t2.SelectCustom<Data.Obj.FoodTags>(
                what: "tat.FoodTags.*",
                tables: "tat.FoodTags, tat.FoodItemTags",
                where: "tat.FoodTags.FoodTagID = tat.FoodItemTags.TagID AND tat.FoodItemTags.FoodID = @FID",
                new System.Collections.Generic.List<System.Tuple<string, object>>()
                {
                    new System.Tuple<string, object>("FID", id)
                }
                );


            response.AddObjectToData("fooditem", items[0]);
            response.AddObjectToData("checks", checks[0]);
            response.AddObjectToData("tags", tags);
            response.StatusCode = 200;
        }

    }
}
