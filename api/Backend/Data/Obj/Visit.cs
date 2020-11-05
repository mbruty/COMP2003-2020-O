using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class Visit : Backend.Data.SQL.Object
    {
        public int Id, ResturantId, UserId, GroupSize;
        public DateTime Date;
    }
}
