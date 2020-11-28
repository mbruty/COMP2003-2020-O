using System;

namespace api.Backend.Data.Obj
{
    public class OpeningHours : Object
    {
        #region Fields

        public string DayRef;
        public DateTime OpenTime, TimeServing;
        public uint RestaurantID;

        #endregion Fields
    }
}
