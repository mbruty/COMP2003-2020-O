using System;
using System.Collections.Generic;
using System.Text;

namespace api.Backend.Data.Obj
{
    public class OpeningHours : Object
    {
        public uint ResturantID;

        public string DayRef;

        public DateTime OpenTime, TimeServing;
    }
}
