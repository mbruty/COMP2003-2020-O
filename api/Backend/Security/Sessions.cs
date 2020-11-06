using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using System;

namespace api.Backend.Security
{
    public static class Sessions
    {
        #region Methods

        public static string AddSession(User user)
        {
            Session[] existing = Binding.GetTable<Session>().Select<Session>("UserId", user.Id);

            string token = Hashing.Hash(DateTime.Now.ToString()).Substring(15, 32), hashtoken = Hashing.Hash(token);

            if (existing.Length == 0)
            {
                Session session = new Session();
                session.UserId = user.Id;
                session.AuthToken = hashtoken;

                session.Insert();
            }
            else
            {
                existing[0].AuthToken = hashtoken;
                existing[0].Update();
            }

            return token;
        }

        #endregion Methods
    }
}