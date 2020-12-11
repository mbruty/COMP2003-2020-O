using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class LinkMenuFood : Object
    {
        #region Fields

        public uint MenuID, FoodID;

        #endregion Fields

        #region Methods

        public async Task<FoodItem> GetFoodItem()
        {
            return (await Binding.GetTable<FoodItem>().Select<FoodItem>(FoodID))?[0];
        }

        public async Task<Menu> GetMenu()
        {
            return (await Binding.GetTable<Menu>().Select<Menu>(MenuID))?[0];
        }

        #endregion Methods
    }
}
