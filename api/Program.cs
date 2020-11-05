using System;
using System.Linq;
using api.Backend.Data.SQL.AutoSQL;

namespace api
{
    internal class Program
    {
        #region Methods

        class User
        {
            public int Id, YearOfBirth, CheckId;
            public string Email, Password, Nickname;
        }

        private static void Main(string[] args)
        {
            api.Backend.Data.SQL.Instance.Start("root","tat","Jaminima48");

            Table[] t = api.Backend.Data.SQL.AutoSQL.Instance.tables;

            User[] users = t[4].Select<User>(new object[] { 1 });

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