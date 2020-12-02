using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class FoodOpinion : Object
    {
        #region Fields

        public bool NeverShow, Favourite;
        public uint SwipeRight, SwipeLeft;
        public uint UserID, FoodTagID;

        #endregion Fields

        public async Task<User> GetUser()
        {
            return (await Binding.GetTable<User>().Select<User>(UserID))?[0];
        }

        public async Task<FoodTags> GetFoodTags()
        {
            return (await Binding.GetTable<FoodTags>().Select<FoodTags>(FoodTagID))?[0];
        }
    }
}
