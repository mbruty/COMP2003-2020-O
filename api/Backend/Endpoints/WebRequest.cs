using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Net;
using System.Reflection;
using System.Linq;

namespace api.Backend.Endpoints
{
    public static class WebRequest
    {
        #region Methods

        /// <summary>
        /// Finds the appropriate event for the request and passes it along
        /// </summary>
        /// <param name="request">  </param>
        /// <param name="Data">     </param>
        /// <param name="response"> </param>
        private static async void Handle(HttpListenerRequest request, string Data, HttpResponse response)
        {
            string url = request.RawUrl.ToLower(), method = request.HttpMethod.ToLower();

            //Find and then run the appriproate web event
            MethodInfo[] tMethod = Events.WebEvent.FindMethodInfos(url, method, false);

            if (tMethod.Length > 0)
            {
                if (tMethod[0].GetCustomAttributes<Events.WebEvent>().First().secuirtyLevel <= await Security.Sessions.GetSecurityGroup(request.Headers, response))
                {
                    try { tMethod[0].Invoke(null, new object[] { request.Headers, Data, response }); }
                    catch (Exception e)
                    {
                        response.StatusCode = 505;
                        response.AddToData("error", "A Server Error has Occured!");
                        Console.WriteLine(e);
                    }
                }
                else
                {
                    response.StatusCode = 401;
                    response.AddToData("error", "Insignificant permissions");
                }
            }
            else
            {
                //Provide an error if no event is found
                response.StatusCode = 404;
                response.AddToData("error", "Page not found");
            }
        }

        /// <summary>
        /// Extracts any Data before passing the request onwards
        /// </summary>
        /// <param name="listenerContext"> </param>
        public static void PreHandle(HttpListenerContext listenerContext)
        {
            //Read any request data (from the body)
            StreamReader stream = new StreamReader(listenerContext.Request.InputStream);
            string streamString = stream.ReadToEnd();

            HttpResponse response = new HttpResponse();

            //Pass the request on
            Handle(listenerContext.Request, streamString, response);

            //Send the request
            response.Send(listenerContext.Response);
        }

        #endregion Methods

        #region Classes

        /// <summary>
        /// Holds any data to be returned
        /// </summary>
        public class HttpResponse
        {
            #region Fields

            private CookieCollection cookies = new CookieCollection();
            public JObject Data = JObject.Parse("{'Time':" + DateTime.Now.Ticks + "}"); //Time always provided
            public int StatusCode = 500;

            #endregion Fields

            #region Methods

            /// <summary>
            /// Add a cookie on to the json response
            /// </summary>
            /// <param name="name">  </param>
            /// <param name="value"> </param>
            public void AddCookie(string name, string value)
            {
                cookies.Add(new Cookie(name, value));
            }

            /// <summary>
            /// Add a given object into the json response
            /// </summary>
            /// <param name="Header"> </param>
            /// <param name="obj">    </param>
            public void AddObjectToData(string Header, object obj)
            {
                if (Data.Property(Header) == null) Data.Property("Time").AddAfterSelf(new JProperty(Header, JToken.FromObject(obj)));
                else Data.Property("Time").Value = JToken.FromObject(obj);
            }

            /// <summary>
            /// Add a already stingable object, ie supports .ToString()
            /// </summary>
            /// <param name="Header">     </param>
            /// <param name="stringable"> .ToString() supporting object </param>
            public void AddToData(string Header, object stringable)
            {
                if (Data.Property(Header) == null) Data.Property("Time").AddAfterSelf(new JProperty(Header, stringable.ToString()));
                else Data.Property("Time").Value = stringable.ToString();
            }

            /// <summary>
            /// Finish up the response and send it back to the user
            /// </summary>
            /// <param name="response"> </param>
            public virtual void Send(HttpListenerResponse response)
            {
                response.StatusCode = StatusCode;

                if (response.StatusCode == 200) Data.Property("error")?.Remove();

                response.Headers.Add("Access-Control-Allow-Origin", "*"); //Do Not Touch

                response.ContentType = "application/json"; //All requests WILL be sent in json form
                response.Cookies = cookies;

                StreamWriter stream = new StreamWriter(response.OutputStream); //Send the data
                if (Data != null) stream.Write(JToken.FromObject(Data).ToString());

                stream.Flush(); //CLose out the request
                stream.Close();
            }

            #endregion Methods
        }

        #endregion Classes
    }
}
