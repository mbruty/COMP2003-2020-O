using System;
using System.Linq;

namespace api.Backend.Security
{
    public static class ValidityChecks
    {
        #region Methods

        public static bool IsStrongPassword(string pword)
        {
            return pword.Length > 6 && pword.Count(x => Char.IsDigit(x)) > 0 && pword.Count(x => !Char.IsLetterOrDigit(x)) > 0;
        }

        #endregion Methods
    }
}