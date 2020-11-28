using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class LinkMenuRestaurant : Object
    {
        #region Fields

        public bool AlwaysServe;
        public uint MenuRestID, MenuID, RestaurantID;

        #endregion Fields

        #region Methods

        public async Task<Menu> GetMenu()
        {
            return (await Binding.GetTable<Menu>().Select<Menu>(MenuID))?[0];
        }

        public async Task<MenuTimes[]> GetMenuTimes()
        {
            return await Binding.GetTable<MenuTimes>().Select<MenuTimes>(MenuRestID);
        }

        public async Task<Restaurant> GetRestaurant()
        {
            return (await Binding.GetTable<Restaurant>().Select<Restaurant>(RestaurantID))?[0];
        }

        #endregion Methods
    }
}
