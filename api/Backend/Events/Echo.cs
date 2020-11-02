using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.WebSockets;
using api.Backend.Endpoints;
using System.Collections.Specialized;

namespace api.Backend.Events
{
    public static class Echo
    {
        [WebEvent("/echo", "Echo", true)]
        public static void TestWebSocket(WebSocket webSocket, WebSockets.SocketRequest @event, WebSockets.SocketResponse response)
        {
            response.AddToData("Text", @event.Data);
        }

        [WebEvent("/echo", "POST", false)]
        public static void TestWebRequest(NameValueCollection headers, string Data, ref WebRequest.HttpResponse response)
        {
            response.AddToData("Text", Data);
        }
    }
}
