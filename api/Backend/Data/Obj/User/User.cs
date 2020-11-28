using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class User : Object
    {
        #region Fields

        public DateTime DateOfBirth;
        public string Email, Password, Nickname;
        public uint FoodCheckID;
        public uint UserID;

        #endregion Fields

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
