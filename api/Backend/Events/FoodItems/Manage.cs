﻿using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Backend.Events.FoodItems
{

    public class FoodTagsBody
    {
        public uint FoodTagID;
    }

    public static class Manage
    {
        #region Methods

        [WebEvent(typeof(FoodItemBody), "/fooditem/create", "POST", false, SecurityGroup.Administrator)]
        public static async Task CreatFoodItem(FoodItemBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.FoodChecks _checks = body.Checks;
            if (_checks == null) _checks = new FoodChecks();
            if (body.FoodName == null || body.FoodNameShort == null || body.FoodDescription == null || !body.Price.HasValue)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing Required Inputs");
                return;
            }

            if (body.Price.Value < 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Negative Price");
                return;
            }

            if (!await _checks.Insert<FoodChecks>(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            Data.Obj.FoodItem _item = new Data.Obj.FoodItem() { FoodDescription = body.FoodDescription, FoodName = body.FoodName, FoodNameShort = body.FoodNameShort, Price = body.Price.Value, Creator = perm.admin_id, FoodCheckID = _checks.FoodCheckID };

            if (!await _item.Insert<FoodItem>(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            List<Task> tasks = new List<Task>();

            foreach(FoodTagsBody ft in body.Tags)
            {
                tasks.Add(
                    new FoodItemTags() { FoodID = _item.FoodID, TagID = ft.FoodTagID }.Insert<FoodItemTags>()
                );
            }

            await Task.WhenAll(tasks);

            response.AddToData("message", "Created food item");
            response.AddObjectToData("item", _item);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(FoodItemBody), "/fooditem/delete", "delete", false, SecurityGroup.Administrator)]
        public static async Task DeleteFoodItem(FoodItemBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.FoodItem[] _items = await Binding.GetTable<FoodItem>().Select<FoodItem>(body.FoodID.Value);

            if (!_items.Any())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Incorrect FoodID");
                return;
            }

            if (_items[0].Creator != perm.admin_id)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Insignificant Permissions!");
                return;
            }

            if (!await _items[0].Delete<LinkMenuFood>())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Deleted food item");
            response.StatusCode = 200;
        }

        [WebEvent(typeof(FoodItemBody), "/fooditem/modify", "POST", false, SecurityGroup.Administrator)]
        public static async Task ModifyFoodItem(FoodItemBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.FoodItem[] _items = await Binding.GetTable<FoodItem>().Select<FoodItem>(body.FoodID.Value);

            if (!_items.Any())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Incorrect FoodID");
                return;
            }

            if (_items[0].Creator != perm.admin_id)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Insignificant Permissions!");
                return;
            }

            FoodItem _item = _items[0];

            if (body.FoodName != null) _item.FoodName = body.FoodName;
            if (body.FoodNameShort != null) _item.FoodNameShort = body.FoodNameShort;
            if (body.FoodDescription != null) _item.FoodDescription = body.FoodDescription;
            if (body.Price.HasValue) _item.Price = body.Price.Value;

            FoodTags[] _tags = await _item.GetFoodTags();

            List<Task> tasks = new List<Task>();

            if (body.Tags != null)
            {
                IEnumerable<FoodTagsBody> _nonDuplicateTags = body.Tags.Where(x => _tags.Count(y => x.FoodTagID == y.FoodTagID) == 0);

                foreach (FoodTagsBody ft in _nonDuplicateTags)
                {
                    tasks.Add(
                        new FoodItemTags() { FoodID = _item.FoodID, TagID = ft.FoodTagID }.Insert<FoodItemTags>()
                    );
                }
            }

            if (body.RemoveTags != null)
            {
                IEnumerable<FoodTagsBody> _DuplicateTags = body.RemoveTags.Where(x => _tags.Count(y => x.FoodTagID == y.FoodTagID) > 0);

                Table t = Binding.GetTable<FoodItemTags>();
                foreach (FoodTagsBody ft in _DuplicateTags)
                {
                    tasks.Add(
                        (await t.Select<FoodItemTags>(new object[] { body.FoodID, ft.FoodTagID }))[0]?.Delete<FoodItemTags>()
                    );
                }
            }

            await Task.WhenAll(tasks);

            if (!await _item.Update<FoodItem>())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Updated food item");
            response.AddObjectToData("food", _item);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(FoodCheckBody), "/fooditem/foodchecks", "POST", false, SecurityGroup.Administrator)]
        public static async Task FoodItemFoodChecks(FoodCheckBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            if (!body.FoodID.HasValue)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing Required Inputs");
                return;
            }

            FoodItem[] _items = await Binding.GetTable<FoodItem>().Select<FoodItem>(body.FoodID.Value);

            if (!_items.Any())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            if (_items[0].Creator != perm.admin_id)
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

        #endregion Methods
    }

    public class FoodCheckBody
    {
        #region Fields

        public uint? FoodID;

        public bool? IsVegetarian,
            IsVegan,
            IsHalal,
            IsKosher,
            HasLactose,
            HasNuts,
            HasGluten,
            HasEgg,
            HasSoy;

        #endregion Fields
    }

    public class FoodItemBody
    {
        #region Fields

        public uint? FoodID, MenuID, Creator;

        public string FoodName, FoodNameShort, FoodDescription;

        public decimal? Price;

        public FoodTagsBody[] Tags;
        public FoodTagsBody[] RemoveTags;

        public FoodChecks Checks;


    #endregion Fields
    }
}
