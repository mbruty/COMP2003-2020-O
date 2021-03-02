using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class User : Object
    {
        #region Fields

        public DateTime DateOfBirth;
        public string Email, Password, Nickname;
        public uint FoodCheckID;
        public bool IsDeleted, IsVerified;
        public uint UserID;

        #endregion Fields

        #region Methods

        public async override Task<bool> Delete()
        {
            return await SQL.Instance.Execute("CALL `Run-RemoveUser`(@id)",
                new List<Tuple<string, object>>() { new Tuple<string, object>("id", UserID) });
        }

        public async Task<FoodChecks> GetFoodCheck()
        {
            return (await Binding.GetTable<FoodChecks>().Select<FoodChecks>(FoodCheckID))?[0];
        }

        public async Task<FoodOpinion[]> GetFoodOpinions()
        {
            return await Binding.GetTable<FoodOpinion>().Select<FoodOpinion>("UserID", UserID);
        }

        public async Task<RestaurantOpinion[]> GetRestaurantOpinions()
        {
            return await Binding.GetTable<RestaurantOpinion>().Select<RestaurantOpinion>("UserID", UserID);
        }

        public async Task<Restaurant[]> GetRestaurantsOwned()
        {
            return await Binding.GetTable<Restaurant>().Select<Restaurant>("OwnerID", UserID);
        }

        public async Task<Session> GetSession()
        {
            return (await Binding.GetTable<Session>().Select<Session>(UserID))?[0];
        }

        public async Task<Visit[]> GetVisits()
        {
            return await Binding.GetTable<Visit>().Select<Visit>("UserID", UserID);
        }

        public async Task<bool> PermDelete()
        {
            return await SQL.Instance.Execute("CALL `Run-PermaDeleteUser`(@id)",
                new List<Tuple<string, object>>() { new Tuple<string, object>("id", UserID) });
        }

        public override Object Purge()
        {
            User u = (User)this.MemberwiseClone();
            u.Password = "REDACTED";
            return u;
        }

        public async Task<bool> UpdateIsVerified()
        {
            return await SQL.Instance.Execute("UPDATE User SET IsVerified=@verified where userid=@uid",
                new List<Tuple<string, object>>() { new Tuple<string, object>("verified", IsVerified), new Tuple<string, object>("uid", UserID) });
        }

        public async Task<bool> UpdatePassword()
        {
            return await SQL.Instance.Execute("UPDATE User SET password=@pword where userid=@uid",
                 new List<Tuple<string, object>>() { new Tuple<string, object>("pword", Password), new Tuple<string, object>("uid", UserID) });
        }

        #endregion Methods
    }
}
