using api.Backend.Data.SQL;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Resturant : Object
    {
        public int Id, OwnerId;
        public string Name, Description, Phone, Email, Site;
        public float Longitude, Latitude;
    }
}
