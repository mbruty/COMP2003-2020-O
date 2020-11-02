using System;

namespace api
{
    internal class Program
    {
        private static void Main(string[] args)
        {
            api.Backend.Endpoints.WebListener.Start();

            //Prevent The App Closing
            while (true) { Console.ReadLine(); }
        }
    }
}