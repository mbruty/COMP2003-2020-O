using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Reflection;
using System.Threading.Tasks;

namespace api.Backend.Endpoints
{
    public static class WebRequest
    {
        #region Methods

        /// <summary>
        /// Finds the appropriate event for the request and passes it along
        /// </summary>
        /// <param name="request"> </param>
        /// <param name="Data">    </param>
        private static async Task<HttpResponse> Handle(HttpListenerRequest request, string Data)
        {
            HttpResponse response = new HttpResponse();

            string url = request.RawUrl.ToLower(), method = request.HttpMethod.ToLower();

            string[] path = url.Split('/');
            bool usingUrlParams = false;

            // If the url ends in a number, we're using url params
            if (int.TryParse(path[path.Length - 1], out int id))
            {
                // Replace the final bit of the url with :id: (this will be the place holder for the
                // id in the handler
                path[path.Length - 1] = ":id:";
                url = string.Join("/", path);
                // Work around as directly setting the Data = id was messing up auth
                usingUrlParams = true;
            }

            //Find and then run the appriproate web event
            MethodInfo[] tMethod = Events.WebEvent.FindMethodInfos(url, method, false);

            if (tMethod.Length > 0)
            {
                Security.SecurityPerm perm = await Security.Sessions.GetSecurityGroup(request.Headers, response, Data);
                Events.WebEvent event_attribute = tMethod[0].GetCustomAttributes<Events.WebEvent>().First();

                if (Security.Sessions.IsAuthorized(perm.SecurityGroup, event_attribute.secuirtyLevel))
                {
                    try
                    {
                        // If we are using url params, add the id to the data
                        if (usingUrlParams) Data = id.ToString();
                        object o = event_attribute.ConvertHeadersOrBodyToType(request.Headers, Data);
                        Task T = (Task)tMethod[0].Invoke(null, new object[] { o, response, perm }); T.Wait();
                    }
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

            string origin = request.Headers.Get("Origin");

            if (SpecialOrigins.Contains(origin))
            {
                response.AddCrossOriginResponse(origin);
            }

            return response;
        }

        #endregion Methods

        #region Fields

        // These are the web origins All origins will use the usual header aproach for carrying auth
        // tokens But as this isn't allowed in the browser, we are using cookies! (nom) If we end up
        // changing domain names, this is where you change it
        public static string[] SpecialOrigins = new string[] { "http://localhost:5500", "http://localhost:3000", "http://devsite.trackandtaste.com" };

        #endregion Fields

        /// <summary>
        /// Extracts any Data before passing the request onwards
        /// </summary>
        /// <param name="listenerContext"> </param>
        public static async void PreHandle(HttpListenerContext listenerContext)
        {
            //Read any request data (from the body)
            StreamReader stream = new StreamReader(listenerContext.Request.InputStream);
            string streamString = stream.ReadToEnd();

            //Pass the request on
            HttpResponse response = await Handle(listenerContext.Request, streamString);

            //Send the request
            response.Send(listenerContext.Response);
        }

        /// <summary>
        /// Holds any data to be returned
        /// </summary>
        public class HttpResponse : Response
        {
            #region Fields

            private CookieCollection cookies = new CookieCollection();
            public string crossOriginResponse = null;
            public Boolean isOptions = false;

            #endregion Fields

            #region Methods

            /// <summary>
            /// Add a cookie on to the json response
            /// </summary>
            /// <param name="name">       Cookie Name </param>
            /// <param name="value">      Cookie Value </param>
            /// <param name="expiration"> When the cookie should expire </param>
            /// <param name="isHttpOnly"> If the cookie should be HTTP only </param>
            /// <param name="path">       The path for the cookie to bind to </param>
            public void AddCookie(string name, string value, bool isHttpOnly, string path)
            {
                cookies.Add(new Cookie { Name = name, Value = value, HttpOnly = isHttpOnly, Path = path });
            }

            public void AddCrossOriginResponse(string origin)
            {
                crossOriginResponse = origin;
            }

            /// <summary>
            /// Finish up the response and send it back to the user
            /// </summary>
            /// <param name="response"> </param>
            public override async void Send(HttpListenerResponse response)
            {
                response.StatusCode = StatusCode;

                if (response.StatusCode == 200) Data.Property("error")?.Remove();

                response.Headers.Add("Access-Control-Allow-Credentials", "true");

                if(isOptions)
                {
                    response.Headers.Add("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
                }
                if (crossOriginResponse != null)
                {
                    response.Headers.Add("Access-Control-Allow-Origin", crossOriginResponse);
                }
                else
                {
                    response.Headers.Add("Access-Control-Allow-Origin", "*"); //Do Not Touch
                }
                response.ContentType = "application/json"; //All requests WILL be sent in json form
                response.Cookies = cookies;

                StreamWriter stream = new StreamWriter(response.OutputStream); //Send the data
                if (Data != null) stream.Write(JToken.FromObject(Data).ToString());

                stream.Flush(); //CLose out the request
                stream.Close();
            }

            #endregion Methods
        }
    }
}
