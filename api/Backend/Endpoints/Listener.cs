using System;
using System.Net;

namespace api.Backend.Endpoints
{
    public static class WebListener
    {
        #region Methods

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

        public static void Start(int port = 3000)
        {
            listener = new HttpListener();

            //specifies that we can only receive local requests from the given port
            listener.Prefixes.Add($"http://localhost:{port}/");

            listener.Start(); //Start the listener
            listener.BeginGetContext(PreHandle, null); //Forwards any requests to the PreHandler
        }
    }
}