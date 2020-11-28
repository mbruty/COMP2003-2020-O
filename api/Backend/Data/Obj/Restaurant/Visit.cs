using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Visit : Object
    {
        #region Fields

        public DateTime DateOfVisit;
        public UInt16 GroupSize;
        public uint VisitRef, RestaurantID, UserID;

        #endregion Fields

        #region Methods

        public async Task<Restaurant> GetRestaurant()
        {
            return (await Binding.GetTable<Restaurant>().Select<Restaurant>(RestaurantID))?[0];
        }

        public async Task<Review> GetReview()
        {
            return (await Binding.GetTable<Review>().Select<Review>(VisitRef))?[0];
        }

        public async Task<User> GetUser()
        {
            return (await Binding.GetTable<User>().Select<User>(UserID))?[0];
        }

        #endregion Methods
    }
}
