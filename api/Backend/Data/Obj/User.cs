using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class User : Backend.Data.SQL.Object
    {
        #region Fields

        public string Email, Password, Nickname;
        public int Id, YearOfBirth, CheckId;

        public Visit[] visits
        {
            get { return Binding.GetTable<Visit>().Select<Visit>("UserId", Id); }
        }

        #endregion Fields
    }
}