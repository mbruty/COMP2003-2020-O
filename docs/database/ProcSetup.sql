/*
SQL Procedure Setup:
    The following script should create the necessary stored procedures associated with our project.
    It will delete procedures if they currently exist in the database.
    The procedures are explained within this comment bracket of the script.

    Run-RemoveUser is a substitute for deleting a user record. Since we do not allow direct removal, this will do a few things:
        - Sets IsDeleted to true.
        - Eliminates all sensitive data.
        - Keep data integrity in-tact.
        - Must enter the email associated with the user you wish to delete.

    Run-PermaDeleteUser is the definitive SP for outright deleting a user and all associated records.
        - High level of danger so reccomeded devs use Run-RemoveUser.
        - Does not work on a user if they own a restaurant.
        - All other records will be eliminated via a simple ON DELETE CASCADE command.
        - For safety purposes, you must enter the user's database ID.
*/

DROP PROCEDURE IF EXISTS `Run-RemoveUser`;
DROP PROCEDURE IF EXISTS `Run-PermaDeleteUser`;

DELIMITER //
CREATE PROCEDURE `Run-RemoveUser` (IN input_email VARCHAR(60)) -- TO DO: Implement best-practice error handling techniques into this SP & deal with restaurant owner problem.
BEGIN
	UPDATE `User`
    SET Email = '-1', `Password` = '-1', Nickname = '-1', IsDeleted = 1, IsVerified = 0
    WHERE `User`.Email = input_email;
END //


CREATE PROCEDURE `Run-PermaDeleteUser` (IN input_id INT) -- TO DO: Implement best-practice error handling techniques into this SP.
BEGIN
    DELETE FROM `User`
    WHERE UserID = input_id;
END //


DELIMITER ;
