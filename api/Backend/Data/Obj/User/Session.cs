using System;
using System.Collections.Generic;
using System.Text;

namespace api.Backend.Data.Obj
{
    public class Session : Object
    {
        public uint UserID;

        public DateTime SignedIn;

        public string AuthToken;
    }
}
