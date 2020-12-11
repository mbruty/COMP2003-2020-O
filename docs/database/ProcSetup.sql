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

    Run-GenerateUserData will place random user records into the database.
        - Many users can be generated at once by inserting into the procedure how many you would like.
        - The email address, date of birth and nickname are randomly generated.
        - Email is unique and two of the same could be generated, however there are 22,580,726,450 combinations.
        - Password will always be Password1; it has been hashed in the database.
        - The associated FoodCheck will be the default.

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

    Func-GetEmailStarts is a function used to return our list of random email starting words.
        - Just a weird mix of words.
        - Every word is proceeded by a $ sign.
        - Feel free to add.
    
    Func-GetDomains is a function used to return our list of email domains.
        - These are all real domains.
        - Will be prefixed with a full stop eventually.
        - Feel free to add.

    Func-GetNicknames is a function used to return our list of nicknames.
        - Feel free to add.
        - Remember they are separated in a string by $ signs.
*/


-- TO DO: Implement best-practice error handling techniques into these SPs.


DROP PROCEDURE IF EXISTS `Run-RemoveUser`;
DROP PROCEDURE IF EXISTS `Run-PermaDeleteUser`;
DROP PROCEDURE IF EXISTS `Run-GenerateUserData`;

DROP FUNCTION IF EXISTS `Func-RandomSelection`;
DROP FUNCTION IF EXISTS `Func-CountDelimiters`;
DROP FUNCTION IF EXISTS `Func-RandomNumber`;
DROP FUNCTION IF EXISTS `Func-GetEmailStarts`;
DROP FUNCTION IF EXISTS `Func-GetDomains`;
DROP FUNCTION IF EXISTS `Func-GetNicknames`;



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


CREATE PROCEDURE `Run-GenerateUserData` (IN num_of_users INT)
BEGIN
    -- All our variables are declared first. We have to do this before the procedure gets underway.
    DECLARE list_of_email_starts_former VARCHAR(10000);
    DECLARE list_of_email_starts_latter VARCHAR(10000);
    DECLARE list_of_email_comps VARCHAR(10000);
    DECLARE list_of_email_domains VARCHAR(10000);
    DECLARE list_of_nicknames VARCHAR(10000);
    DECLARE data_email VARCHAR(60);
    DECLARE data_password VARCHAR(110);
    DECLARE data_nickname VARCHAR(10);
    DECLARE data_birthday VARCHAR(10);
    
    DECLARE loop_counter INT;

    -- Our lists of respective data items are fetched from their appropriate functions.
    SET list_of_email_starts_former = `Func-GetEmailStarts`();
    SET list_of_email_starts_latter = `Func-GetEmailStarts`();
    SET list_of_email_comps = `Func-GetEmailStarts`();
    SET list_of_email_domains = `Func-GetDomains`();
    SET list_of_nicknames = `Func-GetNicknames`();

    -- Loop counter is set to 0 before the loop starts.
    SET loop_counter = 0;

    -- Password isn't randomly generated; this is C# hashing our generic random user password: "Password1"
    SET data_password = '$s2$16384$8$1$BWKGGLGBwbZy9xn8SoaY9mnd9QOEdjYwchPA1bY5SJc=$p+gFRy0GH1Wrz++b46Waxy/QihPX+naXhx9+muUVuJ8=';

    gen_loop: LOOP

        -- If we hit the limit the admin wants then we can just end the procedure and, by extension, the loop.
        IF loop_counter = num_of_users THEN
            LEAVE gen_loop;
        END IF;

        -- Increase the loop counter by 1.
        SET loop_counter = loop_counter + 1;

        -- An email is pieced together using the CONCAT function. The format is: "[random_word].[random_word]@[randomword][randomword].[randomdomain]"
        SET data_email = CONCAT(`Func-RandomSelection`(list_of_email_starts_former), '.', `Func-RandomSelection`(list_of_email_starts_latter), '@', 
        `Func-RandomSelection`(list_of_email_comps), `Func-RandomSelection`(list_of_email_comps), '.', `Func-RandomSelection`(list_of_email_domains));

        -- A nickname is set randomly.
        SET data_nickname = `Func-RandomSelection`(list_of_nicknames);

        -- A date of birth is randomly generated using our random-number-gen function. The day values won't exceed 27 to ensure max compatability.
        SET data_birthday = CONCAT(`Func-RandomNumber`(1900, 2018), '-', `Func-RandomNumber`(1, 12), '-', `Func-RandomNumber`(1, 27));

        -- This is the MySQL command to insert data.
        INSERT INTO `User` (Email, `Password`, Nickname, DateOfBirth)
        VALUES (data_email, data_password, data_nickname, data_birthday);

    END LOOP;
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
        SET selected_item = SUBSTRING_INDEX(temp_truncated_list, '$', -1);
    ELSE
        SET selected_item = temp_truncated_list;
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



CREATE FUNCTION `Func-GetEmailStarts` ()
RETURNS VARCHAR(10000)
DETERMINISTIC
BEGIN
    DECLARE sending_info VARCHAR(10000);

    SET sending_info = 
    'joseph$paul$milky$forest$cranberry$tobias$entry$sales$cleaning$fishy$lana$knob$igloo$party$trousers$harold$bill$william$kate$alia$marge$kitty$wolf$conspiracy$andrew$millie$booty$clown$sexy$sly$garbage$henry$mike$oscar$jack$alex$reef$luke$shirley$creamy$gregor$animals$stub$crispy$indian$romania$finland$french$crazy$incredible$customer$rumor$rushing$barrel$mole$finished$dilemma$annual$overall$image$soul$digress$wet$tasty$tasteless$horny$kicking$wasp$max$fording$john$glados$kingsly$mary$sally$george$fred$paula$little$young$grandad$mother$bible$christmas$sweaty$gong$ninja$batman$hedge$vaginal$vertical$machar$davies$lakin$denman$bruty$mann$atkinson$jake$howell$megan$dyer$horoscope$direction$homosexual$manner$decorative$relative$syndrome$bark$cat$crosswalk$swarm$borrow$object$code$list$peace$lingering$urgent$gradual$69$420$large$promise$cropping$spectrum$shocking$dripping$boobs$coffee$dosage$destructive$related$old$keeping$house$swimming$turnip$lover$sitter$kisser$taster$';

    RETURN sending_info;
END //



CREATE FUNCTION `Func-GetDomains` ()
RETURNS VARCHAR(10000)
DETERMINISTIC
BEGIN
    DECLARE sending_info VARCHAR(10000);

    SET sending_info = 
    'com$org$int$net$edu$gov$mil$ac$ad$af$ar$bb$bd$br$bz$ca$ch$ci$cx$de$eg$eu$fr$ge$gr$ie$in$it$kp$li$lt$mc$me$ms$mx$no$ph$py$se$tz$uk$us$va$biz$builders$buzz$cloud$dance$eco$gle$life$lol$network$social$';

    RETURN sending_info;
END //



CREATE FUNCTION `Func-GetNicknames` ()
RETURNS VARCHAR(10000)
DETERMINISTIC
BEGIN
    DECLARE sending_info VARCHAR(10000);

    SET sending_info = 
    'Fiend$Axeman$GrimThing$Ryan$C$Gravy$Bottle$Timber$Kesh$FastMan$Superbad$Ginger$Jesus$Oscar$Alex$Reef$Jake$Mike$Jack$Lucky$Horse$Wagner$Jiles$Willow$Tim$X$River$Choco$Clubs$Hubby$Lola$Fingers$JK$Star$BowlingFan$Mario$Luigi$Bowser$Superman$Wondergirl$Pig$Susan$Dicky$Criminal$Legs$Chimney$Goats$Secular$Max$Jo$Joy$Kites$xXSadManXx$KillAll$Devil$Grogu$Mando$Luke$JackMach$Oliver$MoonMan$FishLad$TheJuice$Magical$Umm$Six$Katie$Bruv$Henry$Lovebird$Michael$Joan$Phil$Tommy$Mac$Sacks$Tulip$Firefly$ONION$GooGoo$lowercase$Townsy$Sim$Cam$';

    RETURN sending_info;
END //

DELIMITER ;
