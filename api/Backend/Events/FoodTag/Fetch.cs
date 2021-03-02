using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Threading.Tasks;

namespace api.Backend.Events.FoodTag
{
    public static class Fetch
    {
        #region Methods

        [WebEvent("/fetch/foodtags/like", "GET", false, SecurityGroup.None)]
        public static async Task GetTagsLike(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            FoodTags[] tags = await Binding.GetTable<FoodTags>().SelectCustom<FoodTags>(
                where: "Tag LIKE CONCAT('%', @str, '%')",
                tables: "FoodTags",
                Params: new List<System.Tuple<string, object>> { new System.Tuple<string, object>("str", headers["string"]) });

            response.AddObjectToData("tags", tags);
            response.StatusCode = 200;
        }

        #endregion Methods
    }
}
