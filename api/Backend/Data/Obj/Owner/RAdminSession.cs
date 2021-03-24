using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class RAdminSession : Object
    {
        #region Fields

        public string AuthToken;
        public DateTime SignedIn;
        public uint RAdminID;

        #endregion Fields

        #region Methods

        public async Task<ResturantAdmin> GetUser()
        {
            return (await Binding.GetTable<ResturantAdmin>().Select<ResturantAdmin>(RAdminID))?[0];
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
