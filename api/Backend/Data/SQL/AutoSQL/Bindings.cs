using System;
using System.Collections.Generic;
using System.Linq;

namespace api.Backend.Data.SQL.AutoSQL
{
    /// <summary>
    /// Represents a link between a Table Obj and a DB Table
    /// </summary>
    public class Binding
    {
        #region Fields

        private readonly Type ObjType;
        private readonly Table table;
        public static List<Binding> bindings = new List<Binding>();

        #endregion Fields

        #region Constructors

        /// <summary>
        /// Link the Obj to the Table
        /// </summary>
        /// <param name="Obj"></param>
        /// <param name="Table"></param>
        public Binding(Type Obj, string Table)
        {
            this.ObjType = Obj;
            this.table = Instance.tables.First(x => x.Name.ToLower() == Table.ToLower());
        }

        #endregion Constructors

        #region Methods

        /// <summary>
        /// Create a link between T and Table
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="Table"></param>
        public static void Add<T>(string Table)
        {
            bindings.Add(new Binding(typeof(T), Table));
        }

        /// <summary>
        /// Create a link between objType and Table
        /// </summary>
        /// <param name="objType"></param>
        /// <param name="Table"></param>
        public static void Add(Type objType, string Table)
        {
            bindings.Add(new Binding(objType, Table));
        }

        /// <summary>
        /// Get the table that is bound to type T
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <returns></returns>
        public static Table GetTable<T>()
        {
            return bindings.First(x => x.ObjType == typeof(T))?.table;
        }

        /// <summary>
        /// Get the table that is bound to type objType
        /// </summary>
        /// <param name="objType"></param>
        /// <returns></returns>
        public static Table GetTable(Type objType)
        {
            return bindings.First(x => x.ObjType == objType)?.table;
        }

        #endregion Methods
    }
}