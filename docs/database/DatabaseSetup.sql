Drop table if exists `Review`;
Drop table if exists `Visit`;
Drop table if exists `RestaurantOpinion`;

DROP TABLE IF EXISTS `LinkMenuFood`;
DROP TABLE IF EXISTS `FoodItemTags`;
DROP TABLE IF EXISTS `FoodItem`;
DROP TABLE IF EXISTS `MenuTimes`;
DROP TABLE IF EXISTS `LinkMenuRestaurant`;
DROP TABLE IF EXISTS `Menu`;
DROP TABLE IF EXISTS `OpeningHours`;
DROP TABLE IF EXISTS `Days`;
DROP TABLE IF EXISTS `FoodOpinion`;
DROP TABLE IF EXISTS `FoodTags`;
DROP TABLE IF EXISTS `Restaurant`;
DROP TABLE IF EXISTS `Session`;
DROP TABLE IF EXISTS `User`;
DROP TABLE IF EXISTS `FoodChecks`;

CREATE TABLE `FoodChecks` (
	FoodCheckID INT NOT NULL AUTO_INCREMENT,

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
    CONSTRAINT UNQ_FoodChecks UNIQUE (FoodCheckID)
);

CREATE TABLE `User` (
    UserID INT NOT NULL AUTO_INCREMENT,
    Email VARCHAR(60) NOT NULL,
    FoodCheckID INT NOT NULL,
    `Password` VARCHAR(110) NOT NULL,
    Nickname VARCHAR(10) DEFAULT 'User',
    DateOfBirth DATE NOT NULL,

    PRIMARY KEY (UserID),
    CONSTRAINT UNQ_UserID UNIQUE (UserID),
    CONSTRAINT UNQ_UserEmail UNIQUE (Email),

    CONSTRAINT FK_FoodCheckInUser FOREIGN KEY (FoodCheckID) 
        REFERENCES FoodChecks(FoodCheckID) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_Email CHECK (Email LIKE '%@%.%'),
    CONSTRAINT CHK_Nickname CHECK (Nickname REGEXP '[a-zA-Z]{2,}'),
    CONSTRAINT CHK_DateOfBirth CHECK (DateOfBirth >= '1900-01-01')
);

CREATE TABLE `Session` (
    UserID INT NOT NULL,
    SignedIn DATETIME NOT NULL DEFAULT NOW(),
    AuthToken VARCHAR(110) NOT NULL,

    PRIMARY KEY (UserID),
    CONSTRAINT UNQ_SessionUserID UNIQUE (UserID),

    CONSTRAINT FK_UserInSession FOREIGN KEY (UserID)
        REFERENCES User(UserID) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `Restaurant` (
    RestaurantID INT NOT NULL AUTO_INCREMENT,
    OwnerID INT NOT NULL,
    RestaurantName NVARCHAR(60) NOT NULL,
    RestaurantDescription NVARCHAR(120) NOT NULL,
    Longitude FLOAT NOT NULL,
    Latitude FLOAT NOT NULL,
    Phone VARCHAR(11),
    Email VARCHAR(60),
    `Site` VARCHAR(60),

    PRIMARY KEY (RestaurantID),
    CONSTRAINT UNQ_RestaurantID UNIQUE (RestaurantID),

    CONSTRAINT FK_OwnerInRestaurant FOREIGN KEY (OwnerID)
        REFERENCES User(UserID) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_RestaurantLongitude CHECK (Longitude BETWEEN -180 AND 180),
    CONSTRAINT CHK_RestaurantLatitude CHECK (Latitude BETWEEN -90 AND 90),
    CONSTRAINT CHK_RestaurantPhone CHECK (Phone REGEXP '[0-9]{11}'),
    CONSTRAINT CHK_RestaurantEmail CHECK (Email LIKE '%@%.%'),
    CONSTRAINT CHK_RestaurantSite CHECK (`Site` LIKE '%://%.%')
);

CREATE TABLE `FoodTags` (
    FoodTagID INT NOT NULL AUTO_INCREMENT,
    Tag VARCHAR(20) NOT NULL,

    PRIMARY KEY (FoodTagID),
    CONSTRAINT UNQ_FoodTagID UNIQUE (FoodTagID),
    CONSTRAINT UNQ_FoodTag UNIQUE (Tag),

    CONSTRAINT CHK_Tag CHECK (Tag REGEXP '[a-z]{3,}')
);

CREATE TABLE `FoodOpinion` (
    UserID INT NOT NULL,
    FoodTagID INT NOT NULL,
    FOSwipeRight INT DEFAULT 0,
    FOSwipeLeft INT DEFAULT 0,
    NeverShow BIT NOT NULL DEFAULT 0,

    PRIMARY KEY (UserID, FoodTagID),
    CONSTRAINT UNQ_FoodOpinion UNIQUE (UserID, FoodTagID),

    CONSTRAINT FK_UserInFoodOpinion FOREIGN KEY (UserID)
        REFERENCES User(UserID) ON UPDATE CASCADE ON DELETE RESTRICT,
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
    RestaurantID INT NOT NULL,
    DayRef VARCHAR(5) NOT NULL,
    OpenTime TIME NOT NULL DEFAULT '08:00:00',
    CloseTime TIME NOT NULL DEFAULT '21:00:00',

    PRIMARY KEY (RestaurantID, DayRef),
    CONSTRAINT UNQ_OpeningHours UNIQUE (RestaurantID, DayRef),

    CONSTRAINT FK_RestaurantInOpeningHours FOREIGN KEY (RestaurantID)
        REFERENCES Restaurant(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_DayInOpeningHours FOREIGN KEY (DayRef)
        REFERENCES `Days`(DayRef) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_OpenTime CHECK (OpenTime BETWEEN '00:00:00' AND '24:00:00'),
    CONSTRAINT CHK_CloseTime CHECK (CloseTime BETWEEN '00:00:00' AND '24:00:00'),
    CONSTRAINT CHK_OpeningTimeRange CHECK (OpenTime < CloseTime)
);

CREATE TABLE `Menu` (
    MenuID INT NOT NULL AUTO_INCREMENT,
    MenuName VARCHAR(20) NOT NULL DEFAULT 'Menu',
    IsChildMenu BIT NOT NULL DEFAULT 0,

    PRIMARY KEY (MenuID),
    CONSTRAINT UNQ_Menu UNIQUE (MenuID)
);

CREATE TABLE `LinkMenuRestaurant` (
    MenuRestID INT NOT NULL AUTO_INCREMENT,
    MenuID INT NOT NULL,
    RestaurantID INT NOT NULL,
    AlwaysServe BIT NOT NULL DEFAULT 1,

    PRIMARY KEY (MenuRestID),
    CONSTRAINT UNQ_LinkMenuRestaurant UNIQUE (MenuID, RestaurantID),

    CONSTRAINT FK_MenuInMenuRestaurantLink FOREIGN KEY (MenuID)
        REFERENCES Menu(MenuID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_RestaurantInMenuRestaurantLink FOREIGN KEY (RestaurantID)
        REFERENCES Restaurant(RestaurantID) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE `MenuTimes` (
    MenuRestID INT NOT NULL,
    DayRef VARCHAR(5) NOT NULL,
    StartServing TIME NOT NULL,
    StopServing TIME NOT NULL,

    PRIMARY KEY (MenuRestID, DayRef),

    CONSTRAINT FK_MenuRestLinkInTimes FOREIGN KEY (MenuRestID)
        REFERENCES LinkMenuRestaurant(MenuRestID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_DaysInMenuTimes FOREIGN KEY (DayRef)
        REFERENCES `Days`(DayRef) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `FoodItem` (
    FoodID INT NOT NULL AUTO_INCREMENT,
    FoodCheckID INT NOT NULL,
    FoodName VARCHAR(45) NOT NULL,
    FoodDescription VARCHAR(120) NOT NULL,
    Price DECIMAL(8,2) NOT NULL DEFAULT 0.00,

    PRIMARY KEY (FoodID),

    CONSTRAINT FK_FoodCheckInFoodItem FOREIGN KEY (FoodCheckID)
        REFERENCES FoodChecks(FoodCheckID) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT CHK_FoodPrice CHECK (Price > 0.00)
);

CREATE TABLE `FoodItemTags` (
    FoodID INT NOT NULL,
    TagID INT NOT NULL,

    PRIMARY KEY (FoodID, TagID),

    CONSTRAINT FK_FoodInFoodItemTags FOREIGN KEY (FoodID)
        REFERENCES FoodItem(FoodID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_TagInFoodItemTags FOREIGN KEY (TagID)
        REFERENCES FoodTags(FoodTagID) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE `LinkMenuFood` (
    MenuID INT NOT NULL,
    FoodID INT NOT NULL,

    PRIMARY KEY (MenuID, FoodID),

    CONSTRAINT FK_MenuInMenuFoodLink FOREIGN KEY (MenuID)
        REFERENCES Menu(MenuID) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT FK_FoodInMenuFoodLink FOREIGN KEY (FoodID)
        REFERENCES FoodItem(FoodID) ON UPDATE CASCADE ON DELETE CASCADE
);






create table `RestaurantOpinion` (
	UserId int not null,
	ResturantId int not null,
    primary key (UserId, ResturantId),
    foreign key (UserId) references `User`(Id) on delete restrict on update cascade,
    foreign key (ResturantId) references `Restaurant`(Id) on delete restrict on update cascade,
    
    SwipeLeft int default 0,
    SwipeRight int default 0,
    NeverShow bit default 0
);

create table `Visit` (
	Id int unique auto_increment not null,
    primary key (Id),
    
	UserId int not null,
	ResturantId int not null,
    foreign key (UserId) references `User`(Id) on delete restrict on update cascade,
    foreign key (ResturantId) references `Restaurant`(Id) on delete restrict on update cascade,
    
    GroupSize TinyInt not null,
    check (GroupSize>0),
    
	`Date` datetime default now()
);

create table `Review` (
	VisitId int not null,
    primary key (VisitId),
    foreign key (VisitId) references `Visit`(Id) on delete restrict on update cascade,
    
    Rating tinyint,
    check (Rating>0 AND Rating<=5)
);