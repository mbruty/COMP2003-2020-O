using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Restaurant : Object
    {
        #region Fields

        public float Longitude, Latitude;
        public uint RestaurantID, OwnerID;

        public string RestaurantName, RestaurantDescription, Phone, Email, Site;

        #endregion Fields

        public async Task<User> GetOwner()
        {
            return (await Binding.GetTable<User>().Select<User>(OwnerID))?[0];
        }
    }
}
