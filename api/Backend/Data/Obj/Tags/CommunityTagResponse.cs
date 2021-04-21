using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class CommunityTagResponse : Object
    {
        #region Fields

        public uint RAdminID, SuggestionID;

        public bool Upvote;

        #endregion Fields

        #region Methods

        public async Task<RestaurantAdmin> GetOwner()
        {
            return (await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>(RAdminID))?[0];
        }

        public async Task<TagSuggestions> GetSuggestion()
        {
            return (await Binding.GetTable<TagSuggestions>().Select<TagSuggestions>(SuggestionID))?[0];
        }

        #endregion Methods
    }
}
