USE tat;
DROP VIEW IF EXISTS  RestaurantMenuView;
CREATE VIEW RestaurantMenuView AS
    SELECT Restaurant.RestaurantID, Latitude, Longitude, MT.DayRef, MT.StartServing, MT.TimeServing, FC.*, FI.FoodID, FI.FoodName, FI.FoodNameShort, M.IsChildMenu, FT.FoodTagID  FROM Restaurant
    JOIN LinkMenuRestaurant LMR on Restaurant.RestaurantID = LMR.RestaurantID
    JOIN Menu M on M.MenuID = LMR.MenuID
    JOIN LinkMenuFood LMF on M.MenuID = LMF.MenuID
    JOIN FoodItem FI on FI.FoodID = LMF.FoodID
    JOIN FoodChecks FC on FI.FoodCheckID = FC.FoodCheckID
    JOIN MenuTimes MT on LMR.MenuRestID = MT.MenuRestID
    JOIN FoodItemTags FIT on FI.FoodID = FIT.FoodID
    JOIN FoodTags FT on FT.FoodTagID = FIT.TagID;