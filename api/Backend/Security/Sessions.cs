using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using System;
using System.Threading.Tasks;
using System.Collections.Specialized;

namespace api.Backend.Security
{
    public static class Sessions
    {
        #region Methods

        /// <summary>
        /// Create a login session for the User
        /// </summary>
        /// <param name="user"></param>
        /// <returns>The AuthToken to authenticate this session</returns>
        public static async Task<string> AddSession(User user)
        {
            Session[] existing = await Binding.GetTable<Session>().Select<Session>("UserId", user.Id);

            string token = Hashing.Hash(DateTime.Now.ToString()).Substring(15, 32), hashtoken = Hashing.Hash(token);

            if (existing.Length == 0)
            {
                Session session = new Session() { UserId = user.Id, AuthToken = hashtoken };

                await session.Insert();
            }
            else
            {
                existing[0].AuthToken = hashtoken;
                await existing[0].Update();
            }

            return token;
        }

        /// <summary>
        /// Checks if the req headers contain a valid session
        /// </summary>
        /// <param name="headers"></param>
        /// <param name="response"></param>
        /// <returns>If the session is valid</returns>
        public static async Task<bool> CheckSession(NameValueCollection headers, WebRequest.HttpResponse response)
        {
            string userid = headers["userid"], authtoken = headers["authtoken"];

            if (userid == null || authtoken == null)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing email or authtoken");
                return false;
            }

            if (!int.TryParse(userid, out int uid))
            {
                response.StatusCode = 401;
                response.AddToData("error", "User id is invalid");
                return false;
            }

            Session[] sessions = await Binding.GetTable<Session>().Select<Session>("userid", uid);

            if (sessions.Length == 0)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Session does not exist");
                return false;
            }

            if (!Hashing.Match(authtoken, sessions[0].AuthToken))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Authtoken is incorrect");
                return false;
            }

            return true;
        }

        #endregion Methods
    }
}