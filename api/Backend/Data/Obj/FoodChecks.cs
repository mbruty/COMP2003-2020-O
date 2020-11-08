namespace api.Backend.Data.Obj
{
    public class FoodChecks : Object
    {
        #region Fields

        public int Id;
        public bool IsVegetarian, IsVegan, ContainsLactose, ContainsNut, ContainsGluten, ContainsEgg, ContainsSoy, IsHallal, IsKosher;

        #endregion Fields
    }
}