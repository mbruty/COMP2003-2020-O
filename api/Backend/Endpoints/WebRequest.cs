﻿using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Net;
using System.Reflection;

namespace api.Backend.Endpoints
{
    public static class WebRequest
    {
        #region Methods

        private static void Handle(HttpListenerRequest request, string Data, ref HttpResponse response)
        {
            string url = request.RawUrl.ToLower(), method = request.HttpMethod.ToLower();

            //Find and then run the appriproate web event
            MethodInfo[] tMethod = Events.WebEvent.FindMethodInfos(url, method, false);

            if (tMethod.Length > 0)
            {
                try { tMethod[0].Invoke(null, new object[] { request.Headers, Data, response }); }
                catch (Exception e) { 
                    response.StatusCode = 505;
                    response.AddToData("error", "A Server Error has Occured!");
                    Console.WriteLine(e);
                }
            }
            else
            {
                //Provide an error if no event is found
                response.StatusCode = 404;
                response.AddToData("error", "Page not found");
            }
        }

        public static void PreHandle(HttpListenerContext listenerContext)
        {
            //Read any request data (from the body)
            StreamReader stream = new StreamReader(listenerContext.Request.InputStream);
            string streamString = stream.ReadToEnd();

            HttpResponse response = new HttpResponse();

            //Pass the request on
            Handle(listenerContext.Request, streamString, ref response);

            //Send the request
            response.Send(listenerContext.Response);
        }

        #endregion Methods

        #region Classes

        public class HttpResponse //Stores any and all data being returned to the requestor
        {
            #region Fields

            private CookieCollection cookies = new CookieCollection();
            public JObject Data = JObject.Parse("{'Time':" + DateTime.Now.Ticks + "}"); //Time always provided
            public int StatusCode = 500;

            #endregion Fields

            #region Methods

            //https://httpstatuses.com/
            public void AddCookie(string name, string value)
            {
                cookies.Add(new Cookie(name, value));
            }

            public void AddObjectToData(string Header, object obj)
            {
                Data.Property("Time").AddAfterSelf(new JProperty(Header, JToken.FromObject(obj).ToString()));
            }

            public void AddToData(string Header, object stringable)
            {
                Data.Property("Time").AddAfterSelf(new JProperty(Header, stringable.ToString()));
            }

            public virtual void Send(HttpListenerResponse response)
            {
                response.StatusCode = StatusCode;

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