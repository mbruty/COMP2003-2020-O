using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class MenuItem : Object
    {
        #region Fields

        public int Id, ResturantId, CheckId;
        public string Name, Description;
        public float Price;

        #endregion Fields

        #region Properties

        public FoodChecks foodchecks
        {
            get { return Binding.GetTable<FoodChecks>().Select<FoodChecks>("ID", CheckId)?[0]; }
        }

        public MenuItemTags[] menuitemtags
        {
            get { return Binding.GetTable<MenuItemTags>().Select<MenuItemTags>("MenuID", Id); }
        }

        public Resturant resturant
        {
            get { return Binding.GetTable<Resturant>().Select<Resturant>("ID", ResturantId)?[0]; }
        }

        #endregion Properties
    }
}