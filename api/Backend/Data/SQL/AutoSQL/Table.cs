using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace api.Backend.Data.SQL.AutoSQL
{
    public class Table
    {
        public string Name;
        public Column[] Columns;

        public Column[] PrimaryKeys
        {
            get { return Columns.Where(x => x.Key == Key.PRI).ToArray(); }
        }

        public Column[] ForeignKeys
        {
            get { return Columns.Where(x => x.Key == Key.MUL).ToArray(); }
        }

        public T[] Select<T>(string where = "TRUE") where T : new()
        {
            List<object[]> Data = SQL.Instance.Read($"SELECT * FROM {Name} WHERE {where}");

            return SetFieldValues<T>(Data);
        }

        public T[] Select<T>(string FieldName, object FieldValue) where T : new()
        {
            return Select<T>(new string[] { FieldName }, new object[] { FieldValue });
        }

        public T[] Select<T>(string[] FieldNames, object[] FieldValues) where T : new()
        {
            List<Tuple<string, object>> Params = new List<Tuple<string, object>>();
            string Where = "";

            for (int i = 0; i < FieldValues.Length && i < FieldNames.Length; i++)
            {
                Column column = Columns.First(x => x.Field.ToLower() == FieldNames[i].ToLower());
                if (column!=null)
                {
                    Where += $"{column.Field} = @{column.Field} AND ";
                    Params.Add(new Tuple<string, object>(column.Field, FieldValues[i]));
                }
            }
            Where = Where.Trim().Remove(Where.Length - 5, 4);

            List<object[]> Data = SQL.Instance.Read($"SELECT * FROM {Name} WHERE ({Where})", Params);

            return SetFieldValues<T>(Data);
        }

        public T[] Select<T>(object[] PrimaryKeyValues) where T : new()
        {
            Column[] PrimaryKeys = this.PrimaryKeys;

            List<Tuple<string, object>> Params = new List<Tuple<string, object>>();
            string Where = "";

            for (int i = 0; i < PrimaryKeyValues.Length && i<PrimaryKeys.Length; i++) 
            {
                if (PrimaryKeyValues[i] != null && PrimaryKeys[i].FieldMatchesType(PrimaryKeyValues[i]))
                {
                    Where += $"{PrimaryKeys[i].Field} = @{PrimaryKeys[i].Field} AND ";
                    Params.Add(new Tuple<string, object>(PrimaryKeys[i].Field, PrimaryKeyValues[i]));
                }
            }
            Where = Where.Trim().Remove(Where.Length - 5,4);

            List<object[]> Data = SQL.Instance.Read($"SELECT * FROM {Name} WHERE ({Where})",Params);

            return SetFieldValues<T>(Data);
        }

        private T[] SetFieldValues<T>(List<object[]> Data) where T : new()
        {
            Type t = typeof(T);

            T[] Tata = new T[Data.Count];
            Tata = Tata.Select(x => new T()).ToArray();

            foreach (FieldInfo p in t.GetFields())
            {
                int index = Array.FindIndex(Columns, x => x.Field.ToString().ToLower() == p.Name.ToLower());

                for (int i = 0; i < Tata.Length && index > -1; i++) p.SetValue(Tata[i], Data[i][index]);
            }
            return Tata;
        }

        public Table(string Name)
        {
            this.Name = Name;
            this.Columns = SQL.Instance.Read($"SHOW columns FROM {Name}").Select(y => new Column(y)).ToArray();
        }

        public override string ToString()
        {
            return this.Name;
        }
    }
}
