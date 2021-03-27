using System;
using System.Linq;

namespace api.Backend.Security
{
    public static class ValidityChecks
    {
        #region Methods

        /// <summary>
        /// Checks if password is strong enough
        /// </summary>
        /// <param name="pword"> </param>
        /// <returns> </returns>
        public static bool IsStrongPassword(string pword)
        {
            return pword.Length > 6 && pword.Count(x => Char.IsDigit(x)) > 0 && pword.Count(x => !Char.IsLetterOrDigit(x)) > 0;
        }

        public static bool IsValidEmail(string email)
        {
            string[] halfs = email.Split('@');
            return halfs[1].Contains('.') && halfs[0].Length>0 && halfs[1].Length>2;
        }

        #endregion Methods
    }
}
