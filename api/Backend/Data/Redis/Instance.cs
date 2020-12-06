using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using StackExchange.Redis;
namespace api.Backend.Data.Redis
{

    class Instance
    {
        #region Fields
        private static readonly string connString = $"{Security.Redis_Connection_Details.host},password={Security.Redis_Connection_Details.pword}";
        // ToDo: Figure out what to set this to... 5 Seconds just for testing
        private static readonly TimeSpan EXPIRATION = new TimeSpan(0, 0, 5);
        #endregion Fields

        /// <summary>
        /// Store a value in the database with a key. This value will expire in a set amount of time
        /// </summary>
        /// <param name="key">The key that will be used to obtain the value again</param>
        /// <param name="value">The value to store</param>
        public static async void SetStringWithExpiration(string key, string value)
        {
            using (ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(connString))
            {
                IDatabase database = redis.GetDatabase();
                await database.StringSetAsync(key, value, EXPIRATION);
            }
        }

        /// <summary>
        /// Get a value by key
        /// </summary>
        /// <param name="key">The key the value was stored with</param>
        /// <returns>The value associated to the key</returns>
        public static async Task<string> GetString(string key)
        {
            using (ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(connString))
            {
                IDatabase database = redis.GetDatabase();
                // The key is needed, reset the expiration on it
                await database.KeyExpireAsync(key, EXPIRATION);
                return await database.StringGetAsync(key);
            }
        }

        /// <summary>
        /// Check if the database contains a key
        /// </summary>
        /// <param name="key">The key to querywith</param>
        /// <returns>A boolean value wether the database contains that key</returns>
        public static async Task<bool> HasKey(string key)
        {
            using (ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(connString))
            {
                IDatabase database = redis.GetDatabase();
                return await database.KeyExistsAsync(key);
            }
        }
    }
}
