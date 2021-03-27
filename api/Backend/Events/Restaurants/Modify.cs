using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Threading.Tasks;

namespace api.Backend.Events.Restaurants
{
    public static class Modify
    {
        [WebEvent("/restaurants/create", "POST", false, SecurityGroup.Administrator)]
        public static async Task CreateRestaurant(NameValueCollection headers, string data, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            RestaurantBody body = JsonConvert.DeserializeObject<RestaurantBody>(data);

            if (!body.IsValid())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Restuarant Details Are Invalid");
                return;
            }

            Restaurant _restaurant = new Restaurant() { Email = body.Email, Phone =body.Phone, Longitude=body.Longitude, IsVerified=false, Latitude=body.Latitude, OwnerID = perm.admin_id, RestaurantDescription = body.RestaurantDescription, RestaurantName = body.RestaurantName, Site = body.Site };

            if (!await _restaurant.Insert())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Created restaurant");
            response.AddObjectToData("restaurant", _restaurant);
            response.StatusCode = 200;
        }

        class RestaurantBody
        {
            public string RestaurantName, RestaurantDescription, Phone, Email, Site;
            public float Longitude, Latitude;

            public bool IsValid()
            {
                return ValidityChecks.IsValidEmail(Email) && ValidityChecks.IsValidPhone(Phone) &&  ValidityChecks.IsValidSite(Site) && Longitude > -180 && Longitude < 180 && Latitude > -90 && Latitude < 90;
            }
        }
    }
}
