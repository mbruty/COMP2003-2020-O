using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class FoodItem : Object
    {
        #region Fields

        public uint FoodID, FoodCheckID;

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

        #endregion Methods
    }
}
