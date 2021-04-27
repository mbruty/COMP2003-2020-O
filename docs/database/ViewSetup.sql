DROP VIEW IF EXISTS FoodOpinionRightSwipePercent;

DELIMITER //

CREATE VIEW FoodOpinionRightSwipePercent 
AS SELECT *, ((SwipeRight / TotalSwipes) * 2) AS RightSwipePercent 
FROM (SELECT *, (SwipeRight + SwipeLeft) AS TotalSwipes FROM `FoodOpinion`) t1 
ORDER BY UserID, RightSwipePercent DESC //

DELIMITER ;