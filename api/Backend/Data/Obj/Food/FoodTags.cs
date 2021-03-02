namespace api.Backend.Data.Obj
{
    public class FoodTags : Object
    {
        #region Fields

        public uint FoodTagID;

        public string Tag;

        #endregion Fields

        #region Constructors

        public FoodTags()
        {
        }

        public FoodTags(string _tag)
        {
            Tag = _tag;
        }

        #endregion Constructors
    }
}
