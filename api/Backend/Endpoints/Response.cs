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
    public class Response
    {
        public JObject Data = JObject.Parse("{'Time':" + DateTime.Now.Ticks + "}");
        public int StatusCode = 500;


        //Time always provided



        /// <summary>
        /// Add a given object into the json response
        /// </summary>
        /// <param name="Header"> </param>
        /// <param name="obj">    </param>
        public void AddObjectToData(string Header, Data.Obj.Object[] obj)
        {
            foreach (Data.Obj.Object o in obj) { o.Purge(); }
            if (Data.Property(Header) == null) Data.Property("Time").AddAfterSelf(new JProperty(Header, JArray.FromObject(obj)));
            else Data.Property(Header).Value = JArray.FromObject(obj);
        }

        /// <summary>
        /// Add a given object into the json response
        /// </summary>
        /// <param name="Header"> </param>
        /// <param name="obj">    </param>
        public void AddObjectToData(string Header, Data.Obj.Object obj)
        {
            obj = obj.Purge();
            if (Data.Property(Header) == null) Data.Property("Time").AddAfterSelf(new JProperty(Header, JToken.FromObject(obj)));
            else Data.Property(Header).Value = JToken.FromObject(obj);
        }

        /// <summary>
        /// Add a already stingable object, ie supports .ToString()
        /// </summary>
        /// <param name="Header">     </param>
        /// <param name="stringable"> .ToString() supporting object </param>
        public void AddToData(string Header, object stringable)
        {
            if (Data.Property(Header) == null) Data.Property("Time").AddAfterSelf(new JProperty(Header, stringable.ToString()));
            else Data.Property(Header).Value = stringable.ToString();
        }

        /// <summary>
        /// Finish up the response and send it back to the user
        /// </summary>
        /// <param name="webSocket"> </param>
        /// <returns> </returns>
        public virtual async Task Send(WebSocket webSocket)
        {
            return;
        }

        /// <summary>
        /// Finish up the response and send it back to the user
        /// </summary>
        /// <param name="response"> </param>
        public virtual async void Send(HttpListenerResponse response)
        {
            return;
        }
    }
}
