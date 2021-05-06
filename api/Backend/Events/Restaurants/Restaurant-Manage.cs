using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System;
using System.Threading.Tasks;

namespace api.Backend.Events.Restaurants
{
    public static class Restaurant_Manage
    {
        #region Methods

        [WebEvent(typeof(OpeningHoursBody), "/restaurant/addtime", "POST", false, SecurityGroup.Administrator)]
        public static async Task AddTimeToRestaurant(OpeningHoursBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            if (body.DayRef == null || !body.RestaurantID.HasValue || !body.TimeServing.HasValue || !body.OpenTime.HasValue)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing Required Inputs");
                return;
            }

            Data.Obj.OpeningHours _time = new Data.Obj.OpeningHours() { DayRef = body.DayRef, RestaurantID = body.RestaurantID.Value, TimeServing = body.TimeServing.Value, OpenTime = body.OpenTime.Value };

            if (!await _time.Insert<Data.Obj.OpeningHours>(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Created opening time");
            response.AddObjectToData("time", _time);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(RestaurantBody), "/restaurant/create", "POST", false, SecurityGroup.Administrator)]
        public static async Task CreateRestaurant(RestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            //if (!body.IsValid())
            //{
            //    response.StatusCode = 401;
            //    response.AddToData("error", "Restuarant Details Are Invalid");
            //    return;
            //}

            Data.Obj.Restaurant _restaurant = new Data.Obj.Restaurant() { Email = body.Email, Phone = body.Phone, Longitude = body.Longitude.Value, IsVerified = false, Latitude = body.Latitude.Value, OwnerID = perm.admin_id, RestaurantDescription = body.RestaurantDescription, RestaurantName = body.RestaurantName, Site = body.Site, Street1 = body.Street1, Street2 = body.Street2, Town = body.Town, County = body.County, Postcode = body.Postcode };

            if (!await _restaurant.Insert<Data.Obj.Restaurant>(true))
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
            if (!body.RestaurantID.HasValue)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing Required Inputs");
                return;
            }

            Table table = Binding.GetTable<Data.Obj.Restaurant>();
            Data.Obj.Restaurant[] restaurants = await table.Select<Data.Obj.Restaurant>(body.RestaurantID.Value);

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
            if (body.Latitude.HasValue && body.Latitude > -90 && body.Latitude < 90 && body.Latitude != 0) restaurant.Latitude = body.Latitude.Value;
            if (body.Longitude.HasValue && body.Longitude > -180 && body.Longitude < 180 && body.Longitude != 0) restaurant.Longitude = body.Longitude.Value;
            if (body.RestaurantName != null) restaurant.RestaurantName = body.RestaurantName;
            if (body.RestaurantDescription != null) restaurant.RestaurantDescription = body.RestaurantDescription;
            if (body.Street1 != null) restaurant.Street1 = body.Street1;
            if (body.Street2 != null) restaurant.Street2 = body.Street2;
            if (body.Town != null) restaurant.Town = body.Town;
            if (body.County != null) restaurant.County = body.County;
            if (body.Postcode != null) restaurant.Postcode = body.Postcode;

            if (!await restaurant.Update<Data.Obj.Restaurant>())
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

    public class OpeningHoursBody
    {
        #region Fields

        public string DayRef;
        public TimeSpan? OpenTime, TimeServing;
        public uint? RestaurantID;

        #endregion Fields
    }
}
