using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Linq;

namespace api
{
    internal class Program
    {
        #region Methods

        /// <summary>
        /// Creates the connections between the db objects and the tables
        /// </summary>
        private static void Bind() //Link objects to a table
        {
            Binding.Add<FoodItem>();
            Binding.Add<FoodItemTags>();
            Binding.Add<FoodTags>();

            Binding.Add<LinkMenuFood>();
            Binding.Add<LinkMenuResturant>();
            Binding.Add<Menu>();
            Binding.Add<MenuTimes>();

            Binding.Add<OpeningHours>();
            Binding.Add<Resturant>();
            Binding.Add<Review>();
            Binding.Add<Visit>();

            Binding.Add<FoodOpinion>();
            Binding.Add<ResturantOpinion>();
            Binding.Add<Session>();
            Binding.Add<User>();

            Binding.Add<Days>();
            Binding.Add<FoodChecks>();
        }

        private static void Main(string[] args)
        {
            //To run on dev server
            if (args.Contains("-d"))
            {
                api.Backend.Data.SQL.Instance.Start("root", "tat", Backend.Security.SQL_Connection_Details.DevPword, "devsql.trackandtaste.com", "3307");
                Bind();

                api.Backend.Endpoints.WebListener.Start(445, true);
            }
            // To run on the production server
            else if (args.Contains("-p"))
            {
                api.Backend.Data.SQL.Instance.Start("root", "tat", Backend.Security.SQL_Connection_Details.DevPword, "prodsql.trackandtaste.com");
                Bind();

                api.Backend.Endpoints.WebListener.Start(444, true);
            }
            //Run locally
            else
            {
                api.Backend.Data.SQL.Instance.Start("root", "tat", "Jaminima48");
                Bind();
                //SQL_Test_Code.Run();

                api.Backend.Endpoints.WebListener.Start();
            }

            //Prevent The App Closing
            while (true) { Console.ReadLine(); }
        }

        #endregion Methods
    }
}
