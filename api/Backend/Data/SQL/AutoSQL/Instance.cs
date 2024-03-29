﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Backend.Data.SQL.AutoSQL
{
    public static class Instance
    {
        #region Fields

        public static Redis.CacheTable[] tables;

        #endregion Fields

        #region Methods

        /// <summary>
        /// Start the AutoSQL instance
        /// </summary>
        public static void Start()
        {
            Task<List<object[]>> t = SQL.Instance.Read("SHOW tables");
            t.Wait();
            tables = t.Result.Select(x => new Redis.CacheTable((string)x[0])).ToArray();
        }

        #endregion Methods
    }
}
