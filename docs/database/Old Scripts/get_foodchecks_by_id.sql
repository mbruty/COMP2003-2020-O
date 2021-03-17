USE tat;
DROP PROCEDURE IF EXISTS get_foodchecks_by_id;
DELIMITER $$
CREATE PROCEDURE get_foodchecks_by_id (IN id INT)
BEGIN
    SELECT * FROM FoodChecks WHERE FoodCheckID = (SELECT FoodCheckID FROM User WHERE UserID = id);
END$$
DELIMITER ;
