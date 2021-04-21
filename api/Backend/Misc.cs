using Newtonsoft.Json;
using System;
using System.Collections.Specialized;
using System.Linq;
using System.Reflection;

namespace api.Backend
{
    public static class Misc
    {
        #region Methods

        public static object ConvertHeadersOrBodyToType(Type dataType, NameValueCollection headers, string data)
        {
            if (dataType == typeof(string)) return data;
            if (dataType == typeof(NameValueCollection)) return headers;
            if (data.Length > 0) return JsonConvert.DeserializeObject(data, dataType);
            else
            {
                object o = Activator.CreateInstance(dataType);
                o = UpdateContents(o, dataType, headers);
                return o;
            }
        }

        public static Object UpdateContents(Object o, Type t, NameValueCollection headers)
        {
            foreach (PropertyInfo field in t.GetProperties())
            {
                if (headers.AllKeys.Select(x => x.ToLower()).Contains(field.Name.ToLower()))
                {
                    field.SetValue(o, Convert.ChangeType(headers[field.Name], field.PropertyType));
                }
            }
            return o;
        }

        #endregion Methods
    }
}
