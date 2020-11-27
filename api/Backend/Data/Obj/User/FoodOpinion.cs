using System;
using System.Collections.Generic;
using System.Text;

namespace api.Backend.Data.Obj
{
    public class FoodOpinion : Object
    {
        public uint UserID, FoodTagID;

        public uint SwipeRight, SwipeLeft;

        public bool NeverShow, Favourite;
    }
}
