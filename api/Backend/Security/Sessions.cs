using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Specialized;
using System.Threading;
using System.Threading.Tasks;

namespace api.Backend.Security
{
    public static class Sessions
    {
        #region Fields

        private static Random rnd = new Random();

        #endregion Fields

        #region Methods

        /// <summary>
        /// Create a login session for the User
        /// </summary>
        /// <param name="user"> </param>
        /// <returns> The AuthToken to authenticate this session </returns>
        public static async Task AddSession(User user, string token)
        {
            Session[] existing = await Binding.GetTable<Session>().Select<Session>("UserId", user.UserID, 1);

            if (existing.Length == 0)
            {
                new Thread(async () => { await new Session() { UserID = user.UserID, AuthToken = Hashing.Hash(token) }.Insert(); }).Start();
            }
            else
            {
                new Thread(async () => { existing[0].AuthToken = Hashing.Hash(token); await existing[0].Update(); }).Start();
            }
        }

        /// <summary>
        /// Checks if the req headers contain a valid session
        /// </summary>
        /// <param name="headers">  </param>
        /// <param name="response"> </param>
        /// <returns> If the session is valid </returns>
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

        public static async Task<bool> CheckSession(JToken Auth, WebSockets.SocketResponse response)
        {
            string userid = Auth["userid"].ToString(), authtoken = Auth["authtoken"].ToString();

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

        public static string RandomString(int length = 32)
        {
            string s = "";
            for (int i = length; i >= 0; i--) s += (char)rnd.Next(65, 123);
            return s.Replace('\\', '/');
        }

        #endregion Methods
    }
}
