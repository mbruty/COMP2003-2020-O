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
        - The list string cannot exceed 10,000 characters.
        - The function then does a lot of clever things and eventually returns one item from the makeshift list.
        - It uses the Func-CountDelimiters and Func-RandomNumber custom functions to achieve this; ensure they are present on the server.

    Func-CountDelimiters is a function used to count how many times a $ symbol appears in a given string.
        - A string is inserted into the function. This string's max length cannot exceed 10,000 characters.
        - An integer is outputted.
        - Only $ symbols are counted at this current time.
        - I'm very proud of this one.

    Func-RandomNumber is a function used to return a random integer value between a minimum and maximum (both inclusive).
        - You enter the min and the max.
        - A random value is selected between the two using mathematics magic.
*/


-- TO DO: Implement best-practice error handling techniques into these SPs.


DROP PROCEDURE IF EXISTS `Run-RemoveUser`;
DROP PROCEDURE IF EXISTS `Run-PermaDeleteUser`;
DROP PROCEDURE IF EXISTS `Run-GenerateUserData`;

DROP FUNCTION IF EXISTS `Func-RandomSelection`;
DROP FUNCTION IF EXISTS `Func-CountDelimiters`;
DROP FUNCTION IF EXISTS `Func-RandomNumber`;

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




CREATE FUNCTION `Func-RandomSelection` (select_these VARCHAR(10000))
RETURNS VARCHAR(10000)
DETERMINISTIC
BEGIN
    -- At the start of the function, we must declare all the variables we are to use throughout. Failure to do so will result in a problem.
    DECLARE item_count INT;
    DECLARE item_number INT;
    DECLARE temp_truncated_list VARCHAR(10000);
    DECLARE selected_item VARCHAR(10000);

    -- Here, we determine the number of items in this makeshift list and we assign the total to a variable called item_count.
    SET item_count = `Func-CountDelimiters`(select_these);

    -- Here, we randomly generate a number between 1 and the total number of items present in the makeshift list of items.
    SET item_number = `Func-RandomNumber`(1, item_count);

    -- At this stage, we truncate the list string at x delimiter, where x is the randomly generated value we got previously. Remember, the $ is our delimiter.
    SET temp_truncated_list = SUBSTRING_INDEX(select_these, '$', item_number);

    -- If the item selected is the first one, it is just returned, as it won't have any delimiters. Otherwise, remove the other items and return the randomly selected one.
    IF (`Func-CountDelimiters`(temp_truncated_list) > 0) THEN
        selected_item = SUBSTRING_INDEX(temp_truncated_list, '$', -1);
    ELSE
        selected_item = temp_truncated_list;
    END IF;

    -- This is the RETURN command.
    RETURN selected_item;
END //


CREATE FUNCTION `Func-CountDelimiters` (input_string VARCHAR(10000))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE del_count INT; -- Counter is declared here.

    SET del_count = (LENGTH(input_string) - LENGTH(REPLACE(input_string, "$", ""))); -- Counter is assigned a value equal to number of delimiters.

    RETURN del_count; -- Counter value is returned.
END //


CREATE FUNCTION `Func-RandomNumber` (min_val INT, max_val INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE gen_rand FLOAT; -- Declare the variable to assign random numbers to.
    DECLARE return_rand INT; -- Declare the variable to return random number.

    SET gen_rand = RAND(); -- Random number between 0 and 1 is generated.

    SET return_rand = ROUND(gen_rand * (max_val - min_val) + min_val); -- Number is converted to a useful whole number.

    RETURN return_rand; -- Return the final generated value.
END //


DELIMITER ;
