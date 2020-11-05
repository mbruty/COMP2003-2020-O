using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Linq;

namespace api
{
    internal class Program
    {
        #region Methods

        private static void Main(string[] args)
        {
            api.Backend.Data.SQL.Instance.Start("root", "tat", "Jaminima48");

            Table[] t = api.Backend.Data.SQL.AutoSQL.Instance.tables;

            Binding.Add<User>("User");

            var p = Binding.GetTable<User>().Select<User>();

            p[0].Nickname = "Garath";
            p[0].Update();

            User u = new User();
            u.Email = "oscar.d@gmai.com";
            u.Password = "sdsfsdf";
            u.YearOfBirth = 2002;
            u.CheckId = 1;

            u.Insert();

            u = Binding.GetTable<User>().Select<User>("Email", u.Email)?.First();

            u.Delete();

            //User[] users = /*t[4].Select<User>(new object[] { null, "o.d@g.c" });*/
            //t[4].Select<User>("YearOfBirth", 2001);

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

        #region Classes

        private class User : Backend.Data.SQL.Object
        {
            #region Fields

            public string Email, Password, Nickname;
            public int Id, YearOfBirth, CheckId;

            #endregion Fields
        }

        #endregion Classes
    }
}