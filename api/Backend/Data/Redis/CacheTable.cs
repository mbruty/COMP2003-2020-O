using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

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
            return await base.Select<T>(PrimaryKeyValues,Limit);
        }

        public override async Task<T[]> SelectCustom<T>(string where = "TRUE", int Limit = 0)
        {
            //Logic To Find And Return A Cached Object
            return await base.Select<T>(where,Limit);
        }

        public override async Task<T[]> Select<T>(string[] FieldNames, object[] FieldValues, int Limit = 0)
        {
            //Logic To Find And Return A Cached Object
            return await base.Select<T>(FieldNames, FieldValues,Limit);
        }
    }
}
