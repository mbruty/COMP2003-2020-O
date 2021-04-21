using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Specialized;
using System.Text.Json;
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

        public static async Task AddSession(RestaurantAdmin admin, string token)
        {
            Data.Redis.CacheTable t = Binding.GetTable<RAdminSession>();

            RAdminSession[] existing = await t.Select<RAdminSession>("radminid", admin.RAdminID, 1);

            if (existing.Length == 0)
            {
                new Thread(async () => { await new RAdminSession() { RAdminID = admin.RAdminID, AuthToken = Hashing.Hash(token) }.Insert(); }).Start();
            }
            else
            {
                Data.Redis.Instance.InvalidateKey(t.GetKey(existing[0]).ToString());
                new Thread(async () => { existing[0].AuthToken = Hashing.Hash(token); await existing[0].Update(); }).Start();
            }
        }

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
        public static async Task<SecurityPerm> CheckSession(AuthObj body, WebRequest.HttpResponse response)
        {
            string userid = body.userid, authtoken = body.authtoken, adminid = body.adminid;

            // Get any cookie data there is Will return null if there isn't a cookie field
            string cookiedata = body.Cookie;

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
                    return new SecurityPerm();
                }
                // Let's override the current userid and authtoken This is because the browser will
                // be sending the data in a cookie
                authtoken = data[0];
                if (cookiedata.Contains("user_id")) userid = data[1]; else adminid = data[1];
            }

            return await CheckSession(userid, adminid, authtoken, response);
        }

        public static async Task<SecurityPerm> CheckSession(string userid, string adminid, string authtoken, Response response)
        {
            SecurityPerm group = new SecurityPerm();

            if (authtoken == null)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing authtoken");
                return new SecurityPerm();
            }

            string _session_token = "N";

            if (userid != null)
            {
                if (!uint.TryParse(userid, out uint uid))
                {
                    response.StatusCode = 401;
                    response.AddToData("error", "Id is invalid");
                    return new SecurityPerm();
                }

                Session[] sessions = await Binding.GetTable<Session>().Select<Session>("userid", uid);

                if (sessions.Length == 0)
                {
                    response.StatusCode = 401;
                    response.AddToData("error", "Session does not exist");
                    return new SecurityPerm();
                }

                _session_token = sessions[0].AuthToken;
                group = new SecurityPerm() { SecurityGroup = SecurityGroup.User, user_id = uid };
            }
            else if (adminid != null)
            {
                if (!uint.TryParse(adminid, out uint uid))
                {
                    response.StatusCode = 401;
                    response.AddToData("error", "Id is invalid");
                    return new SecurityPerm();
                }

                RAdminSession[] sessions = await Binding.GetTable<RAdminSession>().Select<RAdminSession>("radminid", uid);

                if (sessions.Length == 0)
                {
                    response.StatusCode = 401;
                    response.AddToData("error", "Session does not exist");
                    return new SecurityPerm();
                }

                _session_token = sessions[0].AuthToken;
                group = new SecurityPerm() { SecurityGroup = SecurityGroup.Administrator, admin_id = uid }; ;
            }
            else
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing userid/adminid");
                return new SecurityPerm();
            }

            if (!Hashing.Match(authtoken, _session_token))
            {
                response.StatusCode = 401;
                response.AddToData("error", "Authtoken is incorrect");
                return new SecurityPerm();
            }

            return group;
        }

        public static async Task<SecurityPerm> CheckSession(JToken Auth, WebSockets.SocketResponse response)
        {
            string userid = Auth["userid"].ToString(), adminid = Auth["adminid"].ToString(), authtoken = Auth["authtoken"].ToString();
            return await CheckSession(userid, adminid, authtoken, response);
        }

        public static async Task<SecurityPerm> GetSecurityGroup(NameValueCollection headers, WebRequest.HttpResponse response, string Data)
        {
            if (Data.Contains("authtoken"))
            {
                // We're not using cookies or headers
                AuthObj auth = JsonSerializer.Deserialize<AuthObj>(Data);
                if (auth.authtoken != "" && (auth.userid != "" || auth.adminid != ""))
                {
                    return await CheckSession(auth.userid, auth.adminid, auth.authtoken, response);
                }
            }
            string cookie = headers.Get("Cookie");
            if (cookie != null)
            {
                return await CheckSession(new AuthObj { Cookie = cookie }, response);
            }
            Security.AuthObj auth_obj = (Security.AuthObj)Misc.ConvertHeadersOrBodyToType(typeof(Security.AuthObj), headers, Data);
            return await CheckSession(auth_obj, response);
        }

        public static async Task<SecurityPerm> GetSecurityGroup(JToken Auth, WebSockets.SocketResponse response)
        {
            return await CheckSession(Auth, response);
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

        public static string RandomString(int length = 32)
        {
            string s = "";
            for (int i = length; i >= 0; i--) s += (char)rnd.Next(65, 123);
            return s.Replace('\\', '/');
        }

        #endregion Methods
    }

    public class AuthObj
    {
        #region Properties

        public string adminid { get; set; }
        public string authtoken { get; set; }
        public string Cookie { get; set; }
        public string userid { get; set; }

        #endregion Properties
    }

    public class SecurityPerm
    {
        #region Fields

        public uint admin_id = 0, user_id = 0;
        public SecurityGroup SecurityGroup = SecurityGroup.None;

        #endregion Fields
    }
}
