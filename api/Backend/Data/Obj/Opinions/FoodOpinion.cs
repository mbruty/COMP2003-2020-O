using System;
using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class FoodOpinion : Object
    {
        #region Fields

        public bool NeverShow;
        public int UserId, FoodTagId, SwipeRight;

        #endregion Fields

        #region 

        public User[] user
        {
            get { return Binding.GetTable<User>().Select<User>("ID", UserId); }
        }

        public FoodTags foodtags
        {
            get { return Binding.GetTable<FoodTags>().Select<FoodTags>("ID", FoodTagId)?[0];  }
        }

        #endregion 
    }
}