using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class FoodTags : Object
    {
        #region Fields

        public int Id;
        public string Tag;

        #endregion Fields

        #region Properties

        public FoodOpinion[] foodopinions
        {
            get { return Binding.GetTable<FoodOpinion>().Select<FoodOpinion>("FoodTagID", Id); }
        }

        public MenuItemTags[] menuitemtags
        {
            get { return Binding.GetTable<MenuItemTags>().Select<MenuItemTags>("FoodTagID", Id); }
        }

        #endregion Properties
    }
}