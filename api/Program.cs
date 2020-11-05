﻿using System;
using System.Linq;

namespace api
{
    internal class Program
    {
        #region Methods

        private static void Main(string[] args)
        {
            api.Backend.Data.SQL.SQLInstance.Start("root","tat","Jaminima48");

            var p = api.Backend.Data.SQL.AutoSQL.tableColumns;

            // To run on dev server
            //if(args.Contains("-d"))
            //    api.Backend.Endpoints.WebListener.Start(445);
            //// To run on the production server
            //else if(args.Contains("-p"))
            //    api.Backend.Endpoints.WebListener.Start(444);
            //else
            //    api.Backend.Endpoints.WebListener.Start();

            //Prevent The App Closing
            while (true) { Console.ReadLine(); }
        }

        #endregion Methods
    }
}