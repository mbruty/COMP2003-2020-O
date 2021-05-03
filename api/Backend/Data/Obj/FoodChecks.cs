namespace api.Backend.Data.Obj
{
    public class FoodChecks : Object
    {
        #region Fields

        public uint FoodCheckID;

        public bool IsVegetarian = false,
            IsVegan = false,
            IsHalal = false,
            IsKosher = false,
            HasLactose = false,
            HasNuts = false,
            HasGluten = false,
            HasEgg = false,
            HasSoy = false;

        #endregion Fields
    }
}
