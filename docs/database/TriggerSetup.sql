/*
SQL Trigger Setup:
    The following script should create the necessary triggers associated with our project.
    It will delete triggers if they currently exist in the database.
    The triggers are explained within this comment bracket of the script.

    TGR_DeleteFoodItem removes a FoodCheck associated with a menu item to be removed.
    It's the only loose end that isn't covered currently by an ON DELETE CASCADE tag. Users currently cannot be deleted.

    TRG_InsertUser automatically assigns a default FoodCheck to a newly created user.
    
    TGR_InsertFoodItem responds similarly to its InsertUser counterpart.
*/

DROP TRIGGER IF EXISTS TGR_DeleteFoodItem;
DROP TRIGGER IF EXISTS TGR_InsertUser;
DROP TRIGGER IF EXISTS TGR_InsertFoodItem;

CREATE TRIGGER TGR_DeleteFoodItem
AFTER DELETE ON `FoodItem` 
FOR EACH ROW
DELETE FROM `FoodChecks` WHERE FoodChecks.FoodCheckID = OLD.FoodCheckID;


DELIMITER //
CREATE TRIGGER TGR_InsertUser
BEFORE INSERT ON `User` 
FOR EACH ROW
BEGIN
	INSERT INTO FoodChecks (FoodCheckID)
    VALUES (DEFAULT);
    
    SET NEW.FoodCheckID = LAST_INSERT_ID();
END //


CREATE TRIGGER TGR_InsertFoodItem
BEFORE INSERT ON `FoodItem` 
FOR EACH ROW
BEGIN
	INSERT INTO FoodChecks (FoodCheckID)
    VALUES (DEFAULT);
    
    SET NEW.FoodCheckID = LAST_INSERT_ID();
END //

DELIMITER ;
