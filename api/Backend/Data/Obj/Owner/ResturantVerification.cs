using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class ResturantVerification : Object
    {
        #region Fields

        public string QRCode;
        public uint RestaurantID;

        #endregion Fields

        #region Methods

        public async Task<Restaurant> GetRestaurant()
        {
            return (await Binding.GetTable<Restaurant>().Select<Restaurant>(RestaurantID))?[0];
        }

        #endregion Methods
    }
}
