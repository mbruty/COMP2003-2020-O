using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Restaurant : Object
    {
        #region Fields

        public int Id, OwnerId;
        public float Longitude, Latitude;
        public string Name, Description, Phone, Email, Site;

        #endregion Fields
        #region Properties

        #endregion Fields

        #region Properties

        public async Task<MenuItem[]> GetMenuItems()
        { return await Binding.GetTable<MenuItem>().Select<MenuItem>("RestaurantID", Id); }

        public async Task<User> GetOwner()
        { return (await Binding.GetTable<User>().Select<User>("Id", OwnerId))?[0]; }

        public async  Task<RestaurantOpinion> GetRestaurantopinion()
        { return (await Binding.GetTable<RestaurantOpinion>().Select<RestaurantOpinion>("RestaurantID", Id))?[0]; }

        public async Task<Visit[]> GetVisits()
        { return await Binding.GetTable<Visit>().Select<Visit>("RestaurantID", Id); }

        #endregion Properties
    }
}