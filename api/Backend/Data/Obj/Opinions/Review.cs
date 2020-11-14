using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class Review : Object
    {
        #region Fields

        public int VisitId, Rating;

        #endregion Fields

        #region Properties

        public Visit Visit
        {
            get { return Binding.GetTable<Visit>().Select<Visit>("ID", VisitId)?[0]; }
        }

        #endregion Properties
    }
}