using api.Backend.Data.SQL.AutoSQL;
using System;
using System.Collections.Specialized;
using System.Linq;
using System.Reflection;

namespace api.Backend.Data.Obj
{
    public class Object : SQL.Object
    {
        #region Methods

        public virtual Object Purge()
        {
            return this;
        }

        public async void UpdateContents<T>(NameValueCollection headers) where T : Obj.Object, new()
        {
            Type t = typeof(T);
            Table table = Binding.GetTable<T>();

            foreach (FieldInfo field in t.GetFields())
            {
                if (headers.AllKeys.Select(x => x.ToLower()).Contains(field.Name.ToLower()) && table.AutoIncrement.Count(x => x.Field.ToLower() == field.Name.ToLower()) == 0)
                {
                    if (field.Name.ToLower().StartsWith("password")) { } //We dont want to allow Password Changing this way
                    //field.SetValue(this, Hashing.Hash(headers[field.Name]));
                    else field.SetValue(this, Convert.ChangeType(headers[field.Name], field.FieldType));
                }
            }
            await this.Update<T>();
        }

        #endregion Methods
    }
}
