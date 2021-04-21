using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Linq;
using System.Collections.Specialized;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace api.Backend.Events.Restaurants
{
    public class RestaurantBody
    {
        #region Fields

        public float Longitude, Latitude;
        public uint RestaurantID;
        public string RestaurantName, RestaurantDescription, Phone, Email, Site, Street1, Street2, Town, County, Postcode;

        #endregion Fields

        #region Methods

        public bool IsValid()
        {
            return ValidityChecks.IsValidEmail(Email) && ValidityChecks.IsValidPhone(Phone) && ValidityChecks.IsValidSite(Site) && Longitude > -180 && Longitude < 180 && Latitude > -90 && Latitude < 90;
        }

        #endregion Methods
    }

    public static class Restaurant_Fetch
    {
        #region Classes

        

        #endregion Classes

        #region Methods

        [WebEvent(typeof(RestaurantBody), "/restaurant", "GET", false, SecurityGroup.Administrator)]
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

        [WebEvent(typeof(RestaurantBody), "/restaurant/menus", "GET", false, SecurityGroup.Administrator)]
        public static async Task GetRestaurantMenus(RestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
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

            Menu[] _menus = await restaurant.GetMenus();

            var tasks = new List<Task>();
            foreach (Menu menu in _menus)
            {
                tasks.Add(menu.GetMenuTimesAndStore());
            }

            Task t = Task.WhenAll(tasks);

            response.AddToData("message", "Fetched restaurant");
            response.AddObjectToData("menus", _menus);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(RestaurantBody), "/restaurant/me", "GET", false, SecurityGroup.Administrator)]
        public static async Task GetAllMyRestaurants(RestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Table table = Binding.GetTable<Data.Obj.Restaurant>();
            RestaurantAdmin[] admins = await Binding.GetTable<Data.Obj.RestaurantAdmin>().Select<RestaurantAdmin>(perm.admin_id);
            Data.Obj.Restaurant[] restaurants = await admins[0].GetRestaurantsOwned();

            if (restaurants.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "That Restaurant Id does not exist");
                return;
            }

            response.AddToData("message", "Fetched restaurants");
            response.AddObjectToData("restaurants", restaurants);
            response.StatusCode = 200;
        }

        #endregion Methods
    }
}
