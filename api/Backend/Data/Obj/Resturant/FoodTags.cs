using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class FoodTags : Object
    {
        #region Fields

        public int Id;
        public string Tag;

        #endregion Fields

        #region Methods

        public async Task<FoodOpinion[]> GetFoodOpinions()
        { return await Binding.GetTable<FoodOpinion>().Select<FoodOpinion>("FoodTagID", Id); }

        public async Task<MenuItemTags[]> GetMenuItemTags()
        { return await Binding.GetTable<MenuItemTags>().Select<MenuItemTags>("FoodTagID", Id); }

        #endregion Methods
    }
}