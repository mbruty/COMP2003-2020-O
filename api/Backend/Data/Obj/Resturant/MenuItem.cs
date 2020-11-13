using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class MenuItem : Object
    {
        #region Fields

        public int Id, RestaurantId, CheckId;
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

        public Restaurant Restaurant
        {
            get { return Binding.GetTable<Restaurant>().Select<Restaurant>("ID", RestaurantId)?[0]; }
        }

        #endregion Properties
    }
}