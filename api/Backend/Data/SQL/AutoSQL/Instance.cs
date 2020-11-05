using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Backend.Data.SQL.AutoSQL
{
    public static class Instance
    {
        public static Table[] tables;

        public static void Start()
        {
            tables = SQL.Instance.Read("SHOW tables").Select(x => new Table((string)x[0])).ToArray();
        }

        //public static T[] Select<T>(string Table, object[] PrimaryKeys)
        //{

        //}
    }
}
