using api.Backend.Endpoints;
using System.Collections.Specialized;
using System.Net.WebSockets;

namespace api.Backend.Events
{
    public static class Echo
    {
        #region Methods

        [WebEvent("/echo", "POST", false)]
        public static void TestWebRequest(NameValueCollection headers, string Data, ref WebRequest.HttpResponse response)
        {
            response.AddToData("Text", Data);
            response.StatusCode = 200;
        }

        [WebEvent("/echo", "Echo", true)]
        public static void TestWebSocket(WebSocket webSocket, WebSockets.SocketInstance instance, WebSockets.SocketRequest @event, WebSockets.SocketResponse response)
        {
            instance.Something = instance.Something == null ? @event.Data : instance.Something.ToString() + @event.Data;
            response.AddToData("Text", instance.Something.ToString());
        }

        #endregion Methods
    }
}
