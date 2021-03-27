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

        public async Task<FoodItem[]> GetFoodsWith()
        {
            return await Binding.GetTable<FoodItem>().SelectCustom<FoodItem>(what: "FoodItem.FoodID,FoodItem.FoodCheckID,FoodItem.FoodName,FoodItem.FoodNameShort,FoodItem.FoodDescription,FoodItem.Price", tables: "tat.FoodItem, tat.LinkCategoryFood", where: "LinkCategoryFood.FoodID=tat.FoodItem.FoodID AND LinkCategoryFood.CategoryID=1");
        }

        public async Task<RestaurantAdmin> GetOwner()
        {
            return (await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>(OwnerID))?[0];
        }

        #endregion Methods
    }
}
