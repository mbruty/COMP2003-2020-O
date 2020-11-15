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

        private static string connectionString;

        #endregion Fields

        #region Methods

        /// <summary>
        /// Read data from the db and format it, using the provided sql command
        /// </summary>
        /// <param name="sqlCommand">The SQL command to perform</param>
        /// <returns>A List Of Rows</returns>
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
            await dataReader.DisposeAsync();

            return Data;
        }

        /// <summary>
        /// Run the Function Asynchronusly
        /// </summary>
        /// <typeparam name="T">Resturn Type</typeparam>
        /// <param name="Function">The Task to run</param>
        /// <returns>Result of the Function</returns>
        public static T DoAsync<T>(Task<T> Function)
        {
            Function.Wait();
            return Function.Result;
        }

        /// <summary>
        /// Try to execute the given sql command
        /// </summary>
        /// <param name="Command">The SQL Command String</param>
        /// <param name="Params">A Set Of Paramaters to be included</param>
        /// <returns>If the command was successful</returns>
        public static async Task<bool> Execute(string Command, List<Tuple<string, object>> Params = null)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                await conn.OpenAsync();

                MySqlCommand sqlCommand = conn.CreateCommand();
                sqlCommand.CommandText = Command;

                Params?.ForEach(x => sqlCommand.Parameters.Add(new MySqlParameter(x.Item1, x.Item2)));

                try { await sqlCommand.ExecuteNonQueryAsync(); return true; }
                catch (Exception e) { Console.WriteLine(e.ToString()); return false; }
            }
        }

        /// <summary>
        /// Read data from the db and format it, using the provided sql command
        /// </summary>
        /// <param name="Command">The SQL Command String</param>
        /// <param name="Params">A Set Of Paramaters to be included</param>
        /// <returns>A List Of Rows</returns>
        public static async Task<List<object[]>> Read(string Command, List<Tuple<string, object>> Params = null)
        {
            using (MySqlConnection conn = new MySqlConnection(connectionString))
            {
                await conn.OpenAsync();

                MySqlCommand sqlCommand = conn.CreateCommand();
                sqlCommand.CommandText = Command;

                Params?.ForEach(x => sqlCommand.Parameters.Add(new MySqlParameter(x.Item1, x.Item2)));

                return await DoRead(sqlCommand);
            }
        }

        /// <summary>
        /// Start the SQL Instance
        /// </summary>
        /// <param name="Username"></param>
        /// <param name="Database"></param>
        /// <param name="Password"></param>
        /// <param name="Server"></param>
        /// <param name="Port"></param>
        public static void Start(string Username, string Database, string Password, string Server = "localhost", string Port = "3306")
        {
            connectionString = $"SERVER={Server};UID={Username};DATABASE={Database};port={Port};PASSWORD={Password};SslMode=Preferred;";

            AutoSQL.Instance.Start();
        }

        #endregion Methods
    }
}