using System;
using System.Collections.Generic;
using System.Text;

namespace api.Backend.Data.Obj
{
    public class Visit : Object
    {
        public uint VisitRef, ResturantID, UserID;

        public DateTime DateOfVisit;

        public UInt16 GroupSize;
    }
}
