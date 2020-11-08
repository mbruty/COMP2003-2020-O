using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace api.Backend.Security
{
    public static class ValidityChecks
    {
        public static bool IsStrongPassword(string pword)
        {
            return pword.Length > 6 && pword.Count(x=>Char.IsDigit(x))> 1 && pword.Count(x => !Char.IsLetterOrDigit(x)) > 1;
        }
    }
}
