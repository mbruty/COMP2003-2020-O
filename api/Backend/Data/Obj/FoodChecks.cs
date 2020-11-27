namespace api.Backend.Data.Obj
{
    public class FoodChecks : Object
    {
        public uint FoodCheckID;

        public bool IsVegetarian = false,
            IsVegan = false,
            IsHalal = false,
            IsKosher,
            HasLactose,
            HasNuts,
            HasGluten,
            HasEgg,
            HasSoy;
    }
}
