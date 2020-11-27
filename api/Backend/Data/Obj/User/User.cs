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

        public async Task<ResturantOpinion[]> GetResturantOpinions()
        {
            return await Binding.GetTable<ResturantOpinion>().Select<ResturantOpinion>("UserID", UserID);
        }

        public async Task<Resturant[]> GetResturantsOwned()
        {
            return await Binding.GetTable<Resturant>().Select<Resturant>("OwnerID", UserID);
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
