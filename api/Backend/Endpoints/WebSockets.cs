using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Net.WebSockets;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace api.Backend.Endpoints
{
    public static class WebSockets
    {
        public class SocketRequest //Holds the request from the requestor
        {
            public string Method;
            public string Data;
        }

        public class SocketResponse
        {
            public JObject Data = JObject.Parse("{'Time':" + DateTime.Now.Ticks + "}");//Time always provided

            public void AddObjectToData(string Header, object obj)
            {
                Data.Property("Time").AddAfterSelf(new JProperty(Header, JToken.FromObject(obj).ToString()));
            }

            public void AddToData(string Header, object stringable)
            {
                Data.Property("Time").AddAfterSelf(new JProperty(Header, stringable.ToString()));
            }

            public async Task Send(WebSocket webSocket)
            {
                //Convert the response into its UTF bytes and send it
                byte[] bData = Encoding.UTF8.GetBytes(Data.ToString());
                await webSocket.SendAsync(new ArraySegment<byte>(bData, 0, bData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }

        private static async Task ForwardSocRequest(string url, string Data, WebSocket webSocket)
        {
            SocketResponse response = new SocketResponse();
            try
            {
                //Attempt to convert the Body into a Request
                JToken jData = JObject.Parse(Data);
                SocketRequest @event = jData.ToObject<SocketRequest>();

                //Find and then run the appriproate web event
                MethodInfo[] tMethod = Events.WebEvent.FindMethodInfos(url, @event.Method, true);

                if (tMethod.Length > 0)
                {
                    tMethod[0].Invoke(null, new object[] { webSocket, @event, response });
                    await response.Send(webSocket);
                }
                else
                {
                    //Provide an error if no event is found
                    await webSocket.CloseAsync(WebSocketCloseStatus.EndpointUnavailable, "Request does not correspond to a known event", CancellationToken.None);
                }
            }
            //Report any errors
            catch (Exception e)
            {
                Console.WriteLine("Exception: {0}", e);
                await webSocket.CloseAsync(WebSocketCloseStatus.InvalidPayloadData, "Request body is faulty", CancellationToken.None);
            }
        }

        public static async Task PreHandle(HttpListenerContext listenerContext)
        {
            //Attempt to establish the WebSocket
            WebSocketContext webSocketContext = null;
            try
            {
                webSocketContext = await listenerContext.AcceptWebSocketAsync(subProtocol: null);
            }
            catch (Exception e)
            {
                //Send an error on failure
                listenerContext.Response.StatusCode = 500;
                listenerContext.Response.Close();
                Console.WriteLine("Exception: {0}", e);
                return;
            }

            WebSocket webSocket = webSocketContext.WebSocket;

            try
            {
                //Temp store for incoming request
                byte[] receiveBuffer = new byte[1024];

                while (webSocket.State == WebSocketState.Open)
                {
                    //Receive and store the request body
                    WebSocketReceiveResult receiveResult = await webSocket.ReceiveAsync(new ArraySegment<byte>(receiveBuffer), CancellationToken.None);

                    if (receiveResult.MessageType == WebSocketMessageType.Close)
                    {
                        //Handle close request
                        await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
                    }
                    else if (receiveResult.MessageType == WebSocketMessageType.Binary)
                    {
                        //Throw error if body isnt text
                        await webSocket.CloseAsync(WebSocketCloseStatus.InvalidMessageType, "Cannot accept binary frame", CancellationToken.None);
                    }
                    else
                    {
                        //Convert the buffer into text
                        string stringBuffer = System.Text.Encoding.UTF8.GetString(receiveBuffer, 0, receiveResult.Count);

                        await ForwardSocRequest(listenerContext.Request.RawUrl.ToLower(), stringBuffer, webSocket);
                    }
                }
            }
            //Catch any errors
            catch (Exception e) { Console.WriteLine("Exception: {0}", e); }
            finally
            {
                if (webSocket != null) webSocket.Dispose();
            }
        }
    }
}