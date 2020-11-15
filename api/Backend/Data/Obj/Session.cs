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
        public int UserId;

        #endregion Fields

        #region Methods

        public async Task<User> GetUser()
        { return (await Binding.GetTable<User>().Select<User>("ID", UserId))?[0]; }

        #endregion Methods
    }
}