using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System;
using System.Threading.Tasks;

namespace api.Backend.Events.Restaurants
{
    public static class Menu_Manage
    {
        #region Methods

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

        [WebEvent(typeof(MenuBody), "/menu/delete", "DELETE", false, SecurityGroup.Administrator)]
        public static async Task DeleteRestaurant(MenuBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.Menu[] _menus = await Binding.GetTable<Menu>().Select<Menu>(body.MenuID);

            if (_menus.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            await _menus[0].Delete();

            response.AddToData("message", "Deleted menu");
            response.StatusCode = 200;
        }

        [WebEvent(typeof(MenuBody), "/menu/update", "POST", false, SecurityGroup.Administrator)]
        public static async Task UpdateRestaurant(MenuBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.Menu[] _menus = await Binding.GetTable<Menu>().Select<Menu>(body.MenuID);

            if (_menus.Length == 0)
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

        #endregion Methods
    }

    public class LinkMenuRestaurantBody
    {
        #region Fields

        public bool AlwaysServe, IsActive;
        public uint MenuRestID, MenuID, RestaurantID;

        #endregion Fields
    }

    public class LinkMenuFoodBody
    {
        #region Fields

        public uint MenuID, FoodID;

        #endregion Fields
    }

    public class MenuTimeBody
    {
        #region Fields

        public string DayRef;
        public uint MenuRestID;
        public uint MenuTimeID;
        public TimeSpan StartServing, TimeServing;

        #endregion Fields
    }
}
