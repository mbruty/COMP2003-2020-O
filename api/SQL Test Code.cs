using api.Backend.Data.Obj;

namespace api
{
    public static class SQL_Test_Code
    {
        #region Methods

        public static void Run()
        {
            FoodChecks u = new FoodChecks();
            u.Insert(true);

            //var p = Binding.GetTable<User>().Select<User>()[0].visits;
        }

        #endregion Methods
    }
}