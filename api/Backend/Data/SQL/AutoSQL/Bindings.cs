using System;
using System.Collections.Generic;
using System.Linq;

namespace api.Backend.Data.SQL.AutoSQL
{
    public class Binding
    {
        #region Fields

        private Type ObjType;
        private Table table;
        public static List<Binding> bindings = new List<Binding>();

        #endregion Fields

        #region Constructors

        public Binding(Type Obj, string Table)
        {
            this.ObjType = Obj;
            this.table = Instance.tables.First(x => x.Name.ToLower() == Table.ToLower());
        }

        #endregion Constructors

        #region Methods

        public static void Add<T>(string Table)
        {
            bindings.Add(new Binding(typeof(T), Table));
        }

        public static void Add(Type objType, string Table)
        {
            bindings.Add(new Binding(objType, Table));
        }

        public static Table GetTable<T>()
        {
            return bindings.First(x => x.ObjType == typeof(T))?.table;
        }

        #endregion Methods
    }
}