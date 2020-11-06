using Scrypt;

namespace api.Backend.Security
{
    public static class Hashing
    {
        #region Fields

        private static ScryptEncoder encoder = new ScryptEncoder();

        #endregion Fields

        #region Methods

        public static string Hash(string raw)
        {
            return encoder.Encode(raw);
        }

        public static bool Match(string raw, string hash)
        {
            return encoder.Compare(raw, hash);
        }

        #endregion Methods
    }
}