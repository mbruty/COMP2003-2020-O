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
        #region Methods

        private static async Task ForwardSocRequest(string url, string Data, WebSocket webSocket, SocketInstance instance)
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
                    tMethod[0].Invoke(null, new object[] { webSocket, instance, @event, response });
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

        private static async Task WebSocketInstance(WebSocket webSocket, HttpListenerContext listenerContext)
        {
            try
            {
                //Temp store for incoming request
                byte[] receiveBuffer = new byte[1024];
                SocketInstance instance = new SocketInstance();

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
                        string stringBuffer = Encoding.UTF8.GetString(receiveBuffer, 0, receiveResult.Count);

                        await ForwardSocRequest(listenerContext.Request.RawUrl.ToLower(), stringBuffer, webSocket, instance);
                    }
                }
            }
            //Catch any errors
            catch (Exception e)
            {
                Console.WriteLine("Exception: {0}", e);
            }
            finally
            {
                if (webSocket != null) webSocket.Dispose();
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

            //Begin handling a specific websocket instance
            await WebSocketInstance(webSocketContext.WebSocket, listenerContext);
        }

        #endregion Methods

        #region Classes

        public class SocketInstance //Stores data between websocket requests
        {
            #region Fields

            public object Something;

            #endregion Fields

            //Will be used to store specific logins and any instance data
        }

        public class SocketRequest //Holds the request from the requestor
        {
            #region Fields

            public string Data;
            public string Method;

            #endregion Fields
        }

        public class SocketResponse
        {
            #region Fields

            public JObject Data = JObject.Parse("{'Time':" + DateTime.Now.Ticks + "}");

            #endregion Fields

            //Time always provided

            #region Methods

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

            #endregion Methods
        }

        #endregion Classes
    }
}