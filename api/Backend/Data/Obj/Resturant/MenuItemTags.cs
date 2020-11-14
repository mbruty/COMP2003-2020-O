using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class MenuItemTags : Object
    {
        #region Fields

        public int MenuId, FoodTagId;

        #endregion Fields
        #region Properties

        #endregion Fields

        #region Properties

        public async Task<FoodTags> GetFoodTag()
        { return (await Binding.GetTable<FoodTags>().Select<FoodTags>("Id", FoodTagId))?[0]; }

        public async Task<MenuItem> GetMenuItem()
        { return (await Binding.GetTable<MenuItem>().Select<MenuItem>("Id", MenuId))?[0]; }

        #endregion Properties
    }
}