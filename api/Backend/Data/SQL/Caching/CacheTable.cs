using System;
using System.Collections.Generic;
using System.Text;

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

        public override T[] Select<T>(object[] PrimaryKeyValues)
        {
            //Logic To Find And Return A Cached Object
            return base.Select<T>(PrimaryKeyValues);
        }

        public override T[] Select<T>(string where = "TRUE")
        {
            //Logic To Find And Return A Cached Object
            return base.Select<T>(where);
        }

        public override T[] Select<T>(string[] FieldNames, object[] FieldValues)
        {
            //Logic To Find And Return A Cached Object
            return base.Select<T>(FieldNames, FieldValues);
        }
    }
}
