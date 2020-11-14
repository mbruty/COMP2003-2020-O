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
            Binding.Add<User>("User");
            Binding.Add<Session>("Session");
            Binding.Add<FoodChecks>("FoodChecks");

            Binding.Add<Restaurant>("Restaurant");
            Binding.Add<FoodTags>("FoodTags");
            Binding.Add<MenuItem>("MenuItem");
            Binding.Add<MenuItemTags>("MenuItemTags");

            Binding.Add<FoodOpinion>("FoodOpinion");
            Binding.Add<RestaurantOpinion>("RestaurantOpinion");
            Binding.Add<Review>("Review");
            Binding.Add<Visit>("Visit");
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