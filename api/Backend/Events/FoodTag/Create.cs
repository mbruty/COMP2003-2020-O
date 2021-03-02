using api.Backend.Security;
using System.Collections.Specialized;
using System.Threading.Tasks;
using api.Backend.Endpoints;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Data.Obj;
using System.Collections.Generic;

namespace api.Backend.Events.FoodTag
{
    public static class Create
    {
        #region Methods

        [WebEvent("/fetch/foodtags/create", "POST", false, SecurityGroup.None)]
        public static async Task GetTagsLike(NameValueCollection headers, string Data, WebRequest.HttpResponse response)
        {
            FoodTags[] tags = await Binding.GetTable<FoodTags>().SelectCustom<FoodTags>(
                where: "Tag LIKE @str",
                tables: "FoodTags",
                Params: new List<System.Tuple<string, object>> { new System.Tuple<string, object>("str", headers["string"]) });

            if (tags.Length == 0)
            {
                await new FoodTags(headers["string"]).Insert();
                response.StatusCode = 200;
            }
            else
            {
                response.AddToData("error", "Tag Already Exists");
                response.StatusCode = 401;
            }
        }

        #endregion Methods
    }
}
