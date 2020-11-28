using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace api.Backend.Data.Obj
{
    public class Menu : Object
    {
        #region Fields

        public bool IsChildMenu;
        public uint MenuID;

        public string MenuName;

        #endregion Fields

        public async Task<FoodItem[]> GetFoodItems()
        {
            return await Binding.GetTable<FoodItem>().SelectCustom<FoodItem>("LinkMenuFood,FoodItem", "FoodItem.*",$"LinkMenuFood.MenuID = {MenuID} AND LinkMenuFood.FoodID = FoodItem.FoodID");
        }
    }
}
