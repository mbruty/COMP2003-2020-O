using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class Resturant : Object
    {
        #region Fields

        public int Id, OwnerId;
        public float Longitude, Latitude;
        public string Name, Description, Phone, Email, Site;

        #endregion Fields

        #region Properties

        public MenuItem[] menuitems
        {
            get { return Binding.GetTable<MenuItem>().Select<MenuItem>("ResturantID", Id); }
        }

        public User Owner
        {
            get { return Binding.GetTable<User>().Select<User>("Id", OwnerId)?[0]; }
        }

        public ResturantOpinion resturantopinion
        {
            get { return Binding.GetTable<ResturantOpinion>().Select<ResturantOpinion>("ResturantID", Id)?[0]; }
        }

        public Visit[] visits
        {
            get { return Binding.GetTable<Visit>().Select<Visit>("ResturantID", Id); }
        }

        #endregion Properties
    }
}