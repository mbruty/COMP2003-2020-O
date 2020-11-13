using api.Backend.Data.SQL.AutoSQL;
using System;

namespace api.Backend.Data.Obj
{
    public class Session : Object
    {
        #region Fields

        public string AuthToken;
        public DateTime SignedIn;
        public int UserId;

        #endregion Fields

        #region Properties

        public User user
        {
            get { return Binding.GetTable<User>().Select<User>("ID", UserId)?[0]; }
        }

        #endregion Properties
    }
}