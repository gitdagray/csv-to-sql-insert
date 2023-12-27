export const testInputData =
    'id,description,entryDate,location,rate,isActive\n\
1,American Farms,2023-11-17 00:00:00.000,New York,0.05,1\n\
2,Beatles,2023-11-01 00:00:00.000,NULL,0.01,0\n\
3,True Licensing,2023-12-02 00:00:00.000,NULL,0.25,1\n\
4,1 100,2023-12-10 00:00:00.000,Chicago,0.5,1\n\
6,"Smith, John",2023-10-03 00:00:00.000,Dallas,0.35,1\n\
7,"Brown, Esq., John",2023-06-01 00:00:00.000,Finland,0.05,1\n\
8,Merry Merry Christmas,2023-01-01 00:00:00.000,NULL,0,1\n\
9,another entry,2023-03-24 00:00:00.000,NULL,1.05,0\n\
10,42,2023-04-01 00:00:00.000,London,0.2,1'

export const expectedOutput =
    'INSERT INTO test (id, description, entryDate, location, rate, isActive)\n\
VALUES\n\
\t(1, "American Farms", "2023-11-17 00:00:00.000", "New York", 0.05, 1),\n\
\t(2, "Beatles", "2023-11-01 00:00:00.000", NULL, 0.01, 0),\n\
\t(3, "True Licensing", "2023-12-02 00:00:00.000", NULL, 0.25, 1),\n\
\t(4, "1 100", "2023-12-10 00:00:00.000", "Chicago", 0.5, 1),\n\
\t(6, "Smith, John", "2023-10-03 00:00:00.000", "Dallas", 0.35, 1),\n\
\t(7, "Brown, Esq., John", "2023-06-01 00:00:00.000", "Finland", 0.05, 1),\n\
\t(8, "Merry Merry Christmas", "2023-01-01 00:00:00.000", NULL, 0, 1),\n\
\t(9, "another entry", "2023-03-24 00:00:00.000", NULL, 1.05, 0),\n\
\t(10, 42, "2023-04-01 00:00:00.000", "London", 0.2, 1);'
