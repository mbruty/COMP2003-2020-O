using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class OpeningHours : Object
    {
        #region Fields

        public string DayRef;
        public TimeSpan OpenTime, TimeServing;
        public uint RestaurantID;

        #endregion Fields

        #region Methods

        public async Task<Days> GetDays()
        {
            return (await Binding.GetTable<Days>().Select<Days>("DayRef", DayRef))?[0];
        }

        public async Task<Restaurant> GetRestaurant()
        {
            return (await Binding.GetTable<Restaurant>().Select<Restaurant>(RestaurantID))?[0];
        }

        #endregion Methods
    }
}
