using System.Linq;
using System.Threading.Tasks;
using api.Backend.Data.SQL.AutoSQL;
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

        public async Task<ResturantAdmin> GetOwner()
        {
            return (await Binding.GetTable<ResturantAdmin>().Select<ResturantAdmin>(OwnerID))?[0];
        }

        public async Task<FoodItem[]> GetFoodsWith()
        {
            return await Binding.GetTable<FoodItem>().SelectCustom<FoodItem>(what: "FoodItem.FoodID,FoodItem.FoodCheckID,FoodItem.FoodName,FoodItem.FoodNameShort,FoodItem.FoodDescription,FoodItem.Price", tables:"tat.FoodItem, tat.LinkCategoryFood", where:"LinkCategoryFood.FoodID=tat.FoodItem.FoodID AND LinkCategoryFood.CategoryID=1");
        }
    }
}
