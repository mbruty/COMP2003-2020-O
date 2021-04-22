using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System;
using System.Threading.Tasks;

namespace api.Backend.Events.FoodItems
{
    public class FoodItemBody
    {
        public uint FoodID, MenuID;

        public string FoodName, FoodNameShort, FoodDescription;

        public decimal Price;

    }

    public static class Manage
    {

        [WebEvent(typeof(FoodItemBody), "/fooditem/create", "POST", false, SecurityGroup.Administrator)]
        public static async Task CreateRestaurant(FoodItemBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.FoodItem _item = new Data.Obj.FoodItem() { FoodDescription = body.FoodDescription, FoodName = body.FoodName, FoodNameShort = body.FoodNameShort, Price = body.Price };

            if (!await _item.Insert(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            LinkMenuFood _link = new LinkMenuFood() { FoodID = _item.FoodID, MenuID = body.MenuID };

            if (!await _link.Insert(false))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                await _item.Delete();
                return;
            }

            response.AddToData("message", "Created food item");
            response.AddObjectToData("item", _item);
            response.StatusCode = 200;
        }
    }
}
