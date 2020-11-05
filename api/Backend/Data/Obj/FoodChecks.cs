namespace api.Backend.Data.Obj
{
    public class FoodChecks : Backend.Data.SQL.Object
    {
        #region Fields

        public int Id;
        public bool IsVegetarian, IsVegan, ContainsLactose, ContainsNut, IsGlutenFree, ContainsEgg, ContainsSoy, IsHallal, IsKosher;

        #endregion Fields
    }
}