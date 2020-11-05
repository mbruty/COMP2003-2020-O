using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace api.Backend.Data.SQL.AutoSQL
{
    public class Table
    {
        #region Methods

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
                    p.SetValue(Tata[i], Data[i][index].GetType() != typeof(DBNull) ? Data[i][index] : null);
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
            this.Columns = SQL.Instance.Read($"SHOW columns FROM {Name}").Select(y => new Column(y)).ToArray();
        }

        #endregion Constructors

        #region Properties

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

        public T[] Select<T>(string where = "TRUE") where T : Object, new()
        {
            List<object[]> Data = SQL.Instance.Read($"SELECT * FROM {Name} WHERE {where}");

            return SetFieldValues<T>(Data);
        }

        public T[] Select<T>(string FieldName, object FieldValue) where T : Object, new()
        {
            return Select<T>(new string[] { FieldName }, new object[] { FieldValue });
        }

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

            List<object[]> Data = SQL.Instance.Read($"SELECT * FROM {Name} WHERE ({Where})", Params);

            return SetFieldValues<T>(Data);
        }

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

            List<object[]> Data = SQL.Instance.Read($"SELECT * FROM {Name} WHERE ({Where})", Params);

            return SetFieldValues<T>(Data);
        }

        public override string ToString()
        {
            return this.Name;
        }
    }
}