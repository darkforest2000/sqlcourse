# Шпаргалки

## Быстрый справочник PostgreSQL

### Основные команды psql

```bash
# Подключение к базе данных
psql -U username -d database_name -h hostname

# Список баз данных
\l

# Подключение к базе данных
\c database_name

# Список таблиц
\dt

# Описание таблицы
\d table_name

# Список пользователей
\du

# Выход
\q

# Включить отображение времени выполнения
\timing

# Выполнить SQL из файла
\i filename.sql
```

### Часто используемые запросы

#### Информация о базе данных
```sql
-- Размер базы данных
SELECT pg_size_pretty(pg_database_size('database_name'));

-- Список всех таблиц с размерами
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables 
WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Активные подключения
SELECT * FROM pg_stat_activity;
```

#### Работа с индексами
```sql
-- Создание индекса
CREATE INDEX idx_name ON table_name (column_name);

-- Уникальный индекс
CREATE UNIQUE INDEX idx_name ON table_name (column_name);

-- Составной индекс
CREATE INDEX idx_name ON table_name (col1, col2);

-- Удаление индекса
DROP INDEX idx_name;

-- Список индексов таблицы
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'table_name';
```

#### Анализ производительности
```sql
-- План выполнения запроса
EXPLAIN SELECT * FROM table_name WHERE condition;

-- Детальный план выполнения
EXPLAIN ANALYZE SELECT * FROM table_name WHERE condition;

-- Статистика по запросам (требует pg_stat_statements)
SELECT 
    query,
    calls,
    total_time,
    mean_time,
    rows
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### Типичные паттерны

#### Пагинация
```sql
-- OFFSET/LIMIT (медленно для больших OFFSET)
SELECT * FROM table_name 
ORDER BY id 
LIMIT 20 OFFSET 100;

-- Курсорная пагинация (быстрее)
SELECT * FROM table_name 
WHERE id > last_seen_id 
ORDER BY id 
LIMIT 20;
```

#### Duplicate handling
```sql
-- Найти дубликаты
SELECT email, COUNT(*) 
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Удалить дубликаты (оставить первый)
DELETE FROM users a USING users b 
WHERE a.id > b.id 
AND a.email = b.email;
```

#### Условная вставка
```sql
-- INSERT если не существует
INSERT INTO table_name (column1, column2) 
SELECT 'value1', 'value2' 
WHERE NOT EXISTS (
    SELECT 1 FROM table_name 
    WHERE column1 = 'value1'
);

-- UPSERT (PostgreSQL 9.5+)
INSERT INTO table_name (id, name) 
VALUES (1, 'John') 
ON CONFLICT (id) 
DO UPDATE SET name = EXCLUDED.name;
```

### Полезные функции PostgreSQL

#### Работа с JSON
```sql
-- Извлечение значения из JSON
SELECT data->>'name' FROM table_name;

-- Извлечение вложенного значения
SELECT data->'address'->>'city' FROM table_name;

-- Поиск в JSON
SELECT * FROM table_name 
WHERE data @> '{"status": "active"}';
```

#### Работа с массивами
```sql
-- Создание массива
SELECT ARRAY[1, 2, 3, 4];

-- Проверка вхождения в массив
SELECT * FROM table_name 
WHERE 'value' = ANY(array_column);

-- Объединение массивов
SELECT array_cat(array1, array2);
```

#### Генерация данных
```sql
-- Серия чисел
SELECT generate_series(1, 100);

-- Серия дат
SELECT generate_series(
    '2024-01-01'::date,
    '2024-12-31'::date,
    '1 day'::interval
);

-- Случайные данные
SELECT 
    random() * 100 as random_number,
    md5(random()::text) as random_string;
```

### Резервное копирование и восстановление

```bash
# Создание дампа базы данных
pg_dump -U username -h hostname database_name > backup.sql

# Создание сжатого дампа
pg_dump -U username -h hostname -Fc database_name > backup.dump

# Восстановление из SQL файла
psql -U username -h hostname -d database_name < backup.sql

# Восстановление из дампа
pg_restore -U username -h hostname -d database_name backup.dump

# Дамп только схемы
pg_dump -U username -h hostname -s database_name > schema.sql

# Дамп только данных
pg_dump -U username -h hostname -a database_name > data.sql
```

### Управление пользователями

```sql
-- Создание пользователя
CREATE USER username WITH PASSWORD 'password';

-- Создание роли
CREATE ROLE rolename;

-- Предоставление прав
GRANT SELECT, INSERT, UPDATE, DELETE ON table_name TO username;
GRANT ALL PRIVILEGES ON DATABASE database_name TO username;

-- Удаление пользователя
DROP USER username;

-- Изменение пароля
ALTER USER username WITH PASSWORD 'new_password';
```

### Настройки конфигурации

```sql
-- Просмотр настроек
SHOW ALL;
SHOW work_mem;

-- Изменение настроек (для сессии)
SET work_mem = '256MB';

-- Перезагрузка конфигурации
SELECT pg_reload_conf();
``` 