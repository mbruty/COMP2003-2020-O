using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Backend.Data.Obj
{
    public class FoodChecks : Backend.Data.SQL.Object
    {
        public int Id;
        public bool IsVegetarian, IsVegan, ContainsLactose, ContainsNut, IsGlutenFree, ContainsEgg, ContainsSoy, IsHallal, IsKosher;
    }
}
