using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;
using System.Linq;

namespace api.Backend.Data.Obj
{
    public class MenuTimes : Object
    {
        #region Fields

        public string DayRef;
        public uint MenuRestID, MenuTimeID;
        public TimeSpan StartServing, ServingFor;

        #endregion Fields

        #region Methods

        public async Task<Days> GetDays()
        {
            return (await Binding.GetTable<Days>().Select<Days>("DayRef", DayRef))?[0];
        }

        public async Task<LinkMenuRestaurant> GetLinkMenuRestaurant()
        {
            return (await Binding.GetTable<LinkMenuRestaurant>().Select<LinkMenuRestaurant>(MenuRestID))?[0];
        }

        public bool IsServing(DateTime when)
        {
            return when.DayOfWeek.ToString().StartsWith(DayRef,StringComparison.CurrentCultureIgnoreCase);
        }

        public async Task<bool> IsServingAsync(DateTime when)
        {
            Days[] _days = await Binding.GetTable<Days>().Select<Days>("DayRef", DayRef);
            return _days.Any(x => x.DayName == when.DayOfWeek.ToString());
        }

        #endregion Methods
    }
}
