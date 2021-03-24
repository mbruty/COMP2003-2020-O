using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class LinkCategoryFood : Object
    {
        #region Fields

        public uint CategoryID, FoodID;

        #endregion Fields

        #region Methods

        public async Task<FoodItem> GetFoodItem()
        {
            return (await Binding.GetTable<FoodItem>().Select<FoodItem>(FoodID))?[0];
        }

        public async Task<Category> GetCatagory()
        {
            return (await Binding.GetTable<Category>().Select<Category>(CategoryID))?[0];
        }

        #endregion Methods
    }
}
