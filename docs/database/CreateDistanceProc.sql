USE tat;
DROP PROCEDURE  IF EXISTS  get_restaurants_within_distance;
DELIMITER $$
CREATE PROCEDURE get_restaurants_within_distance(IN userLatitude FLOAT, IN userLongitude FLOAT, IN maxDistance INT, IN OrderDateRef VARCHAR(5), IN OrderTime TIME)
BEGIN
    DECLARE CurrentDayRef VARCHAR(5);
    DECLARE CurrentTime TIME;

    SELECT IFNULL(OrderTime, CURRENT_TIME()) INTO CurrentTime;
    SELECT IFNULL ((SELECT DayRef FROM Days WHERE DayRef=OrderDateRef), DayToRef(DAYOFWEEK(CURRENT_DATE()))) INTO CurrentDayRef;
    -- FROM https://stackoverflow.com/questions/29553895/querying-mysql-for-latitude-and-longitude-coordinates-that-are-within-a-given-mi
    SELECT RestaurantID, IsVegetarian, IsVegan, IsHalal, IsKosher, HasLactose, HasNuts, HasGluten, HasEgg, HasSoy, FoodID, FoodName, IsChildMenu, FoodTagID
    FROM RestaurantMenuView
    WHERE ( 3959 * acos( cos( radians(userLatitude) ) * cos( radians( Latitude ) )
        * cos( radians( Longitude ) - radians(userLongitude) ) + sin( radians(userLatitude) ) * sin(radians(Latitude)) ) ) < maxDistance
    AND ADDTIME(StartServing, TimeServing) > ADDTIME(CurrentTime, '1:00')
    AND DayRef=CurrentDayRef;
END $$
DELIMITER ;