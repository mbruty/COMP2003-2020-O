using System;
using System.Collections.Generic;
using System.Text;

namespace api.Backend.Data.Obj
{
    public class FoodItem : Object
    {
        public uint FoodID, FoodCheckID;

        public string FoodName, FoodDescription;

        public float Price;
    }
}
