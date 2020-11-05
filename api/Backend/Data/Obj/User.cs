namespace api.Backend.Data.Obj
{
    public class User : Backend.Data.SQL.Object
    {
        #region Fields

        public string Email, Password, Nickname;
        public int Id, YearOfBirth, CheckId;

        #endregion Fields
    }
}