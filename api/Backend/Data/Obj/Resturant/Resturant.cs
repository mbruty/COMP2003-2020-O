using System;
using System.Collections.Generic;
using System.Text;

namespace api.Backend.Data.Obj
{
    public class Resturant : Object
    {
        public uint ResturantID, OwnerID;

        public string ResturantName, ResturantDescription, Phone, Email, Site;

        public float Longitude, Latitude;
    }
}
