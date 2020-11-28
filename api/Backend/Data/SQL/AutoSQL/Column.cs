using System;

namespace api.Backend.Data.SQL.AutoSQL
{
    public enum Key
    {
        PRI, //Primary Key
        MUL, //Fuck knows
        UNI, //Unique Key
        NULL
    }

    //Represents a Column in a Table
    public class Column
    {
        #region Fields

        public string Field, Type, Default, Extra;
        public Key Key = Key.NULL;
        public bool Null;

        #endregion Fields

        #region Constructors

        /// <summary>
        /// Create a column using data selected from SHOW COLUMNS FROM
        /// </summary>
        /// <param name="rData"> result from SHOW COLUMNS FROM </param>
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

        #region Properties

        public bool IsAutoIncrement
        {
            get { return Extra.Contains("auto_increment"); }
        }

        #endregion Properties

        #region Methods

        /// <summary>
        /// Check if the provided object, is compatible with the datatype of this column
        /// </summary>
        /// <param name="obj"> </param>
        /// <returns> If it is compatible </returns>
        public bool FieldMatchesType(object obj)
        {
            Type t = obj.GetType();
            return t.Name.ToLower().Contains(Type.ToLower()) || (Type.ToLower().Contains("int") && t.Name.ToLower().Contains("int")) || Type.ToLower().Contains(t.Name.ToLower()) || (t.Name == "String" && Type.StartsWith("varchar"));
        }

        public override string ToString()
        {
            return this.Field;
        }

        #endregion Methods
    }
}
