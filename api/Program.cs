using System;

namespace api
{
    internal class Program
    {
        #region Methods

        private static void Main(string[] args)
        {
            api.Backend.Endpoints.WebListener.Start();

            //Prevent The App Closing
            while (true) { Console.ReadLine(); }
        }

        #endregion Methods
    }
}