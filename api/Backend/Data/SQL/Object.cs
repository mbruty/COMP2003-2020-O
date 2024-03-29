﻿using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Backend.Data.SQL
{
    public class Object
    {
        #region Methods

        /// <summary>
        /// Get the value(s) of the last autoincrmenetd fields
        /// </summary>
        /// <returns> Array of incremented ids </returns>
        private uint[] FetchAutoIncrement()
        {
            List<object[]> Data = SQL.Instance.DoAsync(Instance.Read($"SELECT LAST_INSERT_ID();"));
            return Array.ConvertAll(Data[0], x => uint.Parse(x.ToString()));
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
        /// <returns> If the delete was successful </returns>
        public virtual async Task<bool> Delete<T>() where T : Obj.Object, new()
        {
            Type t = this.GetType();
            Redis.CacheTable table = Binding.GetTable(t);

            Column[] PrimaryKeys = table.PrimaryKeys;

            List<Tuple<string, object>> Params = new List<Tuple<string, object>>();

            string Where = "";
            for (int i = 0; i < PrimaryKeys.Length; i++)
            {
                Where += $"{PrimaryKeys[i].Field} = @{PrimaryKeys[i].Field} AND ";
                Params.Add(new Tuple<string, object>(PrimaryKeys[i].Field, t.GetField(PrimaryKeys[i].Field).GetValue(this)));
            }
            Where = Where.Trim().Remove(Where.Length - 5, 4);

            Redis.Instance.InvalidateKey(table.GetKey<T>((T)this).ToString());

            return await Instance.Execute($"DELETE FROM {table.Name} WHERE {Where}", Params);
        }

        /// <summary>
        /// Attempt to insert this into the db
        /// </summary>
        /// <param name="FetchInsertedIds"> If we should fill auto incremeneted fields </param>
        /// <returns> If the insert was successful </returns>
        public virtual async Task<bool> Insert<T>(bool FetchInsertedIds = false) where T : Obj.Object, new()
        {
            Type t = this.GetType();
            Redis.CacheTable table = Binding.GetTable(t);

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

            bool success = await Instance.Execute($"INSERT INTO {table.Name} VALUES ({What})", Params);

            if (FetchInsertedIds && success)
            {
                uint[] Ids = FetchAutoIncrement();

                Column[] AutoIncrement = Fields.Where(x => x.IsAutoIncrement).ToArray();

                if (AutoIncrement.Any()) t.GetField(AutoIncrement[0].Field)?.SetValue(this, Ids[0]);
            }
            return success;
        }

        /// <summary>
        /// Attempt to update this object in the db
        /// </summary>
        /// <returns> If the update was successful </returns>
        public virtual async Task<bool> Update<T>() where T : Obj.Object, new()
        {
            Type t = this.GetType();
            Redis.CacheTable table = Binding.GetTable(t);

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

            Redis.Instance.InvalidateKey(table.GetKey<T>((T)this).ToString());

            return await Instance.Execute($"UPDATE {table.Name} SET {What} WHERE {Where}", Params);
        }
    }
}
