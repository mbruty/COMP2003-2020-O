using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Backend.Events.FoodItems
{
    public class FoodItemBody
    {
        public uint FoodID, MenuID, Creator;

        public string FoodName, FoodNameShort, FoodDescription;

        public decimal Price;

        public FoodTagsBody[] Tags;

        public FoodChecks Checks;

    }

    public class FoodTagsBody
    {
        public uint FoodTagID;
    }

    public static class Manage
    {

        [WebEvent(typeof(FoodItemBody), "/fooditem/create", "POST", false, SecurityGroup.Administrator)]
        public static async Task CreateRestaurant(FoodItemBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.FoodChecks _checks = body.Checks;

            if (! await _checks.Insert(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            Data.Obj.FoodItem _item = new Data.Obj.FoodItem() { FoodDescription = body.FoodDescription, FoodName = body.FoodName, FoodNameShort = body.FoodNameShort, Price = body.Price, Creator = perm.admin_id, FoodCheckID = _checks.FoodCheckID };


            if (!await _item.Insert(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            List<Task> tasks = new List<Task>();

            foreach(FoodTagsBody ft in body.Tags)
            {
                tasks.Add(
                    new FoodItemTags() { FoodID = _item.FoodID, TagID = ft.FoodTagID }.Insert()
                );
            }

            await Task.WhenAll(tasks);

            response.AddToData("message", "Created food item");
            response.AddObjectToData("item", _item);
            response.StatusCode = 200;
        }
    }
}
