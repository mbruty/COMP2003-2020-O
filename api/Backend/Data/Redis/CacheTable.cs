using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;


namespace api.Backend.Data.SQL.Caching
{
    //T is the data Type, like 
    public class CacheTable : AutoSQL.Table
    {
        //List<Obj.Object> Cache -- Need to store cached objects

        public CacheTable(string Name) : base (Name)
        {
            //Cache = new List<Obj.Object>();
        }

        public override async Task<T[]> Select<T>(object[] PrimaryKeyValues, int Limit = 0)
        {
            //Logic To Find And Return A Cached Object
            string KeySearch = PrimaryKeyValues.ToString();
            if (await Redis.Instance.HasKey(KeySearch))
            {
                return JToken.Parse(await Redis.Instance.GetString(KeySearch)).ToObject<T[]>();
            }
            T[] CachedObject = CacheObject(await base.Select<T>(PrimaryKeyValues, Limit));
            return CachedObject;
        }

        public override async Task<T[]> SelectCustom<T>(string where = "TRUE", int Limit = 0)
        {
            return await base.Select<T>(where,Limit);
        }

        public override async Task<T[]> Select<T>(string[] FieldNames, object[] FieldValues, int Limit = 0)
        {
            //Logic To Find And Return A Cached Object
            string FieldSearch = FieldNames.ToString();
            if (await Redis.Instance.HasKey(FieldSearch))
            {
                return JToken.Parse(await Redis.Instance.GetString(FieldSearch)).ToObject<T[]>();
            }
            T[] CachedObject = CacheObject(await base.Select<T>(FieldNames, FieldValues, Limit));
            return CachedObject;
        }

        /* Take Object and Convert to JSON format before adding to the Redis Database */
        private T[] CacheObject<T>(T[] UncachedObject) where T : Object, new()
        {
            string CacheableObject = JsonConvert.SerializeObject(UncachedObject);
            Redis.Instance.SetStringWithExpiration( /* PRIMARY KEY */ , CacheableObject);
            return UncachedObject;
        }
    }
}
