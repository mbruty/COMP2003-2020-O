using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class MenuItem : Object
    {
        #region Fields

        public int Id, RestaurantId, CheckId;
        public string Name, Description;
        public float Price;

        #endregion Fields
        #region Properties

        #endregion Fields

        #region Properties

        public async Task<FoodChecks> GetFoodChecks()
        { return (await Binding.GetTable<FoodChecks>().Select<FoodChecks>("ID", CheckId))?[0]; }

        public async Task<MenuItemTags[]> GetMenuItemTags()
        { return await Binding.GetTable<MenuItemTags>().Select<MenuItemTags>("MenuID", Id); }

        public async Task<Restaurant> GetRestaurant()
        { return (await Binding.GetTable<Restaurant>().Select<Restaurant>("ID", RestaurantId))?[0]; }

        #endregion Properties
    }
}