using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Restaurant : Object
    {
        #region Fields

        public bool IsVerified;
        public float Longitude, Latitude;
        public uint RestaurantID, OwnerID;

        public string RestaurantName, RestaurantDescription, Phone, Email, Site, Street1, Street2, Town, County, Postcode, WebhookURI;

        #endregion Fields

        #region Methods

        public async Task<Menu[]> GetMenus()
        {
            return await Binding.GetTable<Menu>().SelectCustom<Menu>(
                tables: "LinkMenuRestaurant,Menu",
                where: "LinkMenuRestaurant.MenuID = Menu.MenuID AND LinkMenuRestaurant.RestaurantID = @RestPar",
                Params: new List<Tuple<string, object>>() { new Tuple<string, object>("RestPar", RestaurantID) }
                );
        }

        public async Task<OpeningHours[]> GetOpeningHours()
        {
            return await Binding.GetTable<OpeningHours>().Select<OpeningHours>(RestaurantID);
        }

        public async Task<RestaurantAdmin> GetOwner()
        {
            return (await Binding.GetTable<RestaurantAdmin>().Select<RestaurantAdmin>(OwnerID))?[0];
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
                Params: new List<Tuple<string, object>>() { new Tuple<string, object>("RestPar", RestaurantID) }
                );
        }

        public async Task<Visit[]> GetVisits()
        {
            return await Binding.GetTable<Visit>().Select<Visit>("RestaurantID", RestaurantID);
        }

        public async Task<bool> UpdateWebhook()
        {
            return await SQL.Instance.Execute("UPDATE Restaurant SET WebhookURI=@uri where RestaurantID=@id",
                 new List<Tuple<string, object>>() { new Tuple<string, object>("uri", WebhookURI), new Tuple<string, object>("id", RestaurantID) });
        }

        #endregion Methods
    }
}
