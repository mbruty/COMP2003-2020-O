using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace api.Backend.Data.Redis
{
    //T is the data Type, like
    public class CacheTable : SQL.AutoSQL.Table
    {
        #region Methods

        private T[] CacheObject<T>(T[] UncachedObject) where T : SQL.Object, new()
        {
            string CacheableObject = JsonConvert.SerializeObject(UncachedObject);
            Redis.Instance.SetStringWithExpiration(GetKey<T>(UncachedObject[0]), CacheableObject);
            return UncachedObject;
        }

        private string GetKey<T>(T Object) where T : SQL.Object, new()
        {
            Type t = Object.GetType();
            return $"{Name}-{t.GetField(PrimaryKeys[0].Field).GetValue(Object).ToString()}";
        }

        private string GetKey<T>(object[] PrimaryKeyValues) where T : SQL.Object, new()
        {
            return $"{Name}-{PrimaryKeyValues[0]}";
        }

        private string GetKey<T>(object PrimaryKeyValue) where T : SQL.Object, new()
        {
            return $"{Name}-{PrimaryKeyValue}";
        }

        #endregion Methods

        #region Constructors

        public CacheTable(string Name) : base(Name)
        {
        }

        #endregion Constructors

        public override async Task<T[]> Select<T>(object[] PrimaryKeyValues, int Limit = 0)
        {
            //Logic To Find And Return A Cached Object
            string KeySearch = GetKey<T>(PrimaryKeyValues);
            if (await Redis.Instance.HasKey(KeySearch))
            {
                return new T[] { JToken.Parse(await Redis.Instance.GetString(KeySearch)).ToObject<T>() };
            }
            T[] CachedObject = CacheObject(await base.Select<T>(PrimaryKeyValues, Limit));
            return CachedObject;
        }

        //If we are caching based on Primary Key, we cannot select from cache via these

        //public override async Task<T[]> SelectCustom<T>(string where = "TRUE", int Limit = 0)
        //{
        //    return await base.Select<T>(where,Limit);
        //}

        public override async Task<T[]> Select<T>(string[] FieldNames, object[] FieldValues, int Limit = 0)
        {
            object value = null;
            for (int i = 0; i < FieldNames.Length; i++)
            {
                if (PrimaryKeys.Count(x => x.Field.ToLower() == FieldNames[i].ToLower()) > 0)
                {
                    value = FieldValues[i];
                    break;
                }
            }

            if (value != null)
            {
                //Logic To Find And Return A Cached Object
                string FieldSearch = GetKey<T>(value);
                if (await Redis.Instance.HasKey(FieldSearch))
                {
                    return JToken.Parse(await Redis.Instance.GetString(FieldSearch)).ToObject<T[]>();
                }
                T[] CachedObject = CacheObject(await base.Select<T>(FieldNames, FieldValues, Limit));
                return CachedObject;
            }
            return null;
        }

        /* Take Object and Convert to JSON format before adding to the Redis Database */
    }
}
