﻿using Newtonsoft.Json.Linq;
using System;
using System.Linq;
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

        /// <summary>
        /// Finds the appropriate event for the request and passes it along
        /// </summary>
        /// <param name="url">       </param>
        /// <param name="Data">      </param>
        /// <param name="webSocket"> </param>
        /// <param name="instance">  </param>
        /// <returns> </returns>
        private static async Task ForwardSocRequest(string url, string Data, WebSocket webSocket, SocketInstance instance)
        {
            SocketResponse response = new SocketResponse();
            try
            {
                //Attempt to convert the Body into a Request
                JToken jData = JObject.Parse(Data);
                SocketRequest @event = jData.ToObject<SocketRequest>();

                if (@event.Path == null)
                {
                    await webSocket.CloseAsync(WebSocketCloseStatus.EndpointUnavailable, "Request does not correspond to a known event", CancellationToken.None);
                    return;
                }

                //Find and then run the appriproate web event
                MethodInfo[] tMethod = Events.WebEvent.FindMethodInfos(@event.Path, true);

                if (tMethod.Length > 0)
                {
                    try
                    {
                        Security.SecurityPerm perm = await Security.Sessions.GetSecurityGroup(jData, response);
                        Events.WebEvent event_attribute = tMethod[0].GetCustomAttributes<Events.WebEvent>().First();

                        if (Security.Sessions.IsAuthorized(perm.SecurityGroup, event_attribute.secuirtyLevel))
                        {
                            tMethod[0].Invoke(null, new object[] { instance, @event, response, perm });
                        }
                        await response.Send(webSocket);
                    }
                    catch (Exception e)
                    {
                        await webSocket.CloseAsync(WebSocketCloseStatus.InternalServerError, "A Server Errror has Occured!", CancellationToken.None);
                        Console.WriteLine(e);
                    }
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

        /// <summary>
        /// While the websocket is open, we wait, and on any data we forward the request onwards
        /// </summary>
        /// <param name="webSocket">       </param>
        /// <param name="listenerContext"> </param>
        /// <returns> </returns>
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

        /// <summary>
        /// Attempts to start a WebSocket connection before passing the request along
        /// </summary>
        /// <param name="listenerContext"> </param>
        /// <returns> </returns>
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

        /// <summary>
        /// Stores data between websocket requests
        /// </summary>
        public class SocketInstance
        {
            #region Fields

            public object Something;

            #endregion Fields

            //Will be used to store specific logins and any instance data
        }

        /// <summary>
        /// Holds the request from the requestor
        /// </summary>
        public class SocketRequest
        {
            #region Fields

            public JToken Data;
            public string Path;

            #endregion Fields
        }

        /// <summary>
        /// Holds any data to be returned
        /// </summary>
        public class SocketResponse : Response
        {
            #region Methods

            /// <summary>
            /// Finish up the response and send it back to the user
            /// </summary>
            /// <param name="webSocket"> </param>
            /// <returns> </returns>
            public override async Task Send(WebSocket webSocket)
            {
                AddToData("StatusCode", StatusCode);

                //Convert the response into its UTF bytes and send it
                byte[] bData = Encoding.UTF8.GetBytes(Data.ToString());
                await webSocket.SendAsync(new ArraySegment<byte>(bData, 0, bData.Length), WebSocketMessageType.Text, true, CancellationToken.None);
            }

            #endregion Methods
        }

        #endregion Classes
    }
}
