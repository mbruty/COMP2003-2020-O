using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class TagSuggestions : Object
    {
        #region Fields

        public DateTime DateAdded;
        public uint SuggestionID, OwnerID;

        public string Tag;

        #endregion Fields

        #region Constructors

        public TagSuggestions()
        {
        }

        public TagSuggestions(string _tag)
        {
            Tag = _tag;
        }

        #endregion Constructors

        #region Methods

        public async Task<RestaurantAdmin> GetOwner()
        {
            return (await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>(OwnerID))?[0];
        }

        #endregion Methods
    }
}
