using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class RestaurantOpinion : Object
    {
        #region Fields

        public bool NeverShow;
        public int UserId, RestaurantId, SwipeLeft, SwipeRight;

        #endregion Fields

        #region Properties

        public Restaurant Restaurant
        {
            get { return Binding.GetTable<Restaurant>().Select<Restaurant>("ID", RestaurantId)?[0]; }
        }

        public User user
        {
            get { return Binding.GetTable<User>().Select<User>("ID", UserId)?[0]; }
        }

        #endregion Properties
    }
}