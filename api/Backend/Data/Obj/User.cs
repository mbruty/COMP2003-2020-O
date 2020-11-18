using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class User : Object
    {
        #region Fields

        public string Email, Password, Nickname;
        public int Id, YearOfBirth, CheckId;

        #endregion Fields

        #region Methods

        public override async Task<bool> Delete()
        {
            return await base.Delete() && await (await GetFoodCheck()).Delete();
        }

        public async Task<FoodChecks> GetFoodCheck()
        {
            return (await Binding.GetTable<FoodChecks>().Select<FoodChecks>("id", this.CheckId))?[0];
        }

        public async Task<FoodOpinion[]> GetFoodOpinions()
        {
            return await Binding.GetTable<FoodOpinion>().Select<FoodOpinion>("UserID", Id);
        }

        public async Task<RestaurantOpinion[]> GetRestaurantopinions()
        {
            return await Binding.GetTable<RestaurantOpinion>().Select<RestaurantOpinion>("UserID", Id);
        }

        public async Task<Restaurant[]> GetRestaurants()
        { return await Binding.GetTable<Restaurant>().Select<Restaurant>("OwnerID", Id); }

        public async Task<Session> GetSession()
        { return (await Binding.GetTable<Session>().Select<Session>("UserId", Id))?[0]; }

        public async Task<Visit[]> GetVisits()
        { return await Binding.GetTable<Visit>().Select<Visit>("UserId", Id); }

        public override async Task<bool> Insert(bool FetchInsertedIds = false)
        {
            FoodChecks foodChecks = new FoodChecks();
            await foodChecks.Insert(true);

            this.CheckId = foodChecks.Id;

            return await base.Insert(FetchInsertedIds);
        }

        #endregion Methods
    }
}