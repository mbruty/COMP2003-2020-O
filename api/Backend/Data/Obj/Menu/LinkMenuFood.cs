using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class LinkMenuFood : Object
    {
        public uint MenuID, FoodID;

        public async Task<Menu> GetMenu()
        {
            return (await Binding.GetTable<Menu>().Select<Menu>(MenuID))?[0];
        }

        public async Task<FoodItem> GetFoodItem()
        {
            return (await Binding.GetTable<FoodItem>().Select<FoodItem>(FoodID))?[0];
        }
    }
}
