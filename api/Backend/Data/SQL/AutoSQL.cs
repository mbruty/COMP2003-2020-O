using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Backend.Data.SQL
{
    public class TableColumn
    {
        public string Field, Type, Default, Extra;
        public bool Null;
        public Key Key = Key.NULL;

        public TableColumn(object[] rData)
        {
            Field = (string)rData[0];
            Type = (string)rData[1];
            Null = (string)rData[2] == "YES";
            Key = (string)rData[3] != "" ? (Key)Key.Parse(typeof (Key), (string)rData[3]) : Key.NULL;
            Default = rData[4].GetType() != typeof(System.DBNull) ? (string)rData[4] : null;
            Extra = (string)rData[5];
        }
    }

    public enum Key
    {
        PRI, MUL, NULL
    }

    public static class AutoSQL
    {
        private static string[] tables;

        public static TableColumn[][] tableColumns;

        public static void Start()
        {
            tables = SQLInstance.Read("SHOW tables").Select(x => (string)x[0]).ToArray();
            tableColumns = tables.ToList().Select(x => SQLInstance.Read($"SHOW columns FROM {x}").Select(y => new TableColumn(y)).ToArray()).ToArray();
        }
    }
}
