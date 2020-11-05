using System;

namespace api.Backend.Data.Obj
{
    public class Session : Backend.Data.SQL.Object
    {
        #region Fields

        public string AuthToken;
        public DateTime SignedIn;
        public int UserId;

        #endregion Fields
    }
}