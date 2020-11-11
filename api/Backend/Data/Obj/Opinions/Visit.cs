using api.Backend.Data.SQL.AutoSQL;
using System;

namespace api.Backend.Data.Obj
{
    public class Visit : Object
    {
        #region Fields

        public DateTime Date;
        public int Id, RestaurantId, UserId, GroupSize;

        #endregion Fields

        #region Properties

        public Restaurant Restaurant
        {
            get { return Binding.GetTable<Restaurant>().Select<Restaurant>("ID", RestaurantId)?[0]; }
        }

        public Review review
        {
            get { return Binding.GetTable<Review>().Select<Review>("VisitID", Id)?[0]; }
        }

        public User user
        {
            get { return Binding.GetTable<User>().Select<User>("ID", UserId)?[0]; }
        }

        #endregion Properties
    }
}