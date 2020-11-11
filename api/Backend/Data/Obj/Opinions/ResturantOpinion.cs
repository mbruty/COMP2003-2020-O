using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class ResturantOpinion : Object
    {
        #region Fields

        public bool NeverShow;
        public int UserId, ResturantId, SwipeLeft, SwipeRight;

        #endregion Fields

        #region Properties

        public Resturant resturant
        {
            get { return Binding.GetTable<Resturant>().Select<Resturant>("ID", ResturantId)?[0]; }
        }

        public User user
        {
            get { return Binding.GetTable<User>().Select<User>("ID", UserId)?[0]; }
        }

        #endregion Properties
    }
}