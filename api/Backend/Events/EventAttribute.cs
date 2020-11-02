using System;
using System.Linq;
using System.Reflection;

namespace api.Backend.Events
{
    [System.AttributeUsage(System.AttributeTargets.Method)]
    public class WebEvent : System.Attribute
    {
        //Find all WebEvents
        private static MethodInfo[] methodInfos = AppDomain.CurrentDomain.GetAssemblies()
            .SelectMany(x => x.GetTypes())
            .SelectMany(x => x.GetMethods())
            .Where(x => x.GetCustomAttributes(typeof(Events.WebEvent), false).FirstOrDefault() != null).ToArray();

        #region Fields

        public string urlPath, method;
        public bool WebSocket = false;

        #endregion Fields

        #region Constructors

        public WebEvent(string urlPath, string Method)
        {
            this.urlPath = urlPath.ToLower();
            this.method = Method.ToLower();
        }

        public WebEvent(string urlPath, string Method, bool WebSocket = false)
        {
            this.urlPath = urlPath.ToLower();
            this.method = Method.ToLower();
            this.WebSocket = WebSocket;
        }

        #endregion Constructors

        #region Methods

        public static MethodInfo[] FindMethodInfos(string url, string method, bool WebSocket)
        {
            //Return matching WebEvents
            return methodInfos.Where(x => x.GetCustomAttribute<Events.WebEvent>().Equals(url, method, WebSocket)).ToArray();
        }

        public bool Equals(string urlPath, string Method, bool WebSocket = false) //Easily check if states match
        {
            return urlPath.ToLower() == this.urlPath && Method.ToLower() == this.method && WebSocket == this.WebSocket;
        }

        #endregion Methods
    }
}