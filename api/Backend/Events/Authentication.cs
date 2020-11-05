using api.Backend.Endpoints;
using System.Collections.Specialized;
using api.Backend.Data.Obj;
using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Events
{
    public static class Authentication
    {
        [WebEvent("/signup", "POST", false)]
        public static void TestWebRequest(NameValueCollection headers, string Data, ref WebRequest.HttpResponse response)
        {
            string email = headers["email"], password = headers["password"], yearOfBirth = headers["yearOfBirth"];

            if (email == null || password == null)
            {
                response.StatusCode = 401;
                response.AddToData("Error", "Missing email or password");
                return;
            }

            User[] users = Binding.GetTable<User>().Select<User>("email", email);

            if (users.Length > 0)
            {
                response.StatusCode = 401;
                response.AddToData("Error", "Email is in use");
                return;
            }

            User user = new User();
            user.Email = email; user.Password = Security.Hashing.Hash(password);

            if (!int.TryParse(yearOfBirth, out user.YearOfBirth))
            {
                response.StatusCode = 401;
                response.AddToData("Error", "Year of Birth is invalid");
                return;
            }

            FoodChecks foodChecks = new FoodChecks();
            foodChecks.Insert(true);

            user.CheckId = foodChecks.Id;

            user.Insert();

            response.StatusCode = 200;
            response.AddToData("Message", "Signed Up");
        }
    }
}
