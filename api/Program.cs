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
            Binding.Add<LinkMenuRestaurant>();
            Binding.Add<Menu>();
            Binding.Add<MenuTimes>();

            Binding.Add<OpeningHours>();
            Binding.Add<Restaurant>();
            Binding.Add<Review>();
            Binding.Add<Visit>();

            Binding.Add<FoodOpinion>();
            Binding.Add<RestaurantOpinion>();
            Binding.Add<Session>();
            Binding.Add<User>();

            Binding.Add<Days>();
            Binding.Add<FoodChecks>();

            Binding.Add<SwipeData>();
            Binding.Add<RAdminSession>();
            Binding.Add<ResturantAdmin>();
            Binding.Add<ResturantVerification>();

            Binding.Add<Category>();
            Binding.Add<CommunityTagResponse>();
            Binding.Add<LinkCategoryFood>();
            Binding.Add<TagSuggestions>();
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
                api.Backend.Data.SQL.Instance.Start("root", "tat", Backend.Security.SQL_Connection_Details.ProdPword, "prodsql.trackandtaste.com");
                Bind();

                api.Backend.Endpoints.WebListener.Start(444, true);
            }
            //Run locally
            else
            {
                api.Backend.Data.SQL.Instance.Start("root", "tat", Backend.Security.SQL_Connection_Details.DevPword, "devsql.trackandtaste.com", "3307");
                Bind();
                //SQL_Test_Code.Run();

                api.Backend.Endpoints.WebListener.Start(5000);
            }

            //Prevent The App Closing
            while (true) { Console.ReadLine(); }
        }

        #endregion Methods
    }
}
