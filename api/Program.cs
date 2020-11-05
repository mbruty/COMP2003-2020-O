using System;
using System.Linq;

namespace api
{
    internal class Program
    {
        #region Methods

        private static void Main(string[] args)
        {
            //To run on dev server
            if (args.Contains("-d"))
            {
                api.Backend.Data.SQL.Instance.Start("root", "tat", Backend.Security.SQL_Connection_Details.DevPword, "devsql.trackandtaste.com", "3307");
                api.Backend.Endpoints.WebListener.Start(445);
            }
            // To run on the production server
            else if (args.Contains("-p"))
            {
                api.Backend.Data.SQL.Instance.Start("root", "tat", Backend.Security.SQL_Connection_Details.DevPword, "prodsql.trackandtaste.com");
                api.Backend.Endpoints.WebListener.Start(444);
            }
            //Run locally
            else
            {
                api.Backend.Data.SQL.Instance.Start("root", "tat", "Jaminima48");
                //SQL_Test_Code.Run();
                SQL_Test_Code.Bind();

                api.Backend.Endpoints.WebListener.Start();
            }

            //Prevent The App Closing
            while (true) { Console.ReadLine(); }
        }

        #endregion Methods
    }
}