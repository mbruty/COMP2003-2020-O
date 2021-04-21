using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.Threading.Tasks;
using System;

namespace api.Backend.Events.Restaurants
{
    public class OpeningHoursBody
    {
        public uint RestaurantID;
        public string DayRef;
        public TimeSpan OpenTime, TimeServing;
    }

    public static class Restaurant_Manage
    {
        #region Classes

        #endregion Classes

        #region Methods

        [WebEvent(typeof(OpeningHoursBody), "/restaurant/addtime", "POST", false, SecurityGroup.Administrator)]
        public static async Task AddTimeToRestaurant(OpeningHoursBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.OpeningHours _time = new Data.Obj.OpeningHours() { DayRef = body.DayRef, RestaurantID = body.RestaurantID, TimeServing = body.TimeServing, OpenTime=body.OpenTime };

#warning needs updating once reef makes db changes
            if (!await _time.Insert(false))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Created opening time");
            response.AddObjectToData("time", _time);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(RestaurantBody),"/restaurant/create", "POST", false, SecurityGroup.Administrator)]
        public static async Task CreateRestaurant(RestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            if (!body.IsValid())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Restuarant Details Are Invalid");
                return;
            }

            Data.Obj.Restaurant _restaurant = new Data.Obj.Restaurant() { Email = body.Email, Phone = body.Phone, Longitude = body.Longitude, IsVerified = false, Latitude = body.Latitude, OwnerID = perm.admin_id, RestaurantDescription = body.RestaurantDescription, RestaurantName = body.RestaurantName, Site = body.Site, Street1 = body.Street1, Street2 = body.Street2, Town = body.Town, County=body.County, Postcode=body.Postcode };

            if (!await _restaurant.Insert(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Created restaurant");
            response.AddObjectToData("restaurant", _restaurant);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(RestaurantBody), "/restaurant/modify", "PUT", false, SecurityGroup.Administrator)]
        public static async Task ModifyRestaurant(RestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Table table = Binding.GetTable<Data.Obj.Restaurant>();
            Data.Obj.Restaurant[] restaurants = await table.Select<Data.Obj.Restaurant>(body.RestaurantID);

            if (restaurants.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "That Restaurant Id does not exist");
                return;
            }

            Data.Obj.Restaurant restaurant = restaurants[0];

            if (restaurant.OwnerID != perm.admin_id)
            {
                response.StatusCode = 401;
                response.AddToData("error", "This is not your restaurant");
                return;
            }

            if (body.Email != null && ValidityChecks.IsValidEmail(body.Email)) restaurant.Email = body.Email;
            if (body.Phone != null && ValidityChecks.IsValidPhone(body.Phone)) restaurant.Phone = body.Phone;
            if (body.Site != null && ValidityChecks.IsValidSite(body.Site)) restaurant.Site = body.Site;
            if (body.Latitude > -90 && body.Latitude < 90 && body.Latitude != 0) restaurant.Latitude = body.Latitude;
            if (body.Longitude > -180 && body.Longitude < 180 && body.Longitude != 0) restaurant.Longitude = body.Longitude;
            if (body.RestaurantName != null) restaurant.RestaurantName = body.RestaurantName;
            if (body.RestaurantDescription != null) restaurant.RestaurantDescription = body.RestaurantDescription;
            if (body.Street1 != null) restaurant.Street1 = body.Street1;
            if (body.Street2 != null) restaurant.Street2 = body.Street2;
            if (body.Town != null) restaurant.Town = body.Town;
            if (body.County != null) restaurant.County = body.County;
            if (body.Postcode != null) restaurant.Postcode = body.Postcode;

            if (!await restaurant.Update())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Updated restaurant");
            response.AddObjectToData("restaurant", restaurant);
            response.StatusCode = 200;
        }

        #endregion Methods
    }
}
