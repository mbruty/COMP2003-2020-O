using api.Backend.Data.Obj;

namespace api
{
    public static class SQL_Test_Code
    {
        #region Methods

        public static async void Run()
        {
            FoodChecks u = new FoodChecks();
            await u.Insert(true);

            //var p = Binding.GetTable<User>().Select<User>()[0].visits;
        }

        #endregion Methods
    }
}
