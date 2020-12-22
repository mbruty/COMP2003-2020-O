using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Session : Object
    {
        #region Fields

        public string AuthToken;
        public DateTime SignedIn;
        public uint UserID;

        #endregion Fields

        #region Methods

        public async Task<User> GetUser()
        {
            return (await Binding.GetTable<User>().Select<User>(UserID))?[0];
        }

        public override Object Purge()
        {
            Session u = (Session)this.MemberwiseClone();
            u.AuthToken = "REDACTED";
            return u;
        }

        #endregion Methods
    }
}
