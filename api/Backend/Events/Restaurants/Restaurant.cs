﻿using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using Newtonsoft.Json;
using System.Collections.Specialized;
using System.Threading.Tasks;

namespace api.Backend.Events.Restaurants
{
    public static class Restaurant
    {
        #region Classes

        public class RestaurantBody
        {
            #region Fields

            public float Longitude, Latitude;
            public uint RestaurantID;
            public string RestaurantName, RestaurantDescription, Phone, Email, Site;

            #endregion Fields

            #region Methods

            public bool IsValid()
            {
                return ValidityChecks.IsValidEmail(Email) && ValidityChecks.IsValidPhone(Phone) && ValidityChecks.IsValidSite(Site) && Longitude > -180 && Longitude < 180 && Latitude > -90 && Latitude < 90;
            }

            #endregion Methods
        }

        #endregion Classes

        #region Methods

        [WebEvent(typeof(RestaurantBody),"/restaurants/create", "POST", false, SecurityGroup.Administrator)]
        public static async Task CreateRestaurant(RestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            if (!body.IsValid())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Restuarant Details Are Invalid");
                return;
            }

            Data.Obj.Restaurant _restaurant = new Data.Obj.Restaurant() { Email = body.Email, Phone = body.Phone, Longitude = body.Longitude, IsVerified = false, Latitude = body.Latitude, OwnerID = perm.admin_id, RestaurantDescription = body.RestaurantDescription, RestaurantName = body.RestaurantName, Site = body.Site };

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

        [WebEvent(typeof(RestaurantBody), "/restaurants", "GET", false, SecurityGroup.Administrator)]
        public static async Task GetRestaurant(RestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
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

            response.AddToData("message", "Fetched restaurant");
            response.AddObjectToData("restaurant", restaurant);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(RestaurantBody), "/restaurants/modify", "PUT", false, SecurityGroup.Administrator)]
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