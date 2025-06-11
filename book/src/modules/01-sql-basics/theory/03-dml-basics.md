# 9.3. Основы SQL: DML (Data Manipulation Language)

DML (Data Manipulation Language) — это набор команд SQL, предназначенных для управления данными внутри таблиц: вставки, обновления, удаления и чтения. Если DDL создает "скелет" базы данных, то DML наполняет его "жизнью".

Основные команды DML:
*   `INSERT` — вставить новые данные (строки).
*   `UPDATE` — обновить существующие данные.
*   `DELETE` — удалить данные.
*   `SELECT` — прочитать данные (часто выделяют в отдельную категорию DQL - Data Query Language, но по сути это операция манипуляции). Мы подробно рассмотрим `SELECT` в теме про JOIN.

## `INSERT`: Вставка данных

Команда `INSERT` добавляет одну или несколько новых строк в таблицу.

**Синтаксис для вставки одной строки:**
```sql
INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);
```
Важно, чтобы количество и типы данных в `VALUES` соответствовали перечисленным колонкам. Если вы вставляете значения для всех колонок в их исходном порядке, список колонок можно опустить.

**Пример:**
```sql
INSERT INTO employees (first_name, last_name, email, department_id, salary)
VALUES ('Петр', 'Сергеев', 'petr.sergeev@company.com', 1, 95000.00);
```

**Синтаксис для вставки нескольких строк:**
```sql
INSERT INTO table_name (column1, column2, ...)
VALUES
    (value1_1, value1_2, ...),
    (value2_1, value2_2, ...),
    (value3_1, value3_2, ...);
```
**Пример:**
```sql
INSERT INTO employees (first_name, last_name, email, department_id, salary)
VALUES
    ('Светлана', 'Соколова', 'svetlana.s@company.com', 2, 82000),
    ('Игорь', 'Белов', 'igor.belov@company.com', 1, 115000);
```

### `RETURNING`
В PostgreSQL команда `INSERT` (а также `UPDATE` и `DELETE`) может возвращать значения из обработанных строк с помощью опции `RETURNING`. Это очень удобно, чтобы сразу получить `id` созданной записи.

```sql
INSERT INTO employees (first_name, last_name, email)
VALUES ('Новый', 'Сотрудник', 'new.employee@company.com')
RETURNING id, first_name, salary; -- salary вернет значение по умолчанию, если оно есть
```

## `UPDATE`: Обновление данных

Команда `UPDATE` изменяет существующие строки в таблице.

**Крайне важно всегда использовать `UPDATE` с условием `WHERE`!** Иначе вы обновите **ВСЕ** строки в таблице.

**Синтаксис:**
```sql
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
```

**Пример:**
```sql
-- Повышаем зарплату конкретному сотруднику
UPDATE employees
SET salary = salary * 1.10, position = 'Старший разработчик'
WHERE email = 'ivan.petrov@company.com';
```

## `DELETE`: Удаление данных

Команда `DELETE` удаляет строки из таблицы.

**Так же, как и с `UPDATE`, всегда используйте `WHERE`!** `DELETE` без `WHERE` удалит **ВСЕ** данные из таблицы.

**Синтаксис:**
```sql
DELETE FROM table_name
WHERE condition;
```

**Пример:**
```sql
-- Увольняем сотрудника
DELETE FROM employees
WHERE email = 'new.employee@company.com';
```

## `TRUNCATE`: Быстрая очистка таблицы

Если вам нужно удалить абсолютно все строки из таблицы, команда `TRUNCATE` сделает это намного быстрее, чем `DELETE FROM table_name`.

`TRUNCATE` не сканирует таблицу построчно, а просто сбрасывает ее до исходного состояния. Она также сбрасывает счетчики `SERIAL` полей.

**Синтаксис:**
```sql
TRUNCATE TABLE table_name;

-- Если на таблицу есть внешние ключи, может потребоваться опция CASCADE
TRUNCATE TABLE table_name RESTART IDENTITY CASCADE;
-- RESTART IDENTITY - сброс счетчика
-- CASCADE - удалить зависимые записи в других таблицах
```
**Внимание:** `TRUNCATE` — это DDL-подобная операция. Она выполняется очень быстро и её нельзя "откатить" в рамках обычной транзакции так же легко, как `DELETE`. Используйте с осторожностью. 