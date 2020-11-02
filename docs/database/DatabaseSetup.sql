Drop table if exists `Review`;
Drop table if exists `Visit`;
Drop table if exists `FoodOpinion`;
Drop table if exists `Opinion`;
Drop table if exists `MenuItemTags`;
Drop table if exists `MenuItem`;
Drop table if exists `FoodTags`;
Drop table if exists `Resturant`;
Drop table if exists `User`;
Drop table if exists `FoodChecks`;

create table `FoodChecks`(
	Id int unique auto_increment not null,
    primary key (Id),
    
	IsVegetarian bit default false,
	IsVegan bit default false,
	IsLactoseFree bit default true,
	IsNutFree bit default true,
	IsGlutenFree bit default false,
	IsEggFree bit default true,
	IsSoyFree bit default true,
	IsHallal bit default false,
	IsKosher bit default false
);

insert into `FoodChecks` values ();

create table `User` (
	Id int unique auto_increment not null,
    Email varchar(60) unique not null,
    check (Email like '%@%.%'),
    
	primary key(Id, Email),
    
    CheckId int not null,
    foreign key (CheckId) references `FoodChecks`(Id) on delete restrict on update cascade,
    
    `Password` varchar(110) not null,
    Nickname varchar(10) default 'User',
    check (Nickname REGEXP '[a-zA-Z]{3,}'),
    
    YearOfBirth int not null,
    check (YearOfBirth > 1900)
);

insert into `User` values (default,'o.d@g.c', 1, 'dsfds', 'john', 2001);

create table `Resturant` (
	Id int unique auto_increment not null,
	OwnerId int not null,
    foreign key (OwnerId) references `User`(Id) on delete restrict on update cascade,
    
    `Name` varchar(30) not null,
    `Description` varchar(120) not null,
    Longitude float not null,
    Latitude float not null,
    
    Phone varchar(11) ,
    check (Phone REGEXP '[0-9]{11}'),
    
    Email varchar(60),
    check (Email like '%@%.%'),
    
    Site varchar(60),
    check (Site like '%://%.%')
);

insert into `Resturant` values (default,1,'McD','Burger Place',1,1,'07586291060','o.d@g.c','https://mcd.com');

create table `MenuItem` (
	Id int unique auto_increment not null,
	primary key (Id),
    
	ResturantId int not null,
	CheckId int not null,
    foreign key (CheckId) references `FoodChecks`(Id) on delete restrict on update cascade,
    foreign key (ResturantId) references `Resturant`(Id) on delete restrict on update cascade,
    
    `Name` varchar(30) not null,
    `Description` varchar(120) not null,
    Price float not null
);

insert into `MenuItem` values (default, 1, 1, 'Burger', 'Some suspiscios meat', 0.99);

create table `FoodTags` (
	Id int unique auto_increment not null,
    Tag varchar(20) unique not null,
	primary key (Id, Tag),
    
    check (Tag REGEXP '[a-zA-Z]{3,}')
);

insert into `FoodTags` values (default, 'Burger');

create table `MenuItemTags` (
	MenuId int not null,
    FoodTagId int not null,
    primary key (MenuId, FoodTagId),
    foreign key (MenuId) references `MenuItem`(Id) on delete restrict on update cascade,
    foreign key (FoodTagId) references `FoodTags`(Id) on delete restrict on update cascade
);

insert into `MenuItemTags` values (1,1);

create table `FoodOpinion` (
	UserId int not null,
    FoodTagId int not null,
    primary key (UserId, FoodTagId),
    foreign key (UserId) references `User`(Id) on delete restrict on update cascade,
    foreign key (FoodTagId) references `FoodTags`(Id) on delete restrict on update cascade,
    
    SwipeRight int default 0,
    NeverShow bit default 0
);

insert into `FoodOpinion` values (1,1,2,default);

create table `Opinion` (
	UserId int not null,
	ResturantId int not null,
    primary key (UserId, ResturantId),
    foreign key (UserId) references `User`(Id) on delete restrict on update cascade,
    foreign key (ResturantId) references `Resturant`(Id) on delete restrict on update cascade,
    
    SwipeLeft int default 0,
    SwipeRight int default 0,
    NeverShow bit default 0
);

insert into `Opinion` values (1,1,default,default,default);

create table `Visit` (
	Id int unique auto_increment not null,
    primary key (Id),
    
	UserId int not null,
	ResturantId int not null,
    foreign key (UserId) references `User`(Id) on delete restrict on update cascade,
    foreign key (ResturantId) references `Resturant`(Id) on delete restrict on update cascade,
    
    GroupSize TinyInt not null,
    check (GroupSize>0),
    
	`Date` datetime default now()
);

insert into `Visit` values (default,1,1,4,default);

create table `Review` (
	VisitId int not null,
    foreign key (VisitId) references `Visit`(Id) on delete restrict on update cascade,
    
    Rating tinyint,
    check (Rating>0 AND Rating<=5)
);

insert into `Review` values (1,3);