using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class MenuTimes : Object
    {
        #region Fields

        public string DayRef;
        public uint MenuRestID;
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

        #endregion Methods
    }
}
