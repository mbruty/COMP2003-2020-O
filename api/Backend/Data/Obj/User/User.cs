using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace api.Backend.Data.Obj
{
    public class User : Object
    {
        #region Fields

        public DateTime DateOfBirth;
        public string Email, Password, Nickname;
        public uint FoodCheckID;
        public uint UserID;
        public bool IsDeleted, IsVerified;

        #endregion Fields

        public override Object Purge()
        {
            User u = (User)this.MemberwiseClone();
            u.Password = "REDACTED";
            return u;
        }
        public async Task<bool> UpdatePassword()
        {
           return await SQL.Instance.Execute("UPDATE User SET password=@pword where userid=@uid",
                new List<Tuple<string, object>>() { new Tuple<string, object>("pword",Password), new Tuple<string, object>("uid",UserID) });
        }

        #region Methods

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

        #endregion Methods
    }
}
