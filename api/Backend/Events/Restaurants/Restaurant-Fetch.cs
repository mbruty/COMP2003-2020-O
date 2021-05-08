using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Backend.Events.Restaurants
{
    public static class Restaurant_Fetch
    {
        #region Methods

        [WebEvent(typeof(RestaurantBody), "/restaurant/me", "GET", false, SecurityGroup.Administrator)]
        public static async Task GetAllMyRestaurants(RestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Table table = Binding.GetTable<Data.Obj.Restaurant>();
            RestaurantAdmin[] admins = await Binding.GetTable<Data.Obj.RestaurantAdmin>().Select<RestaurantAdmin>(perm.admin_id);
            Data.Obj.Restaurant[] restaurants = await admins[0].GetRestaurantsOwned();

            response.AddToData("message", "Fetched restaurants");
            response.AddObjectToData("restaurants", restaurants);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(RestaurantBody), "/restaurant", "GET", false, SecurityGroup.None)]
        public static async Task GetRestaurant(RestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
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


            response.AddToData("message", "Fetched restaurant");
            response.AddObjectToData("restaurant", restaurant);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(RestaurantReqWithTimes), "/restaurant/menus", "GET", false, SecurityGroup.Administrator)]
        public static async Task GetRestaurantMenus(RestaurantReqWithTimes body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
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

            Menu[] _menus = await restaurant.GetMenus();

            var tasks = new List<Task>();
            foreach (Menu menu in _menus)
            {
                tasks.Add(menu.GetMenuTimesAndStore());
            }

            Task t = Task.WhenAll(tasks);

            if (body.When.HasValue)
            {
                List<Menu> _menuList = new List<Menu>();
                foreach (Menu menu in _menus)
                {
                    if (menu.MenuTimes != null && menu.MenuTimes.Length > 0)
                    {
                        foreach (MenuTimes times in menu.MenuTimes)
                        {
                            if (times.IsServing(body.When.Value))
                            {
                                _menuList.Add(menu);
                                break;
                            }
                        }
                    }
                }

                _menus = _menuList.ToArray();
            }

            response.AddToData("message", "Fetched restaurant");
            response.AddObjectToData("menus", _menus);
            response.StatusCode = 200;
        }

        #endregion Methods
    }

    public class RestaurantBody
    {
        #region Fields

        public float? Longitude, Latitude;
        public uint? RestaurantID;
        public string RestaurantName, RestaurantDescription, Phone, Email, Site, Street1, Street2, Town, County, Postcode;

        #endregion Fields

        #region Methods

        public bool IsValid()
        {
            return RestaurantName.Length > 0 && RestaurantDescription.Length > 0;
            //return ValidityChecks.IsValidEmail(Email) && ValidityChecks.IsValidPhone(Phone) && ValidityChecks.IsValidSite(Site) && Longitude > -180 && Longitude < 180 && Latitude > -90 && Latitude < 90 && Street1 != null && Street2 != null && Town != null && County != null && Postcode != null;
        }

        #endregion Methods
    }

    public class RestaurantReqWithTimes
    {
        #region Fields

        public uint? RestaurantID;
        public DateTime? When;

        #endregion Fields
    }
}
