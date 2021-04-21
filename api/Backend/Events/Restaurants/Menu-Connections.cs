using api.Backend.Data.Obj;
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
            Data.Obj.MenuTimes _time = new Data.Obj.MenuTimes() { DayRef = body.DayRef, MenuRestID = body.MenuRestID, StartServing = body.StartServing, ServingFor = body.TimeServing };

            if (!await _time.Insert(true))
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

        [WebEvent(typeof(LinkMenuRestaurantBody), "/menu/unlinkrestaurant", "DELETE", false, SecurityGroup.Administrator)]
        public static async Task RemoveLinkMenuToRestaurant(LinkMenuRestaurantBody body, WebRequest.HttpResponse response, Security.SecurityPerm perm)
        {
            Data.Obj.LinkMenuRestaurant[] _links = await Binding.GetTable<LinkMenuRestaurant>().Select<LinkMenuRestaurant>(new string[] { "MenuID", "RestaurantID" }, new object[] { body.MenuID, body.RestaurantID });

            if (_links.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "This link does not exist!");
                return;
            }

            if (!await _links[0].Delete())
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
            Data.Obj.MenuTimes[] _times = await Binding.GetTable<MenuTimes>().Select<MenuTimes>(body.MenuTimeID);

            if (_times.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "No such Menu Time");
                return;
            }

            if (!await _times[0].Delete())
            {
                response.StatusCode = 401;
                response.AddToData("error", "Something went wrong!");
                return;
            }

            response.AddToData("message", "Deleted menu time");
            response.StatusCode = 200;
        }

        #endregion Methods
    }
}
