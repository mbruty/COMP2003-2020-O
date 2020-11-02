using api.Backend.Endpoints;
using System.Collections.Specialized;
using System.Net.WebSockets;

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