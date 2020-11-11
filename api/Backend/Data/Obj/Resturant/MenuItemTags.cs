using System;
using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class MenuItemTags : Object
    {
        #region Fields

        public int MenuId, FoodTagId;

        #endregion Fields

        #region Properties

        public MenuItem menuitem
        {
            get { return Binding.GetTable<MenuItem>().Select<MenuItem>("ID", MenuId)?[0]; }
        }

        public FoodTags[] foodtags
        {
            get { return Binding.GetTable<FoodTags>().Select<FoodTags>("ID", FoodTagId); }
        }

        #endregion Properties
    }
}