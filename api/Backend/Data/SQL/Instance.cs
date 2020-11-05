using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MySql.Data;
using MySql.Data.MySqlClient;

namespace api.Backend.Data.SQL
{
    public static class Instance
    {
        #region Fields

        private static MySqlConnection connection;

        #endregion Fields

        #region Methods

        private static List<object[]> DoRead(MySqlCommand sqlCommand)
        {
            MySqlDataReader dataReader = sqlCommand.ExecuteReader();

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

        public static void Execute(string Command, List<Tuple<string, object>> Params = null)
        {
            MySqlCommand sqlCommand = connection.CreateCommand();
            sqlCommand.CommandText = Command;

            Params?.ForEach(x => sqlCommand.Parameters.Add(new MySqlParameter(x.Item1, x.Item2)));

            try { sqlCommand.ExecuteNonQuery(); } catch (Exception e) { Console.WriteLine(e.ToString()); }
        }

        public static List<object[]> Read(string Command, List<Tuple<string, object>> Params = null)
        {
            MySqlCommand sqlCommand = connection.CreateCommand();
            sqlCommand.CommandText = Command;

            Params?.ForEach(x => sqlCommand.Parameters.Add(new MySqlParameter(x.Item1, x.Item2)));

            return DoRead(sqlCommand);
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