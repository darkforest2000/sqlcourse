# 9.2. Основы SQL: DDL (Data Definition Language)

DDL (Data Definition Language) — это подмножество языка SQL, которое отвечает за создание, изменение и удаление структуры объектов базы данных. Эти команды не работают с самими данными, а только с их "контейнерами" и метаданными.

Основные команды DDL:
*   `CREATE` — создать объект.
*   `ALTER` — изменить объект.
*   `DROP` — удалить объект.

## `CREATE`: Создание объектов

### `CREATE DATABASE`
Создает новую базу данных внутри кластера.

```sql
CREATE DATABASE my_new_database;
```

### `CREATE SCHEMA`
Создает новую схему внутри текущей базы данных.

```sql
CREATE SCHEMA my_app;
```

### `CREATE TABLE`
Это одна из самых важных и многофункциональных команд. Она создает новую таблицу в текущей схеме.

**Синтаксис:**
```sql
CREATE TABLE table_name (
    column_name1 data_type [constraints],
    column_name2 data_type [constraints],
    ...
    table_constraints
);
```

**Основные типы данных в PostgreSQL:**
*   `INTEGER` (или `INT`), `BIGINT`, `SMALLINT`: Целочисленные типы.
*   `NUMERIC(precision, scale)` или `DECIMAL`: Числа с фиксированной точностью (например, для денег).
*   `REAL`, `DOUBLE PRECISION`: Числа с плавающей точкой.
*   `SERIAL`, `BIGSERIAL`: Автоинкрементные целые числа (идеально для первичных ключей).
*   `VARCHAR(n)`, `TEXT`: Строки. `VARCHAR(n)` ограничивает максимальную длину, `TEXT` — нет.
*   `BOOLEAN`: `TRUE` или `FALSE`.
*   `DATE`, `TIME`, `TIMESTAMP`: Дата, время, дата и время.
*   `JSON`, `JSONB`: Хранение JSON. `JSONB` является бинарным форматом и предпочтителен для большинства операций.

**Ограничения (Constraints):**
*   `NOT NULL`: Колонка не может содержать `NULL`.
*   `UNIQUE`: Все значения в колонке должны быть уникальны.
*   `PRIMARY KEY`: Комбинация `NOT NULL` и `UNIQUE`. Уникально идентифицирует каждую запись в таблице. У таблицы может быть только один первичный ключ.
*   `FOREIGN KEY`: Устанавливает связь с другой таблицей.
*   `CHECK`: Проверяет, что значение в колонке удовлетворяет определенному условию.
*   `DEFAULT`: Устанавливает значение по умолчанию, если оно не указано.

**Пример:**
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    balance NUMERIC(10, 2) CHECK (balance >= 0)
);
```

## `ALTER`: Изменение объектов

Команда `ALTER` позволяет изменять существующие объекты. Чаще всего используется `ALTER TABLE`.

**Примеры:**
```sql
-- Добавить новую колонку
ALTER TABLE users ADD COLUMN last_login_ip VARCHAR(45);

-- Удалить колонку
ALTER TABLE users DROP COLUMN last_login_ip;

-- Изменить тип данных колонки (может быть сложной операцией)
ALTER TABLE users ALTER COLUMN username TYPE VARCHAR(80);

-- Добавить ограничение
ALTER TABLE users ADD CONSTRAINT positive_balance CHECK (balance >= 0);

-- Удалить ограничение
ALTER TABLE users DROP CONSTRAINT positive_balance;

-- Переименовать таблицу
ALTER TABLE users RENAME TO app_users;
```

## `DROP`: Удаление объектов

Команда `DROP` полностью и безвозвратно удаляет объект из базы данных. Используйте её с осторожностью!

**Примеры:**
```sql
-- Удалить таблицу
DROP TABLE app_users;

-- Удалить таблицу, только если она существует (не вызовет ошибки)
DROP TABLE IF EXISTS app_users;

-- Удалить таблицу и все зависимые от нее объекты (например, внешние ключи)
DROP TABLE app_users CASCADE;

-- Удалить схему (удалит и все объекты внутри нее)
DROP SCHEMA my_app CASCADE;

-- Удалить базу данных
DROP DATABASE my_new_database;
``` 