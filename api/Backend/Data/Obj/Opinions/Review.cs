using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Review : Object
    {
        #region Fields

        public int VisitId, Rating;

        #endregion Fields

        #region Methods

        public async Task<Visit> GetVisit()
        { return (await Binding.GetTable<Visit>().Select<Visit>("ID", VisitId))?[0]; }

        #endregion Methods
    }
}
