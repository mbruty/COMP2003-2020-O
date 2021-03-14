CREATE FUNCTION tat.DayToRef(dayNumber int)
RETURNS VARCHAR(5)
BEGIN
    RETURN CASE
               WHEN dayNumber = 1 THEN 'SUN'
               WHEN dayNumber = 2 THEN 'MON'
               WHEN dayNumber = 2 THEN 'TUES'
               WHEN dayNumber = 2 THEN 'WED'
               WHEN dayNumber = 2 THEN 'THURS'
               WHEN dayNumber = 2 THEN 'FRI'
               WHEN dayNumber = 2 THEN 'SAT'
        END;
END;