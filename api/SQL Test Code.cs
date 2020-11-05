using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;

namespace api
{
    public static class SQL_Test_Code
    {
        #region Methods

        public static void Bind()
        {
            Binding.Add<User>("User");
            Binding.Add<Session>("Session");
            Binding.Add<FoodChecks>("FoodChecks");

            Binding.Add<Resturant>("Resturant");
            Binding.Add<FoodTags>("FoodTags");
            Binding.Add<MenuItem>("MenuItem");
            Binding.Add<MenuItemTags>("MenuItemTags");

            Binding.Add<FoodOpinion>("FoodOpinion");
            Binding.Add<ResturantOpinion>("ResturantOpinion");
            Binding.Add<Review>("Review");
            Binding.Add<Visit>("Visit");
        }

        public static void Run()
        {
            FoodChecks u = new FoodChecks();
            u.Insert(true);

            //var p = Binding.GetTable<User>().Select<User>()[0].visits;
        }

        #endregion Methods
    }
}