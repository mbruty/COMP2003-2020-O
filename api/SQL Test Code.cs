using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;

namespace api
{
    public static class SQL_Test_Code
    {
        #region Methods

        public static void Run()
        {
            Binding.Add<User>("User");
            Binding.Add<Resturant>("Resturant");
            Binding.Add<Visit>("Visit");
            Binding.Add<FoodChecks>("foodchecks");

            var p = Binding.GetTable<FoodChecks>().Select<FoodChecks>();
        }

        #endregion Methods
    }
}