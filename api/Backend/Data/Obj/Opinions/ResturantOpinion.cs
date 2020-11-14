using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class RestaurantOpinion : Object
    {
        #region Fields

        public bool NeverShow;
        public int UserId, RestaurantId, SwipeLeft, SwipeRight;

        #endregion Fields
        #region Properties

        #endregion Fields

        #region Properties

        public async Task<Restaurant> GetRestaurant()
        { return (await Binding.GetTable<Restaurant>().Select<Restaurant>("ID", RestaurantId))?[0]; }

        public async Task<User> GetUser()
        { return (await Binding.GetTable<User>().Select<User>("ID", UserId))?[0]; }

        #endregion Properties
    }
}