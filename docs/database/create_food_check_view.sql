use tat;
DROP VIEW IF EXISTS UserFoodCheckView;
CREATE VIEW UserFoodCheckView AS SELECT User.UserIDUserFoodCheckView, FoodChecks.* FROM tat.User JOIN tat.FoodChecks ON User.FoodCheckID = FoodChecks.FoodCheckID;#