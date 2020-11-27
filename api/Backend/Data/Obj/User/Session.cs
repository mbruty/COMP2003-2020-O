using System;

namespace api.Backend.Data.Obj
{
    public class Session : Object
    {
        #region Fields

        public string AuthToken;
        public DateTime SignedIn;
        public uint UserID;

        #endregion Fields
    }
}
