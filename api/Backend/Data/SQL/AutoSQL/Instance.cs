using System.Linq;

namespace api.Backend.Data.SQL.AutoSQL
{
    public static class Instance
    {
        #region Fields

        public static Table[] tables;

        #endregion Fields

        #region Methods

        public static void Start()
        {
            tables = SQL.Instance.Read("SHOW tables").Select(x => new Table((string)x[0])).ToArray();
        }

        #endregion Methods

        //public static T[] Select<T>(string Table, object[] PrimaryKeys)
        //{
        //}
    }
}