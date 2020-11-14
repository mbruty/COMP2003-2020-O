using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace api.Backend.Data.SQL.AutoSQL
{
    /// <summary>
    /// Represents a table in the DB
    /// </summary>
    public class Table
    {
        #region Methods

        /// <summary>
        /// Attempts to assign SELECT * data into the correct fields in to an object of T
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="Data"></param>
        /// <returns>An array of T, with the Data inserted</returns>
        private T[] SetFieldValues<T>(List<object[]> Data) where T : Object, new()
        {
            Type t = typeof(T);

            T[] Tata = new T[Data.Count];
            Tata = Tata.Select(x => new T()).ToArray();

            foreach (FieldInfo p in t.GetFields())
            {
                int index = Array.FindIndex(Columns, x => x.Field.ToString().ToLower() == p.Name.ToLower());

                for (int i = 0; i < Tata.Length && index > -1; i++)
                {
                    if (p.FieldType == typeof(bool)) p.SetValue(Tata[i], (UInt64)Data[i][index] == 1);
                    else p.SetValue(Tata[i], Data[i][index].GetType() != typeof(DBNull) ? Data[i][index] : null);
                }
            }
            return Tata;
        }

        #endregion Methods

        #region Fields

        public Column[] Columns;
        public string Name;

        #endregion Fields

        #region Constructors

        public Table(string Name)
        {
            this.Name = Name;

            List<object[]> F = SQL.Instance.DoAsync(SQL.Instance.Read($"SHOW columns FROM {Name}"));
            this.Columns = F.Select(y => new Column(y)).ToArray();
        }

        #endregion Constructors

        #region Properties

        public Column[] AutoIncrement
        {
            get { return Columns.Where(x => x.IsAutoIncrement).ToArray(); }
        }

        public Column[] Fields
        {
            get { return Columns.Where(x => x.Key != Key.PRI).ToArray(); }
        }

        public Column[] ForeignKeys
        {
            get { return Columns.Where(x => x.Key == Key.MUL).ToArray(); }
        }

        public Column[] PrimaryKeys
        {
            get { return Columns.Where(x => x.Key == Key.PRI).ToArray(); }
        }

        #endregion Properties

        /// <summary>
        /// Write your own select statement
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="where"></param>
        /// <returns>Any Selected Objects</returns>
        public T[] Select<T>(string where = "TRUE") where T : Object, new()
        {
            List<object[]> Data = SQL.Instance.DoAsync(SQL.Instance.Read($"SELECT * FROM {Name} WHERE {where}"));

            return SetFieldValues<T>(Data);
        }

        /// <summary>
        /// Select based on a specific collumn and value
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="FieldName">Collumn name in DB</param>
        /// <param name="FieldValue">Value to check is equal</param>
        /// <returns>Any Selected Objects</returns>
        public T[] Select<T>(string FieldName, object FieldValue) where T : Object, new()
        {
            return Select<T>(new string[] { FieldName }, new object[] { FieldValue });
        }

        /// <summary>
        /// Select based on a specific set of collumns and values
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="FieldNames">Array of Column names in DB</param>
        /// <param name="FieldValues">Values to check Columns equal against</param>
        /// <returns>Any Selected Objects</returns>
        public T[] Select<T>(string[] FieldNames, object[] FieldValues) where T : Object, new()
        {
            List<Tuple<string, object>> Params = new List<Tuple<string, object>>();
            string Where = "";

            for (int i = 0; i < FieldValues.Length && i < FieldNames.Length; i++)
            {
                Column column = Columns.First(x => x.Field.ToLower() == FieldNames[i].ToLower());
                if (column != null)
                {
                    Where += $"{column.Field} = @{column.Field} AND ";
                    Params.Add(new Tuple<string, object>(column.Field, FieldValues[i]));
                }
            }
            Where = Where.Trim().Remove(Where.Length - 5, 4);

            List<object[]> Data = SQL.Instance.DoAsync(SQL.Instance.Read($"SELECT * FROM {Name} WHERE ({Where})", Params));

            return SetFieldValues<T>(Data);
        }

        /// <summary>
        /// Selects using primary key values
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="PrimaryKeyValues">Values for all primary key columns in the table</param>
        /// <returns>Any Selected Objects</returns>
        public T[] Select<T>(object[] PrimaryKeyValues) where T : Object, new()
        {
            Column[] PrimaryKeys = this.PrimaryKeys;

            List<Tuple<string, object>> Params = new List<Tuple<string, object>>();
            string Where = "";

            for (int i = 0; i < PrimaryKeyValues.Length && i < PrimaryKeys.Length; i++)
            {
                if (PrimaryKeyValues[i] != null && PrimaryKeys[i].FieldMatchesType(PrimaryKeyValues[i]))
                {
                    Where += $"{PrimaryKeys[i].Field} = @{PrimaryKeys[i].Field} AND ";
                    Params.Add(new Tuple<string, object>(PrimaryKeys[i].Field, PrimaryKeyValues[i]));
                }
            }
            Where = Where.Trim().Remove(Where.Length - 5, 4);

            List<object[]> Data = SQL.Instance.DoAsync(SQL.Instance.Read($"SELECT * FROM {Name} WHERE ({Where})", Params));

            return SetFieldValues<T>(Data);
        }

        public override string ToString()
        {
            return this.Name;
        }
    }
}