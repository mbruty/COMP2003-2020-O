using api.Backend.Data.SQL.AutoSQL;
using System.Collections.Generic;
using System.Linq;
using System;

namespace api.Backend.Data.SQL
{
    public class Object
    {
        #region Methods

        public void Update()
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

            SQL.Instance.Execute($"UPDATE {table.Name} SET {What} WHERE {Where}", Params);
        }

        #endregion Methods
    }
}