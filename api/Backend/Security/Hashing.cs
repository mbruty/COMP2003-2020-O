using Scrypt;

namespace api.Backend.Security
{
    public static class Hashing
    {
        #region Fields

        private static ScryptEncoder encoder = new ScryptEncoder();

        #endregion Fields

        #region Methods

        /// <summary>
        /// Hash the given string
        /// </summary>
        /// <param name="raw"></param>
        /// <returns></returns>
        public static string Hash(string raw)
        {
            return encoder.Encode(raw);
        }

        /// <summary>
        /// Check if the raw matches the hash
        /// </summary>
        /// <param name="raw">Unhashed string</param>
        /// <param name="hash">Hashed string</param>
        /// <returns></returns>
        public static bool Match(string raw, string hash)
        {
            return encoder.Compare(raw, hash);
        }

        #endregion Methods
    }
}