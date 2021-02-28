using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Security;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace api.Backend.Events.Restaurants
{
    static class Webhook
    {
        [WebEvent("/book", "POST", false)]
        public static async Task BookWebHook(NameValueCollection headers, string Data, Endpoints.WebRequest.HttpResponse response)
        {
            int restaurantID;
            try
            {
                Book data = JsonConvert.DeserializeObject<Book>(Data);

                if (data.Date == new DateTime() || data.RestaurantID == 0 || data.PartySize == 0)
                {
                    throw new Exception("Bad request");
                }
                restaurantID = data.RestaurantID;
            }
            catch (Exception)
            {
                response.StatusCode = 400;
                return;
            }
            Restaurant[] restaurants = await Binding.GetTable<Restaurant>().Select<Restaurant>("RestaurantID", restaurantID, 1);
            if (restaurants.Length != 1 || restaurants[0].WebhookURI == null)
            {
                response.StatusCode = 404;
                return;
            }

            WebRequest forwarding = WebRequest.Create(restaurants[0].WebhookURI);
            forwarding.Method = "POST";
            forwarding.ContentType = "application/json";
            using (var streamWriter = new StreamWriter(forwarding.GetRequestStream()))
            {
                streamWriter.Write(Data);
                streamWriter.Flush();
            }
            try
            {
                HttpWebResponse res = (HttpWebResponse)forwarding.GetResponse();
                int code;
                switch (res.StatusCode.ToString())
                {
                    case "OK":
                        code = 200;
                        break;
                    case "Created":
                        code = 201;
                        break;
                    case "Accepted":
                        code = 202;
                        break;
                    case "NoContent":
                        code = 204;
                        break;
                    default:
                        code = 400;
                        break;
                }
                response.StatusCode = code;
            }
            catch (Exception e)
            {
                response.StatusCode = 500;
            }
        }

        [WebEvent("/webhook", "PUT", false, SecurityGroup.User)]
        public static async Task UpdateWebhook(NameValueCollection headers, string Data, Endpoints.WebRequest.HttpResponse response)
        {
            UpdateData data = JsonConvert.DeserializeObject<UpdateData>(Data);
            Restaurant[] restaurants = await Binding.GetTable<Restaurant>().Select<Restaurant>("RestaurantID", data.RestaurantID, 1);
            if(restaurants.Length < 1)
            {
                response.StatusCode = 404;
                return;
            }

            int uid = Convert.ToInt32(headers.Get("userid"));
            if(restaurants[0].OwnerID != uid)
            {
                response.StatusCode = 401;
                return;
            }

            bool containsHttpMethod = data.WebhookURI.StartsWith("http://") || data.WebhookURI.StartsWith("https://");
            if (!containsHttpMethod)
            {
                response.StatusCode = 400;
                response.AddToData("Error", "IncorrectURI");
                return;
            }

            restaurants[0].WebhookURI = data.WebhookURI;
            // Invalidate cache key
            Backend.Data.Redis.Instance.InvalidateKey($"Restaurant-{data.RestaurantID}");
            bool updated = await restaurants[0].UpdateWebhook();
            response.StatusCode = updated ? 200 : 500;
        }

        private class Book
        {
            public DateTime Date { get; set; }
            public int RestaurantID { get; set; }
            public int PartySize { get; set; }
        }

        private class UpdateData
        {
            public int RestaurantID { get; set; }
            public string WebhookURI { get; set; }

        }
    }
}
