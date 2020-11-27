using System;

namespace api.Backend.Data.Obj
{
    public class Visit : Object
    {
        #region Fields

        public DateTime DateOfVisit;
        public UInt16 GroupSize;
        public uint VisitRef, ResturantID, UserID;

        #endregion Fields
    }
}
