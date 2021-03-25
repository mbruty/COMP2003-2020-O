using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class SwipeData : Object
    {
        #region Fields

        public uint FoodID, RightSwipes, LeftSwipes;

        public DateTime SwipeDate;

        #endregion Fields

        #region Methods

        public async Task<FoodItem> GetFood()
        {
            return (await Binding.GetTable<FoodItem>().Select<FoodItem>(FoodID))?[0];
        }

        #endregion Methods
    }
}
