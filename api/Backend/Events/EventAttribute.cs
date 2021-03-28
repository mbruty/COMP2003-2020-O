﻿using api.Backend.Security;
using System;
using System.Linq;
using System.Reflection;
using Newtonsoft.Json;
using System.Collections.Specialized;

namespace api.Backend.Events
{
    /// <summary>
    /// Tags an event with what path and Method triggers it
    /// </summary>
    [System.AttributeUsage(System.AttributeTargets.Method)]
    public class WebEvent : System.Attribute
    {
        #region Fields

        //Find all WebEvents
        private static MethodInfo[] methodInfos = AppDomain.CurrentDomain.GetAssemblies()
            .SelectMany(x => x.GetTypes())
            .SelectMany(x => x.GetMethods())
            .Where(x => x.GetCustomAttributes(typeof(Events.WebEvent), false).FirstOrDefault() != null).ToArray();

        public SecurityGroup secuirtyLevel = SecurityGroup.None;
        public string urlPath, method;
        public bool WebSocket = false;
        public Type dataType;

        #endregion Fields

        #region Constructors

        public WebEvent(Type t, string urlPath, bool WebSocket = true, SecurityGroup RequiredAuth = SecurityGroup.None)
        {
            dataType = t;
            this.urlPath = urlPath.ToLower();
            this.WebSocket = WebSocket;
            this.secuirtyLevel = RequiredAuth;
        }

        public WebEvent(Type t, string urlPath, string Method, bool WebSocket = false, SecurityGroup RequiredAuth = SecurityGroup.None)
        {
            dataType = t;
            this.urlPath = urlPath.ToLower();
            this.method = Method.ToLower();
            this.WebSocket = WebSocket;
            this.secuirtyLevel = RequiredAuth;
        }

        #endregion Constructors

        #region Methods

        /// <summary>
        /// Finds a request that matches the paramaters
        /// </summary>
        /// <param name="url">       </param>
        /// <param name="method">    </param>
        /// <param name="WebSocket"> </param>
        /// <returns> </returns>
        public static MethodInfo[] FindMethodInfos(string url, string method, bool WebSocket)
        {
            //Return matching WebEvents
            return methodInfos.Where(x => x.GetCustomAttribute<Events.WebEvent>().Equals(url, method, WebSocket)).ToArray();
        }

        public static MethodInfo[] FindMethodInfos(string path, bool WebSocket)
        {
            //Return matching WebEvents
            return methodInfos.Where(x => x.GetCustomAttribute<Events.WebEvent>().Equals(path, WebSocket)).ToArray();
        }

        /// <summary>
        /// Easily check equivalence
        /// </summary>
        /// <param name="urlPath">   </param>
        /// <param name="Method">    </param>
        /// <param name="WebSocket"> </param>
        /// <returns> </returns>
        public bool Equals(string urlPath, string Method, bool WebSocket = false) //Easily check if states match
        {
            return urlPath.ToLower() == this.urlPath && Method.ToLower() == this.method && WebSocket == this.WebSocket;
        }

        /// <summary>
        /// Easily check equivalence
        /// </summary>
        /// <param name="urlPath">   </param>
        /// <param name="Method">    </param>
        /// <param name="WebSocket"> </param>
        /// <returns> </returns>
        public bool Equals(string urlPath, bool WebSocket = false) //Easily check if states match
        {
            return urlPath.ToLower() == this.urlPath && WebSocket == this.WebSocket;
        }

        public object ConvertHeadersOrBodyToType(Type t,NameValueCollection headers, string data)
        {
            if (t == typeof(string)) return data;
            if (t == typeof(NameValueCollection)) return headers;
            if (data != null) return JsonConvert.DeserializeObject(data, t);
            else return null;
#warning convert headers to obj
        }

        #endregion Methods
    }
}
