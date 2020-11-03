using System;

namespace api
{
    internal class Program
    {
        #region Methods

        private static void Main(string[] args)
        {
            // To run on dev server
            if(args.Contains('-d'))
                api.Backend.Endpoints.WebListener.Start(445);
            // To run on the production server
            else if(args.Contains('-p'))
                api.Backend.Endpoints.WebListener.Start(444);
            else
                api.Backend.Endpoints.WebListener.Start();

            //Prevent The App Closing
            while (true) { Console.ReadLine(); }
        }

        #endregion Methods
    }
}