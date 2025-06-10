# Справочник SQL

## Основные команды

### DDL (Data Definition Language)

#### CREATE TABLE
```sql
CREATE TABLE table_name (
    column1 datatype constraint,
    column2 datatype constraint,
    ...
);
```

#### ALTER TABLE
```sql
ALTER TABLE table_name 
ADD COLUMN column_name datatype;

ALTER TABLE table_name 
DROP COLUMN column_name;

ALTER TABLE table_name 
MODIFY COLUMN column_name new_datatype;
```

#### DROP TABLE
```sql
DROP TABLE table_name;
```

### DML (Data Manipulation Language)

#### SELECT
```sql
SELECT column1, column2, ...
FROM table_name
WHERE condition
GROUP BY column1, column2, ...
HAVING condition
ORDER BY column1, column2, ...
LIMIT number;
```

#### INSERT
```sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
```

#### UPDATE
```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

#### DELETE
```sql
DELETE FROM table_name
WHERE condition;
```

## Типы данных PostgreSQL

### Числовые типы
- `INTEGER` / `INT` - целое число
- `BIGINT` - большое целое число
- `DECIMAL(p,s)` / `NUMERIC(p,s)` - точное число
- `REAL` / `FLOAT4` - число с плавающей точкой
- `DOUBLE PRECISION` / `FLOAT8` - двойная точность

### Символьные типы
- `CHAR(n)` - строка фиксированной длины
- `VARCHAR(n)` - строка переменной длины
- `TEXT` - строка неограниченной длины

### Типы дата/время
- `DATE` - дата
- `TIME` - время
- `TIMESTAMP` - дата и время
- `TIMESTAMPTZ` - дата и время с часовым поясом

### Другие типы
- `BOOLEAN` - логический тип
- `UUID` - уникальный идентификатор
- `JSON` / `JSONB` - JSON данные
- `ARRAY` - массив

## Функции

### Агрегатные функции
- `COUNT(*)` - количество строк
- `SUM(column)` - сумма значений
- `AVG(column)` - среднее значение
- `MIN(column)` - минимальное значение
- `MAX(column)` - максимальное значение

### Строковые функции
- `LENGTH(string)` - длина строки
- `UPPER(string)` - в верхний регистр
- `LOWER(string)` - в нижний регистр
- `TRIM(string)` - удаление пробелов
- `SUBSTRING(string, start, length)` - подстрока

### Функции даты и времени
- `NOW()` - текущая дата и время
- `CURRENT_DATE` - текущая дата
- `CURRENT_TIME` - текущее время
- `EXTRACT(part FROM date)` - извлечение части даты

## JOIN операции

### INNER JOIN
```sql
SELECT columns
FROM table1
INNER JOIN table2 ON table1.column = table2.column;
```

### LEFT JOIN
```sql
SELECT columns
FROM table1
LEFT JOIN table2 ON table1.column = table2.column;
```

### RIGHT JOIN
```sql
SELECT columns
FROM table1
RIGHT JOIN table2 ON table1.column = table2.column;
```

### FULL OUTER JOIN
```sql
SELECT columns
FROM table1
FULL OUTER JOIN table2 ON table1.column = table2.column;
```

## Подзапросы

### В WHERE
```sql
SELECT column1
FROM table1
WHERE column2 IN (SELECT column2 FROM table2 WHERE condition);
```

### В SELECT
```sql
SELECT column1, 
       (SELECT COUNT(*) FROM table2 WHERE table2.id = table1.id) as count
FROM table1;
```

## Оконные функции

### ROW_NUMBER()
```sql
SELECT column1, 
       ROW_NUMBER() OVER (ORDER BY column2) as row_num
FROM table_name;
```

### RANK()
```sql
SELECT column1, 
       RANK() OVER (ORDER BY column2 DESC) as rank
FROM table_name;
```

### Агрегаты с окном
```sql
SELECT column1, 
       SUM(column2) OVER (PARTITION BY column3) as total
FROM table_name;
``` 