namespace api.Backend.Data.Obj
{
    public class ResturantOpinion : Backend.Data.SQL.Object
    {
        #region Fields

        public bool NeverShow;
        public int UserId, ResturantId, SwipeLeft, SwipeRight;

        #endregion Fields
    }
}