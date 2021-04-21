using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Menu : Object
    {
        #region Fields

        public bool IsChildMenu;
        public uint MenuID;
        public FoodItem[] FoodItems;
        public MenuTimes[] MenuTimes;
        public string MenuName;

        #endregion Fields

        #region Methods

        public async Task<MenuTimes[]> GetMenuTimes()
        {
            return await Binding.GetTable<Data.Obj.MenuTimes>().SelectCustom<Data.Obj.MenuTimes>(
                what: "tat.MenuTimes.MenuRestID,tat.MenuTimes.DayRef,tat.MenuTimes.StartServing,tat.MenuTimes.TimeServing",
                tables: "tat.MenuTimes, tat.LinkMenuRestaurant, tat.Restaurant",
                where: "(tat.MenuTimes.MenuRestID=tat.LinkMenuRestaurant.MenuRestID AND tat.LinkMenuRestaurant.MenuID = @MID)",
                new System.Collections.Generic.List<System.Tuple<string, object>>()
                {
                    new System.Tuple<string, object>("MID",MenuID)
                }
                );
        }

        public async Task GetMenuTimesAndStore()
        {
            MenuTimes = await Binding.GetTable<Data.Obj.MenuTimes>().SelectCustom<Data.Obj.MenuTimes>(
                what: "tat.MenuTimes.MenuRestID,tat.MenuTimes.DayRef,tat.MenuTimes.StartServing,tat.MenuTimes.TimeServing",
                tables: "tat.MenuTimes, tat.LinkMenuRestaurant, tat.Restaurant",
                where: "(tat.MenuTimes.MenuRestID=tat.LinkMenuRestaurant.MenuRestID AND tat.LinkMenuRestaurant.MenuID = @MID)",
                new System.Collections.Generic.List<System.Tuple<string, object>>()
                {
                    new System.Tuple<string, object>("MID",MenuID)
                }
                );
        }


        public async Task<FoodItem[]> GetFoodItems()
        {
            return await Binding.GetTable<FoodItem>().SelectCustom<FoodItem>(
                tables: "LinkMenuFood,FoodItem",
                where: "LinkMenuFood.MenuID = @ParaMenuID AND LinkMenuFood.FoodID = FoodItem.FoodID",
                Params: new List<Tuple<string, object>>() { new Tuple<string, object>("ParaMenuID", MenuID) }
                );
        }

        public async Task GetFoodItemsAndStore()
        {
            FoodItems = await Binding.GetTable<FoodItem>().SelectCustom<FoodItem>(
                tables: "LinkMenuFood,FoodItem",
                where: "LinkMenuFood.MenuID = @ParaMenuID AND LinkMenuFood.FoodID = FoodItem.FoodID",
                Params: new List<Tuple<string, object>>() { new Tuple<string, object>("ParaMenuID", MenuID) }
                );
        }

        public async Task<LinkMenuRestaurant[]> GetRestaurantLinks()
        {
            return await Binding.GetTable<LinkMenuRestaurant>().Select<LinkMenuRestaurant>("MenuID", MenuID);
        }

        public async Task<Restaurant[]> GetRestaurants()
        {
            return await Binding.GetTable<Restaurant>().SelectCustom<Restaurant>(
                tables: "LinkMenuRestaurant,Restaurant",
                where: "LinkMenuRestaurant.MenuID = @ParaMenuID AND LinkMenuRestaurant.RestaurantID = Restaurant.RestaurantID",
                Params: new List<Tuple<string, object>>() { new Tuple<string, object>("ParaMenuID", MenuID) }
                );
        }

        #endregion Methods
    }
}
