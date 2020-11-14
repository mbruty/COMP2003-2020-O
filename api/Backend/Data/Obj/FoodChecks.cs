using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class FoodChecks : Object
    {
        #region Fields

        public int Id;
        public bool IsVegetarian, IsVegan, ContainsLactose, ContainsNut, ContainsGluten, ContainsEgg, ContainsSoy, IsHallal, IsKosher;

        #endregion Fields

        #region Properties

        public MenuItem MenuItem
        {
            get { return Binding.GetTable<MenuItem>().Select<MenuItem>("CheckID", Id)?[0]; }
        }

        public User User
        {
            get { return Binding.GetTable<User>().Select<User>("CheckID", Id)?[0]; }
        }

        #endregion Properties
    }
}