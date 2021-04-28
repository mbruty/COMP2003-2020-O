using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class FoodItem : Object
    {
        #region Fields

        public uint FoodID, FoodCheckID, Creator;

        public string FoodName, FoodNameShort, FoodDescription;

        public decimal Price;

        #endregion Fields

        #region Methods

        public async Task<FoodChecks> GetFoodCheck()
        {
            return (await Binding.GetTable<FoodChecks>().Select<FoodChecks>(FoodCheckID))?[0];
        }

        public async Task<FoodTags[]> GetFoodTags()
        {
            return await Binding.GetTable<FoodTags>().SelectCustom<FoodTags>(
                tables: "FoodItemTags,FoodTags",
                where: "FoodItemTags.FoodID = @ParaFoodID AND FoodItemTags.TagID = FoodTags.FoodTagID",
                Params: new List<Tuple<string, object>>() { new Tuple<string, object>("ParaFoodID", FoodID) }
                );
        }

        //public async Task<RestaurantAdmin> GetOwner()
        //{
        //    return (await Binding.GetTable<RestaurantAdmin>().SelectCustom<RestaurantAdmin>(
        //        tables: "FoodItem, LinkMenuFood, Menu, LinkMenuRestaurant, Restaurant, RestaurantAdmin",
        //        where: "FoodItem.FoodID = @FID AND FoodItem.FoodID = LinkMenuFood.FoodID AND LinkMenuFood.MenuID = Menu.MenuID AND Menu.MenuID = LinkMenuRestaurant.MenuID AND LinkMenuRestaurant.RestaurantID = Restaurant.RestaurantID AND Restaurant.OwnerID = RestaurantAdmin.RAdminID",
        //        Params: new List<Tuple<string, object>>() { new Tuple<string, object>("FID", FoodID) }
        //        ))?[0];
        //}

        public async Task<SwipeData[]> GetSwipeData()
        {
            return (await Binding.GetTable<SwipeData>().Select<SwipeData>(FoodID));
        }

        #endregion Methods
    }
}
