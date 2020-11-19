Drop table if exists `Review`;
Drop table if exists `Visit`;
Drop table if exists `FoodOpinion`;
Drop table if exists `RestaurantOpinion`;
Drop table if exists `MenuItemTags`;
Drop table if exists `MenuItem`;
Drop table if exists `FoodTags`;

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
    CONSTRAINT CHK_Nickname CHECK (Nickname REGEXP '[a-zA-Z]{3,}'),
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
)






create table `MenuItem` (
	Id int unique auto_increment not null,
	primary key (Id),
    
	ResturantId int not null,
	CheckId int not null,
    foreign key (CheckId) references `FoodChecks`(Id) on delete restrict on update cascade,
    foreign key (ResturantId) references `Restaurant`(Id) on delete restrict on update cascade,
    
    `Name` varchar(30) not null,
    `Description` varchar(120) not null,
    Price float not null
);

create table `FoodTags` (
	Id int unique auto_increment not null,
    Tag varchar(20) unique not null,
	primary key (Id, Tag),
    
    check (Tag REGEXP '[a-zA-Z]{3,}')
);

create table `MenuItemTags` (
	MenuId int not null,
    FoodTagId int not null,
    primary key (MenuId, FoodTagId),
    foreign key (MenuId) references `MenuItem`(Id) on delete restrict on update cascade,
    foreign key (FoodTagId) references `FoodTags`(Id) on delete restrict on update cascade
);

create table `FoodOpinion` (
	UserId int not null,
    FoodTagId int not null,
    primary key (UserId, FoodTagId),
    foreign key (UserId) references `User`(Id) on delete restrict on update cascade,
    foreign key (FoodTagId) references `FoodTags`(Id) on delete restrict on update cascade,
    
    SwipeRight int default 0,
    NeverShow bit default 0
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