# Решения: Определение данных (DDL)

## Решение 1: Создание таблицы `products`
```sql,runnable
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    sku VARCHAR(50) UNIQUE,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Проверим, что таблица создалась
SELECT * FROM products;
```

## Решение 2: Создание таблицы `categories`
```sql,runnable
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    parent_category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
);

-- Проверим, что таблица создалась
SELECT * FROM categories;
```
*Примечание: `ON DELETE SET NULL` означает, что если родительская категория будет удалена, у дочерних категорий это поле станет `NULL`, и они превратятся в категории верхнего уровня.*

## Решение 3: Связывание продуктов и категорий
```sql,runnable
CREATE TABLE product_categories (
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- Проверим структуру таблицы (данных пока нет)
\d product_categories
```
*Примечание: `ON DELETE CASCADE` здесь очень важен. Он гарантирует, что при удалении продукта или категории, их связи в этой таблице будут автоматически удалены, предотвращая появление "мусорных" ссылок.*

## Решение 4: Изменение таблицы `products`
```sql,runnable
-- 1. Добавляем поле is_published
ALTER TABLE products ADD COLUMN is_published BOOLEAN DEFAULT FALSE;

-- 2. Добавляем поле weight_kg
ALTER TABLE products ADD COLUMN weight_kg NUMERIC(8, 3);

-- 3. Переименовываем sku в article
ALTER TABLE products RENAME COLUMN sku TO article;

-- Проверим новую структуру таблицы
\d products
```
*Примечание: Команда `\d` является специфичной для клиента `psql` и может не работать в других SQL-инструментах. Она используется здесь для демонстрации и позволяет быстро посмотреть структуру таблицы.* 