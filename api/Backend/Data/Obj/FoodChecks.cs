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
            HasLactose = true,
            HasNuts = true,
            HasGluten = true,
            HasEgg = true,
            HasSoy = true;

        #endregion Fields
    }
}
