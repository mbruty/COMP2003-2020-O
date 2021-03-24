using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class ResturantAdmin : Object
    {
        #region Fields

        public string Email, Password, DashLayout;
        public bool IsVerified;
        public uint RAdminID;

        #endregion Fields

        #region Methods

        public async Task<Restaurant[]> GetRestaurantsOwned()
        {
            return await Binding.GetTable<Restaurant>().Select<Restaurant>("OwnerID", RAdminID);
        }

        public async Task<RAdminSession> GetSession()
        {
            return (await Binding.GetTable<RAdminSession>().Select<RAdminSession>(RAdminID))?[0];
        }

        public async Task<TagSuggestions> GetSuggestions()
        {
            return (await Binding.GetTable<TagSuggestions>().Select<TagSuggestions>("OwnerID",RAdminID))?[0];
        }

        public async Task<CommunityTagResponse> GetTagResponses()
        {
            return (await Binding.GetTable<CommunityTagResponse>().Select<CommunityTagResponse>("RAdminID", RAdminID))?[0];
        }

        public async Task<Category[]> GetCategorys()
        {
            return await Binding.GetTable<Category>().Select<Category>("OwnerID", RAdminID);
        }

        public override Object Purge()
        {
            ResturantAdmin u = (ResturantAdmin)this.MemberwiseClone();
            u.Password = "REDACTED";
            return u;
        }

        public async Task<bool> UpdateIsVerified()
        {
            return await SQL.Instance.Execute("UPDATE ResturantAdmin SET IsVerified=@verified where radminid=@uid",
                new List<Tuple<string, object>>() { new Tuple<string, object>("verified", IsVerified), new Tuple<string, object>("uid", RAdminID) });
        }

        public async Task<bool> UpdatePassword()
        {
            return await SQL.Instance.Execute("UPDATE ResturantAdmin SET password=@pword where radminid=@uid",
                 new List<Tuple<string, object>>() { new Tuple<string, object>("pword", Password), new Tuple<string, object>("uid", RAdminID) });
        }

        #endregion Methods
    }
}
