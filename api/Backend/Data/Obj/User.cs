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

        public FoodChecks foodCheck
        {
            get { return Binding.GetTable<FoodChecks>().Select<FoodChecks>("id", this.CheckId)?[0]; }
        }

        public Visit[] visits
        {
            get { return Binding.GetTable<Visit>().Select<Visit>("UserId", Id); }
        }

        #endregion Properties
    }
}