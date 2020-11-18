using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Visit : Object
    {
        #region Fields

        public DateTime Date;
        public int Id, RestaurantId, UserId, GroupSize;

        #endregion Fields

        #region Methods

        public async Task<Restaurant> GetRestaurant()
        { return (await Binding.GetTable<Restaurant>().Select<Restaurant>("ID", RestaurantId))?[0]; }

        public async Task<Review> GetReview()
        { return (await Binding.GetTable<Review>().Select<Review>("VisitID", Id))?[0]; }

        public async Task<User> GetUser()
        { return (await Binding.GetTable<User>().Select<User>("ID", UserId))?[0]; }

        #endregion Methods
    }
}
