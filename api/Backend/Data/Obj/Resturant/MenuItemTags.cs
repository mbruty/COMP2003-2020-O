using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class MenuItemTags : Object
    {
        #region Fields

        public int MenuId, FoodTagId;

        #endregion Fields

        #region Properties

        public FoodTags foodtag
        {
            get { return Binding.GetTable<FoodTags>().Select<FoodTags>("Id", FoodTagId)?[0]; }
        }

        public MenuItem menuitem
        {
            get { return Binding.GetTable<MenuItem>().Select<MenuItem>("Id", MenuId)?[0]; }
        }

        #endregion Properties
    }
}