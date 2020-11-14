using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Collections.Generic;
using System.Linq;

namespace api.Backend.Data.SQL
{
    public class Object
    {
        #region Methods

        /// <summary>
        /// Get the value(s) of the last autoincrmenetd fields
        /// </summary>
        /// <returns>Array of incremented ids</returns>
        private int[] FetchAutoIncrement()
        {
            List<object[]> Data = SQL.Instance.DoAsync(Instance.Read($"SELECT LAST_INSERT_ID();"));
            return Array.ConvertAll(Data[0], x => int.Parse(x.ToString()));
        }

        #endregion Methods

        #region Constructors

        public Object()
        {
        }

        #endregion Constructors

        /// <summary>
        /// Delete this object from the database
        /// </summary>
        /// <returns>If the delete was successful</returns>
        public virtual bool Delete()
        {
            Type t = this.GetType();
            Table table = Binding.GetTable(t);

            Column[] PrimaryKeys = table.PrimaryKeys, Fields = table.Fields;

            List<Tuple<string, object>> Params = new List<Tuple<string, object>>();

            string Where = "";
            for (int i = 0; i < PrimaryKeys.Length; i++)
            {
                Where += $"{PrimaryKeys[i].Field} = @{PrimaryKeys[i].Field} AND ";
                Params.Add(new Tuple<string, object>(PrimaryKeys[i].Field, t.GetField(PrimaryKeys[i].Field).GetValue(this)));
            }
            Where = Where.Trim().Remove(Where.Length - 5, 4);

            return SQL.Instance.DoAsync(Instance.Execute($"DELETE FROM {table.Name} WHERE {Where}", Params));
        }

        /// <summary>
        /// Attempt to insert this into the db
        /// </summary>
        /// <param name="FetchInsertedIds">If we should fill auto incremeneted fields</param>
        /// <returns>If the insert was successful</returns>
        public virtual bool Insert(bool FetchInsertedIds = false)
        {
            Type t = this.GetType();
            Table table = Binding.GetTable(t);

            Column[] Fields = table.Columns;

            List<Tuple<string, object>> Params = new List<Tuple<string, object>>();
            string What = "";

            for (int i = 0; i < Fields.Length; i++)
            {
                object Value = t.GetField(Fields[i].Field).GetValue(this);

                if (!Fields[i].IsAutoIncrement && (Fields[i].Default == null || Value != null))
                {
                    What += $"@{Fields[i].Field}, ";
                    Params.Add(new Tuple<string, object>(Fields[i].Field, Value));
                }
                else What += "default, ";
            }
            What = What.Trim().Remove(What.Length - 2, 1);

            bool success = SQL.Instance.DoAsync(Instance.Execute($"INSERT INTO {table.Name} VALUES ({What})", Params));

            if (FetchInsertedIds && success)
            {
                int[] Ids = FetchAutoIncrement();

                t.GetField(Fields.First(x => x.IsAutoIncrement)?.Field)?.SetValue(this, Ids[0]);
            }
            return success;
        }

        /// <summary>
        /// Attempt to update this object in the db
        /// </summary>
        /// <returns>If the update was successful</returns>
        public virtual bool Update()
        {
            Type t = this.GetType();
            Table table = Binding.GetTable(t);

            Column[] PrimaryKeys = table.PrimaryKeys, Fields = table.Fields;

            List<Tuple<string, object>> Params = new List<Tuple<string, object>>();
            string What = "";

            for (int i = 0; i < Fields.Length; i++)
            {
                What += $"{Fields[i].Field} = @{Fields[i].Field}, ";
                Params.Add(new Tuple<string, object>(Fields[i].Field, t.GetField(Fields[i].Field).GetValue(this)));
            }
            What = What.Trim().Remove(What.Length - 2, 1);

            string Where = "";
            for (int i = 0; i < PrimaryKeys.Length; i++)
            {
                Where += $"{PrimaryKeys[i].Field} = @{PrimaryKeys[i].Field} AND ";
                Params.Add(new Tuple<string, object>(PrimaryKeys[i].Field, t.GetField(PrimaryKeys[i].Field).GetValue(this)));
            }
            Where = Where.Trim().Remove(Where.Length - 5, 4);

            return SQL.Instance.DoAsync(Instance.Execute($"UPDATE {table.Name} SET {What} WHERE {Where}", Params));
        }
    }
}