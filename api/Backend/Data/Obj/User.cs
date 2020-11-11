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

        public FoodChecks foodCheck
        {
            get { return Binding.GetTable<FoodChecks>().Select<FoodChecks>("id", this.CheckId)?[0]; }
        }

        public FoodOpinion[] foodopinions
        {
            get { return Binding.GetTable<FoodOpinion>().Select<FoodOpinion>("UserID", Id); }
        }

        public ResturantOpinion[] resturantopinions
        {
            get { return Binding.GetTable<ResturantOpinion>().Select<ResturantOpinion>("UserID", Id); }
        }

        public Resturant[] resturants
        {
            get { return Binding.GetTable<Resturant>().Select<Resturant>("OwnerID", Id); }
        }

        public Session session
        {
            get { return Binding.GetTable<Session>().Select<Session>("UserId", Id)?[0]; }
        }

        public Visit[] visits
        {
            get { return Binding.GetTable<Visit>().Select<Visit>("UserId", Id); }
        }

        #endregion Properties

        #region Methods

        public override bool Delete()
        {
            return base.Delete() && foodCheck.Delete();
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