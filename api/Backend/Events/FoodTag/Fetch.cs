using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Backend.Events.FoodTag
{
    public static class Fetch
    {
        #region Methods

        [WebEvent(typeof(tagLikeBody), "/foodtags/like", "GET", false, SecurityGroup.None)]
        public static async Task GetTagsLike(tagLikeBody like, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            FoodTags[] tags = await Binding.GetTable<FoodTags>().SelectCustom<FoodTags>(
                where: "Tag LIKE CONCAT('%', @str, '%')",
                tables: "FoodTags",
                Params: new List<System.Tuple<string, object>> { new System.Tuple<string, object>("str", like.tag) });

            response.AddObjectToData("tags", tags);
            response.StatusCode = 200;
        }

        #endregion Methods
    }

    public class tagLikeBody
    {
        #region Fields

        public string tag;

        #endregion Fields
    }
}
