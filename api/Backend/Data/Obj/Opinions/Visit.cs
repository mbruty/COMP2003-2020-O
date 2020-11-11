using System;
using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class Visit : Object
    {
        #region Fields

        public DateTime Date;
        public int Id, ResturantId, UserId, GroupSize;

        #endregion Fields

        #region Properties

        public User user
        {
            get { return Binding.GetTable<User>().Select<User>("ID", UserId)?[0]; }
        }

        public Resturant resturant
        {
            get { return Binding.GetTable<Resturant>().Select<Resturant>("ID", ResturantId)?[0]; }
        }
        public Review review
        {
            get { return Binding.GetTable<Review>().Select<Review>("VisitID", Id)?[0]; }
        }


        #endregion Properties
    }
}