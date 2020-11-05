using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using System.Linq;

namespace api
{
    public static class SQL_Test_Code
    {
        #region Methods

        public static void Run()
        {
            Table[] t = api.Backend.Data.SQL.AutoSQL.Instance.tables;

            Binding.Add<User>("User");

            var p = Binding.GetTable<User>().Select<User>();

            p[0].Nickname = "Garath";
            p[0].Update();

            User u = new User();
            u.Email = "oscar.d@gmai.com";
            u.Password = "sdsfsdf";
            u.YearOfBirth = 2002;
            u.CheckId = 1;

            u.Insert();

            u = Binding.GetTable<User>().Select<User>("Email", u.Email)?.First();

            u.Delete();

            User[] users = /*t[4].Select<User>(new object[] { null, "o.d@g.c" });*/
            t[4].Select<User>("YearOfBirth", 2001);
        }

        #endregion Methods
    }
}