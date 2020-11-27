using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class User : Object
    {
        public uint UserID;

        public string Email, Password, Nickname;
        public DateTime DateOfBirth;
        public uint FoodCheckID;

        public async Task<FoodChecks> GetFoodCheck()
        {
            return (await Binding.GetTable<FoodChecks>().Select<FoodChecks>(FoodCheckID))?[0];
        }

        public async Task<Session> GetSession()
        {
            return (await Binding.GetTable<Session>().Select<Session>(UserID))?[0];
        }

        public async Task<FoodOpinion[]> GetFoodOpinions()
        {
            return await Binding.GetTable<FoodOpinion>().Select<FoodOpinion>("UserID",UserID);
        }

        public async Task<Visit[]> GetVisits()
        {
            return await Binding.GetTable<Visit>().Select<Visit>("UserID", UserID);
        }

        public async Task<ResturantOpinion[]> GetResturantOpinions()
        {
            return await Binding.GetTable<ResturantOpinion>().Select<ResturantOpinion>("UserID", UserID);
        }

        public async Task<Resturant[]> GetResturantsOwned()
        {
            return await Binding.GetTable<Resturant>().Select<Resturant>("OwnerID", UserID);
        }
    }
}
