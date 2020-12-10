using StackExchange.Redis;
using System;
using System.Threading.Tasks;

namespace api.Backend.Data.Redis
{
    internal class Instance
    {
        #region Fields

        private static readonly string connString = $"{Security.Redis_Connection_Details.host},password={Security.Redis_Connection_Details.pword}";

        // ToDo: Figure out what to set this to... 5 Seconds just for testing
        private static readonly TimeSpan EXPIRATION = new TimeSpan(0, 5, 0);

        private static ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(connString);

        public static IDatabase database = redis.GetDatabase();

        #endregion Fields

        #region Methods

        /// <summary>
        /// Get a value by key
        /// </summary>
        /// <param name="key"> The key the value was stored with </param>
        /// <returns> The value associated to the key </returns>
        public static async Task<string> GetString(string key)
        {
            // The key is needed, reset the expiration on it
            await database.KeyExpireAsync(key, EXPIRATION);
            return await database.StringGetAsync(key);
        }

        /// <summary>
        /// Check if the database contains a key
        /// </summary>
        /// <param name="key"> The key to querywith </param>
        /// <returns> A boolean value wether the database contains that key </returns>
        public static async Task<bool> HasKey(string key)
        {
            return await database.KeyExistsAsync(key);
        }

        /// <summary>
        /// Store a value in the database with a key. This value will expire in a set amount of time
        /// </summary>
        /// <param name="key">   The key that will be used to obtain the value again </param>
        /// <param name="value"> The value to store </param>
        public static async void SetStringWithExpiration(string key, string value)
        {
            await database.StringSetAsync(key, value, EXPIRATION);
        }

        #endregion Methods
    }
}
