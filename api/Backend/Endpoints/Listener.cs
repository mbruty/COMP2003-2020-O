using System;
using System.Net;

namespace api.Backend.Endpoints
{
    public static class WebListener
    {
        #region Methods

        /// <summary>
        /// Handles the start of a request chain
        /// </summary>
        /// <param name="result"></param>
        private static async void PreHandle(IAsyncResult result)
        {
            //Get the object containing the request details
            HttpListenerContext listenerContext = listener.EndGetContext(result);
            listener.BeginGetContext(PreHandle, null);

            //Continue request handling in the appropriate handler
            if (listenerContext.Request.IsWebSocketRequest) await WebSockets.PreHandle(listenerContext);
            else WebRequest.PreHandle(listenerContext);
        }

        #endregion Methods

        #region Fields

        public static HttpListener listener;

        #endregion Fields

        /// <summary>
        /// Start the HTTPListener
        /// </summary>
        /// <param name="port">Port to listen on</param>
        /// <param name="externalConnections">If we accept no local requests (requires admin)</param>
        public static void Start(int port = 3000, bool externalConnections = false)
        {
            listener = new HttpListener();

            //specifies that we can only receive local requests from the given port
            if (externalConnections) listener.Prefixes.Add($"http://+:{port}/");
            else listener.Prefixes.Add($"http://localhost:{port}/");

            listener.Start(); //Start the listener
            listener.BeginGetContext(PreHandle, null); //Forwards any requests to the PreHandler

            Console.WriteLine($"API Running on port {port}");
        }
    }
}