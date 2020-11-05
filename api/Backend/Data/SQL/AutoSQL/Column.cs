using System;

namespace api.Backend.Data.SQL.AutoSQL
{
    public enum Key
    {
        PRI, MUL, NULL
    }

    public class Column
    {
        #region Fields

        public string Field, Type, Default, Extra;
        public Key Key = Key.NULL;
        public bool Null;

        #endregion Fields

        #region Constructors

        public Column(object[] rData)
        {
            Field = (string)rData[0];
            Type = (string)rData[1];
            Null = (string)rData[2] == "YES";
            Key = (string)rData[3] != "" ? (Key)Key.Parse(typeof(Key), (string)rData[3]) : Key.NULL;
            Default = rData[4].GetType() != typeof(System.DBNull) ? (string)rData[4] : null;
            Extra = (string)rData[5];
        }

        #endregion Constructors

        #region Methods

        public bool FieldMatchesType(object obj)
        {
            Type t = obj.GetType();
            return t.Name.ToLower().StartsWith(Type) || (t.Name == "String" && Type.StartsWith("varchar"));
        }

        public override string ToString()
        {
            return this.Field;
        }

        #endregion Methods
    }
}