using System;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Net;
using System.IO;
using System.Threading.Tasks;
using System.Reflection;

namespace api.Backend.Endpoints
{
    public static class WebRequest
    {
        public class HttpResponse
        {
            public JObject Data = JObject.Parse("{'Time':" + DateTime.Now.Ticks + "}");
            public int StatusCode = 500;
            private CookieCollection cookies = new CookieCollection();

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

                response.Headers.Add("Access-Control-Allow-Origin", "*");

                response.ContentType = "application/json";
                response.Cookies = cookies;

                StreamWriter stream = new StreamWriter(response.OutputStream);
                if (Data != null) stream.Write(JToken.FromObject(Data).ToString());

                stream.Flush();
                stream.Close();
            }
        }

        public static void PreHandle(HttpListenerContext listenerContext)
        {
            StreamReader stream = new StreamReader(listenerContext.Request.InputStream);
            string streamString = stream.ReadToEnd();

            HttpResponse response = new HttpResponse();

            Handle(listenerContext.Request, streamString, ref response);

            response.Send(listenerContext.Response);
        }

        private static void Handle(HttpListenerRequest request, string Data, ref HttpResponse response)
        {
            string url = request.RawUrl.ToLower(), method = request.HttpMethod.ToLower();

            MethodInfo[] tMethod = Events.WebEvent.FindMethodInfos(url, method, false);

            if (tMethod.Length > 0) tMethod[0].Invoke(null, new object[] { request.Headers, Data, response });
            else
            {
                response.StatusCode = 404;
                response.AddToData("error", "Page not found");
            }
        }
    }
}
