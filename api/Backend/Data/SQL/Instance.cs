using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Threading.Tasks;

namespace api.Backend.Data.SQL
{
    public static class Instance
    {
        #region Fields

        private static MySqlConnection connection;

        #endregion Fields

        #region Methods

        public static T DoAsync<T>(Task<T> Function)
        {
            Function.Wait();
            return Function.Result;
        }

        private async static Task<List<object[]>> DoRead(MySqlCommand sqlCommand)
        {
            DbDataReader dataReader = await sqlCommand.ExecuteReaderAsync();

            List<object[]> Data = new List<object[]>();
            object[] tRow;
            while (dataReader.Read())
            {
                tRow = new object[dataReader.FieldCount];
                for (int i = 0; i < tRow.Length; i++) tRow[i] = dataReader[i];
                Data.Add(tRow);
            }

            dataReader.Close();

            return Data;
        }

        public static async Task<bool> Execute(string Command, List<Tuple<string, object>> Params = null)
        {
            MySqlCommand sqlCommand = connection.CreateCommand();
            sqlCommand.CommandText = Command;

            Params?.ForEach(x => sqlCommand.Parameters.Add(new MySqlParameter(x.Item1, x.Item2)));

            try { await sqlCommand.ExecuteNonQueryAsync(); return true; } catch (Exception e) { Console.WriteLine(e.ToString()); return false; }
        }

        public static async Task<List<object[]>> Read(string Command, List<Tuple<string, object>> Params = null)
        {
            MySqlCommand sqlCommand = connection.CreateCommand();
            sqlCommand.CommandText = Command;

            Params?.ForEach(x => sqlCommand.Parameters.Add(new MySqlParameter(x.Item1, x.Item2)));

            return await DoRead(sqlCommand);
        }

        public static void Start(string Username, string Database, string Password, string Server = "localhost", string Port = "3306")
        {
            connection = new MySqlConnection($"SERVER={Server};UID={Username};DATABASE={Database};port={Port};PASSWORD={Password};SslMode=Preferred;");
            connection.Open();

            AutoSQL.Instance.Start();
        }

        #endregion Methods
    }
}