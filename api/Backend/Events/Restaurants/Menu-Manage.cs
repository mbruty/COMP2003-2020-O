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
    public class MenuTimeBody
    {
        public uint MenuRestID;
        public string DayRef;
        public TimeSpan StartServing, TimeServing;
    }

    public class LinkMenuRestaurantBody
    {
        public uint MenuRestID, MenuID, RestaurantID;
        public bool AlwaysServe, IsActive;
    }

    public static class Menu_Manage
    {
        [WebEvent(typeof(MenuBody), "/menu/create", "POST", false, SecurityGroup.Administrator)]
        public static async Task CreateRestaurant(MenuBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.Menu _menu = new Data.Obj.Menu() { MenuID = body.MenuID, IsChildMenu = body.IsChildMenu.HasValue && body.IsChildMenu.Value, MenuName = body.MenuName };

            if (!await _menu.Insert(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Created menu");
            response.AddObjectToData("menu", _menu);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(MenuBody), "/menu/update", "POST", false, SecurityGroup.Administrator)]
        public static async Task UpdateRestaurant(MenuBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.Menu[] _menus = await Binding.GetTable<Menu>().Select<Menu>(body.MenuID);

            if (_menus.Length==0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            Menu _menu = _menus[0];

            if (body.MenuName.Length > 0) _menu.MenuName = body.MenuName;
            if (body.IsChildMenu.HasValue) _menu.IsChildMenu = body.IsChildMenu.Value;

            await _menu.Update();

            response.AddToData("message", "Updated menu");
            response.AddObjectToData("menu", _menu);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(LinkMenuRestaurantBody), "/menu/linkrestaurant", "POST", false, SecurityGroup.Administrator)]
        public static async Task LinkMenuToRestaurant(LinkMenuRestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.LinkMenuRestaurant _link = new Data.Obj.LinkMenuRestaurant() { MenuID = body.MenuID, RestaurantID = body.RestaurantID, IsActive = body.IsActive, AlwaysServe = body.AlwaysServe };

            if (!await _link.Insert(true))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Created link");
            response.AddObjectToData("link", _link);
            response.StatusCode = 200;
        }

        [WebEvent(typeof(MenuTimeBody), "/menu/addtime", "POST", false, SecurityGroup.Administrator)]
        public static async Task AddTimeToRestaurant(MenuTimeBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.MenuTimes _time = new Data.Obj.MenuTimes() { DayRef = body.DayRef, MenuRestID = body.MenuRestID, StartServing = body.StartServing, ServingFor = body.TimeServing };

#warning needs updating once reef makes db changes
            if (!await _time.Insert(false)) 
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Created menu time");
            response.AddObjectToData("time", _time);
            response.StatusCode = 200;
        }
    }
}
