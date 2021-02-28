using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Restaurant : Object
    {
        #region Fields

        public float Longitude, Latitude;
        public uint RestaurantID, OwnerID;

        public string RestaurantName, RestaurantDescription, Phone, Email, Site, WebhookURI;

        #endregion Fields

        #region Methods

        public async Task<Menu[]> GetMenus()
        {
            return await Binding.GetTable<Menu>().SelectCustom<Menu>(
                tables: "LinkMenuRestaurant,Menu",
                where: "LinkMenuRestaurant.MenuID = Menu.MenuID AND LinkMenuRestaurant.RestaurantID = @RestPar",
                Params: new List<Tuple<string, object>>() { new Tuple<string, object>("ResetPar", RestaurantID) }
                );
        }

        public async Task<OpeningHours[]> GetOpeningHours()
        {
            return await Binding.GetTable<OpeningHours>().Select<OpeningHours>(RestaurantID);
        }

        public async Task<User> GetOwner()
        {
            return (await Binding.GetTable<User>().Select<User>(OwnerID))?[0];
        }

        public async Task<RestaurantOpinion[]> GetRestaurantOpinions()
        {
            return await Binding.GetTable<RestaurantOpinion>().Select<RestaurantOpinion>("RestaurantID", RestaurantID);
        }

        public async Task<Review[]> GetReviews()
        {
            return await Binding.GetTable<Review>().SelectCustom<Review>(
                tables: "Review,Visit",
                where: "Review.VisitRef = Visit.VisitRef AND Visit.RestaurantID = @RestPar",
                Params: new List<Tuple<string, object>>() { new Tuple<string, object>("ResetPar", RestaurantID) }
                );
        }

        public async Task<Visit[]> GetVisits()
        {
            return await Binding.GetTable<Visit>().Select<Visit>("RestaurantID", RestaurantID);
        }

        #endregion Methods
    }
}
