using System;

namespace api.Backend.Data.Obj
{
    public class Visit : Backend.Data.SQL.Object
    {
        #region Fields

        public DateTime Date;
        public int Id, ResturantId, UserId, GroupSize;

        #endregion Fields
    }
}