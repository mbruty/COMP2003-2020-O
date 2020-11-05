namespace api.Backend.Data.Obj
{
    public class MenuItem : Backend.Data.SQL.Object
    {
        #region Fields

        public int Id, ResturantId, CheckId;
        public string Name, Description;
        public float Price;

        #endregion Fields
    }
}