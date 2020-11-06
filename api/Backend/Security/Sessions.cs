﻿using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;
using api.Backend.Endpoints;
using api.Backend.Security;
using System.Collections.Specialized;
using System;

namespace api.Backend.Security
{
    public static class Sessions
    {
        #region Methods

        public static bool CheckSession(NameValueCollection headers, ref WebRequest.HttpResponse response)
        {
            string userid = headers["userid"], authtoken = headers["authtoken"];

            if (userid == null || authtoken == null)
            {
                response.StatusCode = 401;
                response.AddToData("error", "Missing email or authtoken");
                return false;
            }

            int uid;

            if (!int.TryParse(userid, out uid))
            {
                response.StatusCode = 401;
                response.AddToData("error", "User id is invalid");
                return false;
            }

            Session[] sessions = Binding.GetTable<Session>().Select<Session>("userid", uid);

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