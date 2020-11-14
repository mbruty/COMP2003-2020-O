using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class FoodChecks : Object
    {
        #region Fields

        public int Id;
        public bool IsVegetarian, IsVegan, ContainsLactose, ContainsNut, ContainsGluten, ContainsEgg, ContainsSoy, IsHallal, IsKosher;

        #endregion Fields

        #region Methods

        public async Task<MenuItem> GetMenuItem()
        { return (await Binding.GetTable<MenuItem>().Select<MenuItem>("CheckID", Id))?[0]; }

        public async Task<User> GetUser()
        { return (await Binding.GetTable<User>().Select<User>("CheckID", Id))?[0]; }

        #endregion Methods
    }
}