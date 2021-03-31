using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class RAdminSession : Object
    {
        #region Fields

        public string AuthToken;
        public uint RAdminID;
        public DateTime SignedIn;

        #endregion Fields

        #region Methods

        public async Task<RestaurantAdmin> GetUser()
        {
            return (await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>(RAdminID))?[0];
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
