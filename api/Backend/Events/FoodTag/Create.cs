using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace api.Backend.Events.FoodTag
{
    public class FoodTagBody
    {
        #region Properties

        public string name { get; set; }

        #endregion Properties
    }

    public static class Create
    {
        #region Methods

        [WebEvent(typeof(FoodTagBody), "/foodtags/create", "POST", false, SecurityGroup.None)]
        public static async Task GetTagsLike(FoodTagBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            FoodTags[] tags = await Binding.GetTable<FoodTags>().SelectCustom<FoodTags>(
                where: "Tag LIKE @str",
                tables: "FoodTags",
                Params: new List<System.Tuple<string, object>> { new System.Tuple<string, object>("str", body.name) });

            if (tags.Length == 0)
            {
                await new FoodTags(body.name).Insert<FoodTags>();
                response.StatusCode = 201;

                // Get the inserted food tag
                FoodTags[] inserted = await Binding.GetTable<FoodTags>().SelectCustom<FoodTags>(
                    where: "Tag LIKE @str",
                    tables: "FoodTags",
                    Params: new List<System.Tuple<string, object>> { new System.Tuple<string, object>("str", body.name) });

                // Create a web request to the meilisearch server
                System.Net.WebRequest request = System.Net.WebRequest.Create("http://search.trackandtaste.com/indexes/foodtags/documents");
                request.Method = "POST";
                request.ContentType = "application/json;charset=utf-8";
                // Create a json string containing the new data
                using (var streamWriter = new StreamWriter(request.GetRequestStream()))
                {
                    string json = "[{\"id\":\"" + inserted[0].FoodTagID + "\", \"tag\":\"" + inserted[0].Tag + "\"}]";

                    streamWriter.Write(json);
                }

                try
                {
                    // Send that data
                    System.Net.WebResponse httpResponse = request.GetResponse();
                    // Just here for debuggin, comment out if you want to see response
                    //using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                    //{
                    //    var result = streamReader.ReadToEnd();
                    //}
                }
                catch (System.Net.WebException ex)
                {
                    response.StatusCode = 500;
                    var resp = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();
                    response.AddToData("error", resp);
                }
            }
            else
            {
                response.AddToData("error", "Tag Already Exists");
                // 208 already reported seems more appropriate than Unauthorized
                response.StatusCode = 208;
            }
        }

        [WebEvent(typeof(string), "/foodtags/sync", "POST", false, SecurityGroup.None)]
        public static async Task SyncSearch(string body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            // Get all food tags
            FoodTags[] all = await Binding.GetTable<FoodTags>().SelectCustom<FoodTags>("1=1", 0);
            List<string> json = new List<string>();
            // Create a json string for each food tag
            foreach (FoodTags ft in all)
            {
                json.Add("{\"id\":\"" + ft.FoodTagID + "\", \"tag\":\"" + ft.Tag + "\"}");
            }
            // Join this array to create a json array string
            string requestBody = "[" + string.Join(",", json.ToArray()) + "]";
            System.Net.WebRequest request = System.Net.WebRequest.Create("http://search.trackandtaste.com/indexes/foodtags/documents");
            request.Method = "POST";
            request.ContentType = "application/json;charset=utf-8";
            using (var streamWriter = new StreamWriter(request.GetRequestStream()))
            {
                streamWriter.Write(requestBody);
            }

            try
            {
                // Send the request
                System.Net.WebResponse httpResponse = request.GetResponse();

                // For debugging, comment out to see response
                //using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                //{
                //    var result = streamReader.ReadToEnd();
                //}

                response.StatusCode = 202;
            }
            catch (System.Net.WebException ex)
            {
                response.StatusCode = 500;
                var resp = new StreamReader(ex.Response.GetResponseStream()).ReadToEnd();
                response.AddToData("error", resp);
            }
        }

        #endregion Methods

        #region Classes

        

        #endregion Classes
    }
}
