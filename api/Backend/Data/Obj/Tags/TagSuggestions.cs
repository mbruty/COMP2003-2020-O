using System;
using System.Threading.Tasks;
using api.Backend.Data.SQL.AutoSQL;
namespace api.Backend.Data.Obj
{
    public class TagSuggestions : Object
    {
        #region Fields

        public uint SuggestionID, OwnerID;

        public string Tag;

        public DateTime DateAdded;

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

        public async Task<ResturantAdmin> GetOwner()
        {
            return (await Binding.GetTable<ResturantAdmin>().Select<ResturantAdmin>(OwnerID))?[0];
        }
    }
}
