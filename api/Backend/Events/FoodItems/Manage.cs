using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace api.Backend.Events.FoodItems
{
    public class FoodItemBody
    {
        public uint FoodID, MenuID;

        public string FoodName, FoodNameShort, FoodDescription;

        public decimal Price;

    }

    public class FoodCheckBody
    {
        public uint FoodID;

        public bool? IsVegetarian,
            IsVegan,
            IsHalal,
            IsKosher,
            HasLactose,
            HasNuts,
            HasGluten,
            HasEgg,
            HasSoy;
    }

    public static class Manage
    {
        [WebEvent(typeof(FoodItemBody), "/fooditem/create", "POST", false, SecurityGroup.Administrator)]
        public static async Task CreatFoodItem(FoodItemBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.FoodItem _item = new Data.Obj.FoodItem() { FoodDescription = body.FoodDescription, FoodName = body.FoodName, FoodNameShort = body.FoodNameShort, Price = body.Price };

            if (!await _item.Insert<FoodItem>(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            LinkMenuFood _link = new LinkMenuFood() { FoodID = _item.FoodID, MenuID = body.MenuID };

            if (!await _link.Insert<LinkMenuFood>(false))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                await _item.Delete<FoodItem>();
                return;
            }

            response.AddToData("message", "Created food item");
            response.AddObjectToData("item", _item);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(FoodCheckBody), "/fooditem/foodchecks", "POST", false, SecurityGroup.Administrator)]
        public static async Task FoodItemFoodChecks(FoodCheckBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            FoodItem[] _items = await Binding.GetTable<FoodItem>().Select<FoodItem>(body.FoodID);

            if (!_items.Any())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            RestaurantAdmin _owner = await _items[0].GetOwner();

            if (_owner.RAdminID != perm.admin_id)
            {
                response.StatusCode = 401;
                response.AddToData("error", "This is not your food items");
                return;
            }

            FoodChecks _check = (await Binding.GetTable<FoodChecks>().Select<FoodChecks>(_items[0].FoodCheckID))?[0];

            if (body.HasEgg.HasValue) _check.HasEgg = body.HasEgg.Value;
            if (body.HasGluten.HasValue) _check.HasGluten = body.HasGluten.Value;
            if (body.HasLactose.HasValue) _check.HasLactose = body.HasLactose.Value;
            if (body.HasNuts.HasValue) _check.HasNuts = body.HasNuts.Value;
            if (body.HasSoy.HasValue) _check.HasSoy = body.HasSoy.Value;
            if (body.IsHalal.HasValue) _check.IsHalal = body.IsHalal.Value;
            if (body.IsKosher.HasValue) _check.IsKosher = body.IsKosher.Value;
            if (body.IsVegan.HasValue) _check.IsVegan = body.IsVegan.Value;
            if (body.IsVegetarian.HasValue) _check.IsVegetarian = body.IsVegetarian.Value;

            if (!await _check.Update<FoodChecks>())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Updated Food Checks");
            response.AddObjectToData("foodcheck", _check);
            response.StatusCode = 200;
        }
    }
}
