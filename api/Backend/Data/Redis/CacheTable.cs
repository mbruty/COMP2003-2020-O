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

        private void CacheObject<T>(T UncachedObject) where T : Obj.Object, new()
        {
            string CacheableObject = JsonConvert.SerializeObject(UncachedObject);
            Redis.Instance.SetStringWithExpiration(GetKey<T>(UncachedObject).ToString(), JToken.FromObject(CacheableObject).ToString());
        }

        #endregion Methods

        //private string GetKey<T>(T Object) where T : SQL.Object, new()
        //{
        //    Type t = Object.GetType();
        //    return $"{Name}-{t.GetField(PrimaryKeys[0].Field).GetValue(Object).ToString()}";
        //}

        #region Constructors

        public CacheTable(string Name) : base(Name)
        {
        }

        #endregion Constructors

        public object GetKey<T>(T sqlObj) where T : Obj.Object, new()
        {
            Type t = new T().GetType();
            if (PrimaryKeys.Length == 1)
                return $"{Name}-{t.GetField(PrimaryKeys[0].Field).GetValue(sqlObj)}";
            else if (PrimaryKeys.Length>1)
                return $"{Name}-{String.Join(",",PrimaryKeys.Select(x=> t.GetField(x.Field).GetValue(sqlObj))) }";
            else
                throw new Exception("Must Have Primary Key");
        }

        public string GetKey(object[] PrimaryKeyValues)
        {
            return $"{Name}-{String.Join(",", PrimaryKeyValues)}";
        }

        public string GetKey(object PrimaryKeyValue)
        {
            return $"{Name}-{PrimaryKeyValue}";
        }

        public override async Task<T[]> Select<T>(object[] PrimaryKeyValues, int Limit = 0)
        {
            //Logic To Find And Return A Cached Object
            string KeySearch = GetKey(PrimaryKeyValues);
            if (await Redis.Instance.HasKey(KeySearch))
            {
                return new T[] { JToken.Parse(await Redis.Instance.GetString(KeySearch)).ToObject<T>() };
            }
            T[] Data = await base.Select<T>(PrimaryKeyValues, Limit);
            if (Data.Length > 0) CacheObject<T>(Data[0]);
            return Data;
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
                //else break;
            }

            if (value != null)
            {
                //Logic To Find And Return A Cached Object
                string FieldSearch = GetKey(value);
                var data = await Redis.Instance.GetString(FieldSearch);
                if (data != null)
                {
                    return new T[] { JToken.Parse(data).ToObject<T>() };
                }
                T[] Data = await base.Select<T>(FieldNames, FieldValues, Limit);
                if (Data.Length > 0) CacheObject<T>(Data[0]);
                return Data;
            }
            return await base.Select<T>(FieldNames, FieldValues, Limit);
        }

        /* Take Object and Convert to JSON format before adding to the Redis Database */
    }
}
