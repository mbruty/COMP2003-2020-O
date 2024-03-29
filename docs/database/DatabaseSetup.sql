DROP TABLE IF EXISTS `Review`;
DROP TABLE IF EXISTS `Visit`;
DROP TABLE IF EXISTS `RestaurantOpinion`;
DROP TABLE IF EXISTS `LinkMenuFood`;
DROP TABLE IF EXISTS `FoodItemTags`;
DROP TABLE IF EXISTS `SwipeData`;
DROP TABLE IF EXISTS `LinkCategoryFood`;
DROP TABLE IF EXISTS `FoodItem`;
DROP TABLE IF EXISTS `MenuTimes`;
DROP TABLE IF EXISTS `LinkMenuRestaurant`;
DROP TABLE IF EXISTS `Menu`;
DROP TABLE IF EXISTS `OpeningHours`;
DROP TABLE IF EXISTS `Days`;
DROP TABLE IF EXISTS `FoodOpinion`;
DROP TABLE IF EXISTS `FoodTags`;
DROP TABLE IF EXISTS `RestaurantVerification`;
DROP TABLE IF EXISTS `Restaurant`;
DROP TABLE IF EXISTS `CommunityTagResponse`;
DROP TABLE IF EXISTS `RAdminSession`;
DROP TABLE IF EXISTS `Category`;
DROP TABLE IF EXISTS `TagSuggestions`;
DROP TABLE IF EXISTS `RestaurantAdmin`;
DROP TABLE IF EXISTS `Session`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `FoodChecks`;

CREATE TABLE `FoodChecks` (
	FoodCheckID INT UNSIGNED NOT NULL AUTO_INCREMENT,

    IsVegetarian BIT NOT NULL DEFAULT 0,
    IsVegan BIT NOT NULL DEFAULT 0,
    IsHalal BIT NOT NULL DEFAULT 0,
    IsKosher BIT NOT NULL DEFAULT 0,
    HasLactose BIT NOT NULL DEFAULT 1,
    HasNuts BIT NOT NULL DEFAULT 1,
    HasGluten BIT NOT NULL DEFAULT 1,
    HasEgg BIT NOT NULL DEFAULT 1,
    HasSoy BIT NOT NULL DEFAULT 1,

    PRIMARY KEY (FoodCheckID),

    CONSTRAINT CHK_KosherHalalConflict CHECK (((IsHalal = 1) AND (IsKosher = 1)) != 1),
    CONSTRAINT CK_VeganVegetarianConflict CHECK (((IsVegan = 1) AND (IsVegetarian = 0)) != 1)
);

CREATE TABLE `User` (
    UserID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    Email VARCHAR(60) NOT NULL,
    FoodCheckID INT UNSIGNED NOT NULL,
    `Password` VARCHAR(110) NOT NULL,
    Nickname VARCHAR(10) DEFAULT 'User',
    DateOfBirth DATE NOT NULL,
    IsDeleted BIT NOT NULL DEFAULT 0,
    IsVerified BIT NOT NULL DEFAULT 0,
    pushToken CHAR(22),

    PRIMARY KEY (UserID),
    CONSTRAINT UNQ_UserEmail UNIQUE (Email),

    CONSTRAINT FK_FoodCheckInUser FOREIGN KEY (FoodCheckID) 
        REFERENCES FoodChecks(FoodCheckID) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_Email CHECK ((Email LIKE '%@%.%') OR (Email = '-1')),
    CONSTRAINT CHK_Nickname CHECK ((Nickname REGEXP '[a-zA-Z]{1,}') OR (Nickname = '-1')),
    CONSTRAINT CHK_DateOfBirth CHECK (DateOfBirth >= '1900-01-01')
);

CREATE TABLE `Session` (
    UserID INT UNSIGNED NOT NULL,
    SignedIn DATETIME NOT NULL DEFAULT NOW(),
    AuthToken VARCHAR(110) NOT NULL,

    PRIMARY KEY (UserID),

    CONSTRAINT FK_UserInSession FOREIGN KEY (UserID)
        REFERENCES User(UserID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `RestaurantAdmin` (
    RAdminID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    Email VARCHAR(60) NOT NULL,
    `Password` VARCHAR(110) NOT NULL,
    IsVerified BIT NOT NULL DEFAULT 0,
    DashLayout VARCHAR(64),

    PRIMARY KEY (RAdminID),
    CONSTRAINT UNQ_UserEmail UNIQUE (Email),

    CONSTRAINT CHK_AdminEmail CHECK ((Email LIKE '%@%.%') OR (Email = '-1'))
);

CREATE TABLE `TagSuggestions` (
    SuggestionID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    Tag VARCHAR(20) NOT NULL,
    DateAdded DATE,
    OwnerID INT UNSIGNED NOT NULL,

    PRIMARY KEY (SuggestionID),
    CONSTRAINT UNQ_FoodTag UNIQUE (Tag),

    CONSTRAINT CHK_SuggestedTag CHECK (Tag REGEXP '[a-z]{3,}'),
    CONSTRAINT FK_AdminInSuggestions FOREIGN KEY (OwnerID)
        REFERENCES RestaurantAdmin(RAdminID) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `Category` (
    CategoryID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    CatName VARCHAR(30) NOT NULL,
    OwnerID INT UNSIGNED NOT NULL,

    PRIMARY KEY (CategoryID),

    CONSTRAINT FK_AdminInCategory FOREIGN KEY (CategoryID)
        REFERENCES RestaurantAdmin(RAdminID) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `RAdminSession` (
    RAdminID INT UNSIGNED NOT NULL,
    SignedIn DATETIME NOT NULL DEFAULT NOW(),
    AuthToken VARCHAR(110) NOT NULL,

    PRIMARY KEY (RAdminID),

    CONSTRAINT FK_AdminInSession FOREIGN KEY (RAdminID)
        REFERENCES RestaurantAdmin(RAdminID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `CommunityTagResponse` (
    RAdminID INT UNSIGNED NOT NULL,
    SuggestionID INT UNSIGNED NOT NULL,
    Upvote BIT NOT NULL,

    PRIMARY KEY (RAdminID, SuggestionID),

    CONSTRAINT FK_AdminInTagResponse FOREIGN KEY (RAdminID)
        REFERENCES RestaurantAdmin(RAdminID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_TagInTagResponse FOREIGN KEY (SuggestionID)
        REFERENCES TagSuggestions(SuggestionID) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE `Restaurant` (
    RestaurantID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    OwnerID INT UNSIGNED NOT NULL,
    RestaurantName CHAR(60) CHARACTER SET UTF8MB4 NOT NULL, -- Prev. NVARCHAR(60)
    RestaurantDescription CHAR(120) CHARACTER SET UTF8MB4 NOT NULL, -- Prev. NVARCHAR(120)
    Longitude FLOAT NOT NULL,
    Latitude FLOAT NOT NULL,
    Phone VARCHAR(11),
    Email VARCHAR(60),
    `Site` VARCHAR(60),
    IsVerified BIT NOT NULL DEFAULT 0,
    Street1 VARCHAR(45),
    Street2 VARCHAR(45),
    Town VARCHAR(30),
    County VARCHAR(30),
    Postcode VARCHAR(8),

    PRIMARY KEY (RestaurantID),

    CONSTRAINT FK_OwnerInRestaurant FOREIGN KEY (OwnerID)
        REFERENCES RestaurantAdmin(RAdminID) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_RestaurantLongitude CHECK (Longitude BETWEEN -180 AND 180),
    CONSTRAINT CHK_RestaurantLatitude CHECK (Latitude BETWEEN -90 AND 90),
    CONSTRAINT CHK_RestaurantPhone CHECK (Phone REGEXP '[0-9]{11}'),
    CONSTRAINT CHK_RestaurantEmail CHECK (Email LIKE '%@%.%'),
    CONSTRAINT CHK_RestaurantSite CHECK (`Site` LIKE '%.%')
);

CREATE TABLE `RestaurantVerification` (
    RestaurantID INT UNSIGNED NOT NULL,
    QRCode VARCHAR(200) NOT NULL,

    PRIMARY KEY (RestaurantID),

    CONSTRAINT FK_RestaurantInVerification FOREIGN KEY (RestaurantID)
        REFERENCES Restaurant(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `FoodTags` (
    FoodTagID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    Tag VARCHAR(20) NOT NULL,
    DateAdded DATE,

    PRIMARY KEY (FoodTagID),
    CONSTRAINT UNQ_FoodTag UNIQUE (Tag),

    CONSTRAINT CHK_Tag CHECK (Tag REGEXP '[a-z]{3,}')
);

CREATE TABLE `FoodOpinion` (
    UserID INT UNSIGNED NOT NULL,
    FoodTagID INT UNSIGNED NOT NULL,
    SwipeRight INT UNSIGNED DEFAULT 0,
    SwipeLeft INT UNSIGNED DEFAULT 0,
    Favourite BIT NOT NULL DEFAULT 0,
    NeverShow BIT NOT NULL DEFAULT 0,

    PRIMARY KEY (UserID, FoodTagID),

    CONSTRAINT FK_UserInFoodOpinion FOREIGN KEY (UserID)
        REFERENCES User(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_TagInFoodOpinion FOREIGN KEY (FoodTagID)
        REFERENCES FoodTags(FoodTagID) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `Days` (
    DayRef VARCHAR(5) NOT NULL,
    DayName VARCHAR(20) NOT NULL,

    PRIMARY KEY (DayRef),
    CONSTRAINT UNQ_Days UNIQUE (DayName)
);

CREATE TABLE `OpeningHours` (
    RestaurantTimeID INT UNSIGNED NOT NULL,
    RestaurantID INT UNSIGNED NOT NULL,
    DayRef VARCHAR(5) NOT NULL,
    OpenTime TIME NOT NULL DEFAULT '08:00:00',
    Duration TIME NOT NULL DEFAULT '14:00:00',

    PRIMARY KEY (RestaurantTimeID),

    CONSTRAINT FK_RestaurantInOpeningHours FOREIGN KEY (RestaurantID)
        REFERENCES Restaurant(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_DayInOpeningHours FOREIGN KEY (DayRef)
        REFERENCES `Days`(DayRef) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_OpenTime CHECK (OpenTime BETWEEN '00:00:00' AND '24:00:00'),
    CONSTRAINT CHK_Duration CHECK (Duration > '00:00:00')
);

CREATE TABLE `Menu` (
    MenuID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    MenuName VARCHAR(20) NOT NULL DEFAULT 'Menu',
    IsChildMenu BIT NOT NULL DEFAULT 0,

    PRIMARY KEY (MenuID)
);

CREATE TABLE `LinkMenuRestaurant` (
    MenuRestID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    MenuID INT UNSIGNED NOT NULL,
    RestaurantID INT UNSIGNED NOT NULL,
    AlwaysServe BIT NOT NULL DEFAULT 1,
    IsActive BIT NOT NULL DEFAULT 0,

    PRIMARY KEY (MenuRestID),
    CONSTRAINT UNQ_LinkMenuRestaurant UNIQUE (MenuID, RestaurantID),

    CONSTRAINT FK_MenuInMenuRestaurantLink FOREIGN KEY (MenuID)
        REFERENCES Menu(MenuID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_RestaurantInMenuRestaurantLink FOREIGN KEY (RestaurantID)
        REFERENCES Restaurant(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `MenuTimes` (
    MenuTimeID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    MenuRestID INT UNSIGNED NOT NULL,
    DayRef VARCHAR(5) NOT NULL,
    StartServing TIME NOT NULL,
    ServingFor TIME NOT NULL,

    PRIMARY KEY (MenuTimeID),

    CONSTRAINT FK_MenuRestLinkInTimes FOREIGN KEY (MenuRestID)
        REFERENCES LinkMenuRestaurant(MenuRestID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_DaysInMenuTimes FOREIGN KEY (DayRef)
        REFERENCES `Days`(DayRef) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_ServingFor CHECK (ServingFor > '00:00:00')
);

CREATE TABLE `FoodItem` (
    FoodID INT UNSIGNED NOT NULL AUTO_INCREMENT,
    FoodCheckID INT UNSIGNED NOT NULL,
    Creator INT UNSIGNED NOT NULL,
    FoodName VARCHAR(60) NOT NULL,
    FoodNameShort VARCHAR(20),
    FoodDescription VARCHAR(120) NOT NULL,
    Price DECIMAL(6,2) NOT NULL DEFAULT 1.00,

    PRIMARY KEY (FoodID),

    CONSTRAINT FK_FoodCheckInFoodItem FOREIGN KEY (FoodCheckID)
        REFERENCES FoodChecks(FoodCheckID) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT FK_AdminInFoodItem FOREIGN KEY (Creator)
        REFERENCES RestaurantAdmin(RAdminID) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_FoodPrice CHECK (Price > 0.00)
);

CREATE TABLE `LinkCategoryFood` (
    CategoryID INT UNSIGNED NOT NULL,
    FoodID INT UNSIGNED NOT NULL,

    PRIMARY KEY (CategoryID, FoodID),

    CONSTRAINT FK_CategoryInCategoryFoodLink FOREIGN KEY (CategoryID)
        REFERENCES Category(CategoryID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_FoodInCategoryFoodLink FOREIGN KEY (FoodID)
        REFERENCES FoodItem(FoodID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `SwipeData` (
    FoodID INT UNSIGNED NOT NULL,
    SwipeDate DATE NOT NULL,
    RightSwipes INT,
    LeftSwipes INT,

    PRIMARY KEY (FoodID, SwipeDate),

    CONSTRAINT FK_FoodInSwipeData FOREIGN KEY (FoodID)
        REFERENCES FoodItem(FoodID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `FoodItemTags` (
    FoodID INT UNSIGNED NOT NULL,
    TagID INT UNSIGNED NOT NULL,

    PRIMARY KEY (FoodID, TagID),

    CONSTRAINT FK_FoodInFoodItemTags FOREIGN KEY (FoodID)
        REFERENCES FoodItem(FoodID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_TagInFoodItemTags FOREIGN KEY (TagID)
        REFERENCES FoodTags(FoodTagID) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `LinkMenuFood` (
    MenuID INT UNSIGNED NOT NULL,
    FoodID INT UNSIGNED NOT NULL,

    PRIMARY KEY (MenuID, FoodID),

    CONSTRAINT FK_MenuInMenuFoodLink FOREIGN KEY (MenuID)
        REFERENCES Menu(MenuID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_FoodInMenuFoodLink FOREIGN KEY (FoodID)
        REFERENCES FoodItem(FoodID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `RestaurantOpinion` (
    UserID INT UNSIGNED NOT NULL,
    RestaurantID INT UNSIGNED NOT NULL,
    SwipeRight INT UNSIGNED NOT NULL DEFAULT 0,
    SwipeLeft INT UNSIGNED NOT NULL DEFAULT 0,
    NeverShow BIT NOT NULL DEFAULT 0,

    PRIMARY KEY (UserID, RestaurantID),

    CONSTRAINT FK_UserInRestaurantOpinion FOREIGN KEY (UserID)
        REFERENCES User(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_RestaurantInRestaurantOpinion FOREIGN KEY (RestaurantID)
        REFERENCES Restaurant(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `Visit` (
    VisitRef INT UNSIGNED NOT NULL AUTO_INCREMENT,
    RestaurantID INT UNSIGNED NOT NULL,
    UserID INT UNSIGNED NOT NULL,
    DateOfVisit DATETIME NOT NULL DEFAULT NOW(),
    GroupSize TINYINT UNSIGNED NOT NULL DEFAULT 1,

    PRIMARY KEY (VisitRef),

    CONSTRAINT FK_UserInVisit FOREIGN KEY (UserID)
        REFERENCES User(UserID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_RestaurantInVisit FOREIGN KEY (RestaurantID)
        REFERENCES Restaurant(RestaurantID) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_GroupSize CHECK (GroupSize > 0)
);

CREATE TABLE `Review` (
    VisitRef INT UNSIGNED NOT NULL,
    Rating TINYINT UNSIGNED NOT NULL,

    PRIMARY KEY (VisitRef),

    CONSTRAINT FK_VisitInReview FOREIGN KEY (VisitRef)
        REFERENCES Visit(VisitRef) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT CHK_Rating CHECK (Rating BETWEEN 0 AND 10)
);








/*
SQL Trigger Setup:
    The following script should create the necessary triggers associated with our project.
    It will delete triggers if they currently exist in the database.
    The triggers are explained within this comment bracket of the script.

    TGR_DeleteUser removes the FoodCheck associated with the user to be removed.
        - Please read documentation for details on removing users.
    
    TGR_DeleteFoodItem removes the FoodCheck associated with the menu item to be removed.

    TRG_InsertUser automatically assigns a default FoodCheck to a newly created user.
    
    TGR_InsertFoodItem responds similarly to its InsertUser counterpart by creating a default FoodCheck.
*/

DROP TRIGGER IF EXISTS TGR_DeleteUser;
DROP TRIGGER IF EXISTS TGR_DeleteFoodItem;
DROP TRIGGER IF EXISTS TGR_InsertUser;
DROP TRIGGER IF EXISTS TGR_InsertFoodItem;


CREATE TRIGGER TGR_DeleteUser
AFTER DELETE ON `User` 
FOR EACH ROW
DELETE FROM `FoodChecks` WHERE FoodChecks.FoodCheckID = OLD.FoodCheckID;


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

