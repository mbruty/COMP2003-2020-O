using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;
using System.Linq;
using System.Collections.Generic;

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
            return await Binding.GetTable<FoodItem>().SelectCustom<FoodItem>(
                tables: "LinkMenuFood,FoodItem",
                where: "LinkMenuFood.MenuID = @ParaMenuID AND LinkMenuFood.FoodID = FoodItem.FoodID",
                Params: new List<Tuple<string, object>>() { new Tuple<string, object>("ParaMenuID", MenuID) }
                );
        }
    }
}
