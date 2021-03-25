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
        public static async Task<SecurityGroup> CheckSession(NameValueCollection headers, WebRequest.HttpResponse response)
        {
            string userid = headers["userid"], authtoken = headers["authtoken"], adminid = headers["adminid"];

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
                string[] data = cookiedata.Replace("admin_id", "user_id").Split("&user_id=");

                // If the data is less than 2, it's a broken request
                if (data.Length != 2)
                {
                    response.StatusCode = 400;
                    response.AddToData("error", "Broken Cookie in request, try clearing your cookies");
                    return SecurityGroup.None;
                }
                // Let's override the current userid and authtoken This is because the browser will
                // be sending the data in a cookie
                authtoken = data[0];
                if (cookiedata.Contains("user_id")) userid = data[1]; else adminid = data[1];
            }


            return await CheckSession(userid, adminid, authtoken, response);
        }

        public static async Task<SecurityGroup> CheckSession(string userid, string adminid, string authtoken, Response response)
        {
            SecurityGroup group = SecurityGroup.None;

            if (authtoken == null)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing authtoken");
                return SecurityGroup.None;
            }

            string _session_token = "N";

            if (userid != null)
            {
                if (!int.TryParse(userid, out int uid))
                {
                    response.StatusCode = 401;
                    response.AddToData("error", "Id is invalid");
                    return SecurityGroup.None;
                }

                Session[] sessions = await Binding.GetTable<Session>().Select<Session>("userid", uid);

                if (sessions.Length == 0)
                {
                    response.StatusCode = 401;
                    response.AddToData("error", "Session does not exist");
                    return SecurityGroup.None;
                }

                _session_token = sessions[0].AuthToken;
                group = SecurityGroup.User;
            }
            else if (adminid != null)
            {
                if (!int.TryParse(userid, out int uid))
                {
                    response.StatusCode = 401;
                    response.AddToData("error", "Id is invalid");
                    return SecurityGroup.None;
                }

                RAdminSession[] sessions = await Binding.GetTable<RAdminSession>().Select<RAdminSession>("radminid", uid);

                if (sessions.Length == 0)
                {
                    response.StatusCode = 401;
                    response.AddToData("error", "Session does not exist");
                    return SecurityGroup.None;
                }

                _session_token = sessions[0].AuthToken;
                group = SecurityGroup.Administrator;
            }
            else
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing userid/adminid");
                return SecurityGroup.None;
            }

            if (!Hashing.Match(authtoken, _session_token))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Authtoken is incorrect");
                return SecurityGroup.None;
            }

            return group;
        }

        public static async Task<SecurityGroup> CheckSession(JToken Auth, WebSockets.SocketResponse response)
        {
            string userid = Auth["userid"].ToString(), adminid = Auth["adminid"].ToString(), authtoken = Auth["authtoken"].ToString();
            return await CheckSession(userid, adminid, authtoken, response);
        }

        public static async Task<SecurityGroup> GetSecurityGroup(NameValueCollection headers, WebRequest.HttpResponse response)
        {
            return await CheckSession(headers, response);
        }

        public static async Task<SecurityGroup> GetSecurityGroup(JToken Auth, WebSockets.SocketResponse response)
        {
            return await CheckSession(Auth, response);
        }

        public static string RandomString(int length = 32)
        {
            string s = "";
            for (int i = length; i >= 0; i--) s += (char)rnd.Next(65, 123);
            return s.Replace('\\', '/');
        }

        public static bool IsAuthorized(SecurityGroup accountIs, SecurityGroup targetGroup)
        {
            switch (accountIs)
            {
                case SecurityGroup.None:
                    return targetGroup == SecurityGroup.None;

                case SecurityGroup.User:
                    return targetGroup != SecurityGroup.Administrator;

                case SecurityGroup.Administrator:
                    return targetGroup != SecurityGroup.User;
            }

            return false;
        }

        #endregion Methods
    }
}
