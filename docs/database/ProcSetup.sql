/*
SQL Procedure Setup:
    The following script should create the necessary stored procedures associated with our project.
    It will delete procedures if they currently exist in the database.
    The procedures are explained within this comment bracket of the script.

    Within this file, I've also kept the stored functions we'll be using too.
    They will also be deleted if they currently exist when this script is run into the database.


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

    Func-RandomSelection is a function used to select one random inserted data item from a list of them.
        - There is no array variable in MySQL; input a varchar string where each selectable value is proceeded by a $ symbol.
        - The function then does a lot of clever things and eventually returns one item from the makeshift list.

    Func-CountDelimiters is a function used to count how many times a $ symbol appears in a given string.
        - A string is inserted into the function.
        - An integer is outputted.
        - Only $ symbols are counted at this current time.
        - A fine piece of magic this one.
*/


-- TO DO: Implement best-practice error handling techniques into these SPs.


DROP PROCEDURE IF EXISTS `Run-RemoveUser`;
DROP PROCEDURE IF EXISTS `Run-PermaDeleteUser`;
DROP PROCEDURE IF EXISTS `Run-GenerateUserData`;

DROP FUNCTION IF EXISTS `Func-RandomSelection`;
DROP FUNCTION IF EXISTS `Func-CountDelimiters`;

DELIMITER //
CREATE PROCEDURE `Run-RemoveUser` (IN input_email VARCHAR(60)) -- TO DO: Deal with restaurant owner problem.
BEGIN
	UPDATE `User`
    SET Email = '-1', `Password` = '-1', Nickname = '-1', IsDeleted = 1, IsVerified = 0
    WHERE `User`.Email = input_email;
END //


CREATE PROCEDURE `Run-PermaDeleteUser` (IN input_id INT)
BEGIN
    DELETE FROM `User`
    WHERE UserID = input_id;
END //


CREATE PROCEDURE `Run-GenerateUserData` (IN input_quantity INT)
BEGIN

END //




CREATE FUNCTION `Func-RandomSelection` (select_these VARCHAR(MAX))
RETURNS VARCHAR(MAX)
DETERMINISTIC
BEGIN

END //


CREATE FUNCTION `Func-CountDelimiters` (input_string VARCHAR(MAX))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE delCount INT; -- Counter is declared here.
    SET delCount = (LENGTH(input_string) - LENGTH(REPLACE(input_string, "$", ""))); -- Counter is filled with a value equal to number of delimiters.
    RETURN delCount; -- Counter value is returned.
END //


DELIMITER ;
