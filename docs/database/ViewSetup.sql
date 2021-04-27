DROP VIEW IF EXISTS FoodOpinionRightSwipePercent;
DROP VIEW IF EXISTS RestaurantMenuView;

DELIMITER //


CREATE VIEW FoodOpinionRightSwipePercent AS 
SELECT *, ((SwipeRight / TotalSwipes) * 2) AS RightSwipePercent 
FROM (SELECT *, (SwipeRight + SwipeLeft) AS TotalSwipes FROM `FoodOpinion`) t1 
ORDER BY UserID, RightSwipePercent DESC //


CREATE VIEW RestaurantMenuView AS
SELECT Restaurant.RestaurantID, Latitude, Longitude, MT.DayRef, MT.StartServing, MT.ServingFor, FC.*, FI.FoodID, FI.FoodName, M.IsChildMenu, FT.FoodTagID  FROM Restaurant
JOIN LinkMenuRestaurant LMR on Restaurant.RestaurantID = LMR.RestaurantID
JOIN Menu M on M.MenuID = LMR.MenuID
JOIN LinkMenuFood LMF on M.MenuID = LMF.MenuID
JOIN FoodItem FI on FI.FoodID = LMF.FoodID
JOIN FoodChecks FC on FI.FoodCheckID = FC.FoodCheckID
JOIN MenuTimes MT on LMR.MenuRestID = MT.MenuRestID
JOIN FoodItemTags FIT on FI.FoodID = FIT.FoodID
JOIN FoodTags FT on FT.FoodTagID = FIT.TagID //


DELIMITER ;