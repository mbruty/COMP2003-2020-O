using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class ResturantOpinion : Backend.Data.SQL.Object
    {
        public int UserId, ResturantId, SwipeLeft, SwipeRight;
        public bool NeverShow;
    }
}
