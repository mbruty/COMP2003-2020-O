/*
SQL Procedure Setup:
    The following script should create the necessary stored procedures associated with our project.
    It will delete procedures if they currently exist in the database.
    The procedures are explained within this comment bracket of the script.

    Run-RemoveUser is a substitute for deleting a user record. Since we do not allow direct removal, this will do a few things:
        - Sets IsDeleted to true.
        - Eliminates all sensitive data.
        - Keep data integrity in-tact.
*/

DROP PROCEDURE IF EXISTS `Run-RemoveUser`;

DELIMITER //
CREATE PROCEDURE `Run-RemoveUser` (IN input_email VARCHAR(60)) -- TO DO: Implement best-practice error handling techniques into this SP.
BEGIN
	UPDATE `User`
    SET Email = '-1', `Password` = '-1', Nickname = '-1', IsDeleted = 1
    WHERE `User`.Email = input_email;
END //
DELIMITER ;
