﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api
{
    class Program
    {
        static void Main(string[] args)
        {
            api.Backend.Endpoints.WebListener.Start();

            while (true) { Console.ReadLine(); }
        }
    }
}
