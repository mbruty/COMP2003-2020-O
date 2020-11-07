using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Scrypt;

namespace api.Backend.Security
{
    public static class Hashing
    {
        private static ScryptEncoder encoder = new ScryptEncoder();

        public static string Hash(string raw)
        {
            return encoder.Encode(raw);
        }

        public static bool Match(string raw, string hash)
        {
            return encoder.Compare(raw, hash);
        }
    }
}
