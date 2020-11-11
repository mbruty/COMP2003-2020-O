using System;
using System.Configuration;
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

        #region 

        public ResturantOpinion resturantopinion
        {
            get { return Binding.GetTable<ResturantOpinion>().Select<ResturantOpinion>("ResturantID", Id)?[0];  } 
        }

        public Visit[] visit
        {
            get { return Binding.GetTable<Visit>().Select<Visit>("ResturantID", Id);  }
        }

        public MenuItem[] menuitem
        {
            get { return Binding.GetTable<MenuItem>().Select<MenuItem>("ResturantID", Id);  }
        }

        public User user
        {
            get { return Binding.GetTable<User>().Select<User>("ID", OwnerId)?[0];  }
        }

        #endregion
    }
}