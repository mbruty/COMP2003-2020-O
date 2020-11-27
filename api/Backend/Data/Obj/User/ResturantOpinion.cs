using System;
using System.Collections.Generic;
using System.Text;

namespace api.Backend.Data.Obj
{
    public class ResturantOpinion : Object
    {
        public uint UserID, ResturantID;

        public uint SwipeRight, SwipeLeft;

        public bool NeverShow;
    }
}
