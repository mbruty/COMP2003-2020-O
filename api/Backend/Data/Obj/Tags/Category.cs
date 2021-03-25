using api.Backend.Data.SQL.AutoSQL;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Category : Object
    {
        #region Fields

        public uint CategoryID, OwnerID;

        public string CatName;

        #endregion Fields

        #region Constructors

        public Category()
        {
        }

        public Category(string _CatName)
        {
            CatName = _CatName;
        }

        #endregion Constructors

        #region Methods

        public async Task<FoodItem> GetFoodsWith()
        {
#warning GetFoodsWith not implimented
            //return (await Binding.GetTable<FoodItem>().SelectCustom<FoodItem>("FoodId ");
            return null;
        }

        public async Task<ResturantAdmin> GetOwner()
        {
            return (await Binding.GetTable<ResturantAdmin>().Select<ResturantAdmin>(OwnerID))?[0];
        }

        #endregion Methods
    }
}
