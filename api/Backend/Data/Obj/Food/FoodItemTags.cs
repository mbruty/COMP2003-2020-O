using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class FoodItemTags : Object
    {
        #region Fields

        public uint FoodID, TagID;

        #endregion Fields

        #region Methods

        public async Task<FoodTags> GetFoodTags()
        {
            return (await Binding.GetTable<FoodTags>().Select<FoodTags>(TagID))?[0];
        }

        #endregion Methods
    }
}
