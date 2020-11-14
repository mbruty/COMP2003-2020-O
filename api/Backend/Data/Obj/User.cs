using api.Backend.Data.SQL.AutoSQL;

namespace api.Backend.Data.Obj
{
    public class User : Object
    {
        #region Fields

        public string Email, Password, Nickname;
        public int Id, YearOfBirth, CheckId;

        #endregion Fields

        #region Properties

        public FoodChecks FoodCheck
        {
            get { return Binding.GetTable<FoodChecks>().Select<FoodChecks>("id", this.CheckId)?[0]; }
        }

        public FoodOpinion[] FoodOpinions
        {
            get { return Binding.GetTable<FoodOpinion>().Select<FoodOpinion>("UserID", Id); }
        }

        public RestaurantOpinion[] Restaurantopinions
        {
            get { return Binding.GetTable<RestaurantOpinion>().Select<RestaurantOpinion>("UserID", Id); }
        }

        public Restaurant[] Restaurants
        {
            get { return Binding.GetTable<Restaurant>().Select<Restaurant>("OwnerID", Id); }
        }

        public Session Session
        {
            get { return Binding.GetTable<Session>().Select<Session>("UserId", Id)?[0]; }
        }

        public Visit[] Visits
        {
            get { return Binding.GetTable<Visit>().Select<Visit>("UserId", Id); }
        }

        #endregion Properties

        #region Methods

        public override bool Delete()
        {
            return base.Delete() && FoodCheck.Delete();
        }

        public override bool Insert(bool FetchInsertedIds = false)
        {
            FoodChecks foodChecks = new FoodChecks();
            foodChecks.Insert(true);

            this.CheckId = foodChecks.Id;

            return base.Insert(FetchInsertedIds);
        }

        #endregion Methods
    }
}