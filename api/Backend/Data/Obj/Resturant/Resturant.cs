using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class Restaurant : Object
    {
        #region Fields

        public int Id, OwnerId;
        public float Longitude, Latitude;
        public string Name, Description, Phone, Email, Site;

        #endregion Fields

        #region Properties

        public MenuItem[] menuitems
        {
            get { return Binding.GetTable<MenuItem>().Select<MenuItem>("RestaurantID", Id); }
        }

        public User Owner
        {
            get { return Binding.GetTable<User>().Select<User>("Id", OwnerId)?[0]; }
        }

        public RestaurantOpinion Restaurantopinion
        {
            get { return Binding.GetTable<RestaurantOpinion>().Select<RestaurantOpinion>("RestaurantID", Id)?[0]; }
        }

        public Visit[] visits
        {
            get { return Binding.GetTable<Visit>().Select<Visit>("RestaurantID", Id); }
        }

        #endregion Properties
    }
}