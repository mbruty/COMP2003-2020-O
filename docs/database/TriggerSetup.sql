/*
SQL Trigger Setup:
    The following script should create the necessary triggers associated with our project.
    It will delete triggers if they currently exist in the database.
    The triggers are explained within this comment bracket of the script.

    TGR_DeleteFoodItem removes a FoodCheck associated with a menu item to be removed.
    It's the only loose end that isn't covered currently by an ON DELETE CASCADE tag. Users currently cannot be deleted.
*/

DROP TRIGGER IF EXISTS TGR_DeleteFoodItem;

CREATE TRIGGER TGR_DeleteFoodItem
AFTER DELETE
ON `FoodItem` FOR EACH ROW
DELETE FROM `FoodChecks` WHERE FoodChecks.FoodCheckID = OLD.FoodCheckID;
