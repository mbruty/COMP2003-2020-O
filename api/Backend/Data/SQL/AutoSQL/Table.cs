using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Backend.Data.SQL.AutoSQL
{
    public class Table
    {
        public string Name;
        public Column[] Columns;

        public Column[] PrimaryKeys
        {
            get { return Columns.Where(x => x.Key == Key.PRI).ToArray(); }
        }

        public Column[] ForeignKeys
        {
            get { return Columns.Where(x => x.Key == Key.MUL).ToArray(); }
        }

        public Table(string Name)
        {
            this.Name = Name;
            this.Columns = SQL.Instance.Read($"SHOW columns FROM {Name}").Select(y => new Column(y)).ToArray();
        }

        public override string ToString()
        {
            return this.Name;
        }
    }
}
