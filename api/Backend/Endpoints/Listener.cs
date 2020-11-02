using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.WebSockets;
using System.Threading.Tasks;

namespace api.Backend.Endpoints
{
    public static class WebListener
    {
        public static HttpListener listener;

        public static void Start(int port = 3000)
        {
            listener = new HttpListener();
            listener.Prefixes.Add($"http://localhost:{port}/");

            listener.Start();
            listener.BeginGetContext(PreHandle, null);
        }

        private static async void PreHandle(IAsyncResult result)
        {
            HttpListenerContext listenerContext = listener.EndGetContext(result);
            listener.BeginGetContext(PreHandle, null);

            if (listenerContext.Request.IsWebSocketRequest) await WebSockets.PreHandle(listenerContext);
            else WebRequest.PreHandle(listenerContext);
        }
    }
}
