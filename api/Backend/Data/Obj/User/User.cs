using System;
using System.Collections.Generic;
using System.Text;

namespace api.Backend.Data.Obj
{
    public class User : Object
    {
        public uint UserID;

        public string Email, Password, Nickname;
        public DateTime DateOfBirth;
        public uint FoodCheckID;
    }
}
