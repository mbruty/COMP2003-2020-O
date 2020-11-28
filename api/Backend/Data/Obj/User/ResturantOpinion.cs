using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class RestaurantOpinion : Object
    {
        #region Fields

        public bool NeverShow;
        public uint SwipeRight, SwipeLeft;
        public uint UserID, RestaurantID;

        #endregion Fields

        #region Methods

        public async Task<Restaurant> GetRestaurant()
        {
            return (await Binding.GetTable<Restaurant>().Select<Restaurant>(RestaurantID))?[0];
        }

        public async Task<User> GetUser()
        {
            return (await Binding.GetTable<User>().Select<User>(UserID))?[0];
        }

        #endregion Methods
    }
}
