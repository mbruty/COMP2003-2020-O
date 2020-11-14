using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class FoodOpinion : Object
    {
        #region Fields

        public bool NeverShow;
        public int UserId, FoodTagId, SwipeRight;

        #endregion Fields
        #region Properties

        #endregion Fields

        #region Properties

        public async Task<FoodTags> GetFoodtag()
        { return (await Binding.GetTable<FoodTags>().Select<FoodTags>("ID", FoodTagId))?[0]; }

        public async Task<User> GetUser()
        { return (await Binding.GetTable<User>().Select<User>("ID", UserId))?[0]; }

        #endregion Properties
    }
}