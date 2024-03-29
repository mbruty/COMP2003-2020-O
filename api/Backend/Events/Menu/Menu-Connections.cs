﻿using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Threading.Tasks;

namespace api.Backend.Events.Restaurants
{
    public static class Menu_Connections
    {
        #region Methods

        [WebEvent(typeof(MenuTimeBody), "/menu/addtime", "POST", false, SecurityGroup.Administrator)]
        public static async Task AddTimeToRestaurant(MenuTimeBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            if (body.DayRef == null || !body.MenuRestID.HasValue || !body.StartServing.HasValue || !body.TimeServing.HasValue)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing Required Inputs");
                return;
            }

            Data.Obj.MenuTimes _time = new Data.Obj.MenuTimes() { DayRef = body.DayRef, MenuRestID = body.MenuRestID.Value, StartServing = body.StartServing.Value, ServingFor = body.TimeServing.Value };

            if (!await _time.Insert<MenuTimes>(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Created menu time");
            response.AddObjectToData("time", _time);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(LinkMenuRestaurantBody), "/menu/linkrestaurant", "POST", false, SecurityGroup.Administrator)]
        public static async Task LinkMenuToRestaurant(LinkMenuRestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            if (!body.MenuID.HasValue || !body.RestaurantID.HasValue || !body.IsActive.HasValue || !body.AlwaysServe.HasValue)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing Required Inputs");
                return;
            }

            Data.Obj.LinkMenuRestaurant _link = new Data.Obj.LinkMenuRestaurant() { MenuID = body.MenuID.Value, RestaurantID = body.RestaurantID.Value, IsActive = body.IsActive.Value, AlwaysServe = body.AlwaysServe.Value };

            if (!await _link.Insert<LinkMenuRestaurant>(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Created link");
            response.AddObjectToData("link", _link);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(LinkMenuRestaurantBody), "/menu/unlinkrestaurant", "DELETE", false, SecurityGroup.Administrator)]
        public static async Task RemoveLinkMenuToRestaurant(LinkMenuRestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            if (!body.MenuID.HasValue || !body.RestaurantID.HasValue)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing Required Inputs");
                return;
            }

            Data.Obj.LinkMenuRestaurant[] _links = await Binding.GetTable<LinkMenuRestaurant>().Select<LinkMenuRestaurant>(new string[] { "MenuID", "RestaurantID" }, new object[] { body.MenuID.Value, body.RestaurantID.Value });

            if (_links.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "This link does not exist!");
                return;
            }

            if (!await _links[0].Delete<LinkMenuRestaurant>())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Deleted link");
            response.StatusCode = 200;
        }

        [WebEvent(typeof(MenuTimeBody), "/menu/removetime", "DELETE", false, SecurityGroup.Administrator)]
        public static async Task RemoveTimeToRestaurant(MenuTimeBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            if (!body.MenuTimeID.HasValue)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing Required Inputs");
                return;
            }

            Data.Obj.MenuTimes[] _times = await Binding.GetTable<MenuTimes>().Select<MenuTimes>(body.MenuTimeID.Value);

            if (_times.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "No such Menu Time");
                return;
            }

#warning does not confirm menu time ownership

            if (!await _times[0].Delete<MenuTimes>())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Deleted menu time");
            response.StatusCode = 200;
        }

        [WebEvent(typeof(LinkMenuFoodBody), "/menu/linkfooditem", "POST", false, SecurityGroup.Administrator)]
        public static async Task LinkItemToMenu(LinkMenuFoodBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.LinkMenuFood _link = new Data.Obj.LinkMenuFood() { MenuID = body.MenuID, FoodID = body.FoodID };

            if (!await _link.Insert<LinkMenuFood>(true))
            {
                response.StatusCode = 500;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Created link");
            response.StatusCode = 200;
        }

        [WebEvent(typeof(LinkMenuFoodBody), "/menu/unlinkfooditem", "DELETE", false, SecurityGroup.Administrator)]
        public static async Task RemoveFoodItemLink(LinkMenuFoodBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.LinkMenuFood[] _links = await Binding.GetTable<LinkMenuFood>().Select<LinkMenuFood>(new string[] { "MenuID", "FoodID" }, new object[] { body.MenuID, body.FoodID });

            if (_links.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "This link does not exist!");
                return;
            }

            if (!await _links[0].Delete<LinkMenuFood>())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Deleted link");
            response.StatusCode = 200;
        }

        [WebEvent(typeof(string), "/menu/unlinkfooditem", "OPTIONS", false, SecurityGroup.None)]
        public static async Task HandleOptionsRemoveFoodItemLink(string body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            response.isOptions = true;
            response.StatusCode = 200;
        }

        #endregion Methods
    }
}
