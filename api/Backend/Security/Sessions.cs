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
    public enum SecurityGroup
    {
        None,
        User,
        Administrator
    }

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
            Data.Redis.CacheTable t = Binding.GetTable<Session>();

            Session[] existing = await t.Select<Session>("userid", user.UserID, 1);

            if (existing.Length == 0)
            {
                new Thread(async () => { await new Session() { UserID = user.UserID, AuthToken = Hashing.Hash(token) }.Insert(); }).Start();
            }
            else
            {
                Data.Redis.Instance.InvalidateKey(t.GetKey(existing[0]).ToString());
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

            // Get any cookie data there is Will return null if there isn't a cookie field
            string cookiedata = headers.Get("Cookie");

            // If the cookie sent is the auth token, let's parse it! If there is a userid or an auth
            // token, we don't want to parse it As including cookies is automatically done by the
            // browser, they will always be there And there is no way of getting rid of them when
            // the user trys to re-log-in
            if (cookiedata != null && cookiedata.StartsWith("authtoken=") && userid == null && authtoken == null)
            {
                // Remove the "authtoken=" bit
                cookiedata = cookiedata.Substring(10);
                string[] data = cookiedata.Split("&user_id=");

                // If the data is less than 2, it's a broken request
                if (data.Length != 2)
                {
                    response.StatusCode = 400;
                    response.AddToData("error", "Broken Cookie in request, try clering your cookies");
                    return false;
                }
                // Let's override the current userid and authtoken This is because the browser will
                // be sending the data in a cookie
                authtoken = data[0];
                userid = data[1];
            }
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

            response.StatusCode = 200;

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

        public static async Task<SecurityGroup> GetSecurityGroup(NameValueCollection headers, WebRequest.HttpResponse response)
        {
            if (await CheckSession(headers, response))
            {
                //Logic to determine if is admin
                return SecurityGroup.User;
            }
            else
            {
                return SecurityGroup.None;
            }
        }

        public static async Task<SecurityGroup> GetSecurityGroup(JToken Auth, WebSockets.SocketResponse response)
        {
            if (await CheckSession(Auth, response))
            {
                //Logic to determine if is admin
                return SecurityGroup.User;
            }
            else
            {
                return SecurityGroup.None;
            }
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
