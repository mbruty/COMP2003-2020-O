using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;

namespace api
{
    public static class SQL_Test_Code
    {
        #region Methods

        public static async void Run()
        {
            Menu[] m = await Binding.GetTable<Menu>().Select<Menu>(1);

            FoodItem[] f = await m[0].GetFoodItems();
        }

        #endregion Methods
    }
}
