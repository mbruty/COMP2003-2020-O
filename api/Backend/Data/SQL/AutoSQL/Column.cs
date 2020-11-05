using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Backend.Data.SQL.AutoSQL
{
    public class Column
    {
        public string Field, Type, Default, Extra;
        public bool Null;
        public Key Key = Key.NULL;

        public Column(object[] rData)
        {
            Field = (string)rData[0];
            Type = (string)rData[1];
            Null = (string)rData[2] == "YES";
            Key = (string)rData[3] != "" ? (Key)Key.Parse(typeof(Key), (string)rData[3]) : Key.NULL;
            Default = rData[4].GetType() != typeof(System.DBNull) ? (string)rData[4] : null;
            Extra = (string)rData[5];
        }

        public bool FieldMatchesType(object obj)
        {
            Type t = obj.GetType();
            return t.Name.ToLower().StartsWith(Type) || (t.Name=="String" && Type.StartsWith("varchar"));
        }

        public override string ToString()
        {
            return this.Field;
        }
    }

    public enum Key
    {
        PRI, MUL, NULL
    }
}
