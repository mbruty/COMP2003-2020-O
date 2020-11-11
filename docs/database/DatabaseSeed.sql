insert into `FoodChecks` values ();
insert into `FoodChecks` values ();

insert into `User` values (default,'oscar.davies@gmail.com', 1, 'dsfds', 'Oscar', 2001);
insert into `User` values (default,'hannah.alford@hotmail.co.uk', 2, 'dsfds', 'Hannah', 2002);

insert into `Resturant` values (default,1,'McD','Burger Place',1,1,'07586291060','mcd@gmail.com','https://mcd.com');
insert into `Resturant` values (default,2,'Dominos','Pizza Place',2,2,'12345678910','dominos@noreply.com','https://dolminos.com');

#Make Foods For McD
insert into `FoodChecks` values ();
insert into `FoodChecks` values ();

insert into `MenuItem` values (default, 1, 3, 'Baby Burger', 'Some suspiscios meat', 0.99);
insert into `MenuItem` values (default, 1, 4, 'Burger', 'Really odd meat', 9.99);

insert into `FoodTags` values (default, 'Burger');
insert into `FoodTags` values (default, 'Baby');

insert into `MenuItemTags` values (1,1);
insert into `MenuItemTags` values (1,2);

insert into `MenuItemTags` values (2,1);

#Make Foods For Dominos
insert into `FoodChecks` values ();
insert into `FoodChecks` values ();

insert into `MenuItem` values (default, 2, 5, 'Baby Pizza', 'Some suspiscios dough', 5.99);
insert into `MenuItem` values (default, 2, 6, 'Bi Daddy Pizza', 'Really odd toppings', 19.99);

insert into `FoodTags` values (default, 'Pizza');

insert into `MenuItemTags` values (3,3);
insert into `MenuItemTags` values (3,2);

insert into `MenuItemTags` values (4,3);

#Add Opinions

insert into `FoodOpinion` values (1,1,4,default);
insert into `FoodOpinion` values (1,2,2,default);
insert into `FoodOpinion` values (1,3,2,default);

insert into `FoodOpinion` values (2,1,1,default);
insert into `FoodOpinion` values (2,2,3,default);
insert into `FoodOpinion` values (2,3,4,default);


insert into `ResturantOpinion` values (1,1,2,2,default);
insert into `ResturantOpinion` values (1,2,1,2,default);

insert into `ResturantOpinion` values (2,1,1,1,default);
insert into `ResturantOpinion` values (2,2,3,2,default);

insert into `Visit` values (default,1,1,2,default);
insert into `Visit` values (default,1,2,4,default);

insert into `Visit` values (default,2,1,4,default);
insert into `Visit` values (default,2,2,3,default);

insert into `Review` values (1,4);
insert into `Review` values (4,3);