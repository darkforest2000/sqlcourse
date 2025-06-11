# Решения: Манипуляция данными (DML и JOIN)

## Решение 1: Наполнение таблиц
```sql,runnable
-- 1. Добавляем категории
INSERT INTO categories (name) VALUES ('Электроника'), ('Книги'), ('Бытовая техника');

-- 2. Добавляем подкатегорию "Смартфоны"
-- Сначала получаем id категории "Электроника"
INSERT INTO categories (name, parent_category_id)
SELECT 'Смартфоны', id FROM categories WHERE name = 'Электроника';

-- 3. Добавляем продукты
-- (предположим, что колонка 'article' уже существует после ALTER TABLE)
INSERT INTO products (name, price, article) VALUES
('Pixel 8', 70000, 'P8-128'),
('Чистый код', 1200, 'CL-CODE'),
('Холодильник Атлант', 45000, 'ATL-200');

-- 4, 5. Связываем продукты и категории
INSERT INTO product_categories (product_id, category_id)
VALUES
    ((SELECT id FROM products WHERE article = 'P8-128'), (SELECT id FROM categories WHERE name = 'Электроника')),
    ((SELECT id FROM products WHERE article = 'P8-128'), (SELECT id FROM categories WHERE name = 'Смартфоны')),
    ((SELECT id FROM products WHERE article = 'CL-CODE'), (SELECT id FROM categories WHERE name = 'Книги'));

-- Посмотрим на результат
SELECT * FROM product_categories;
```

## Решение 2: `INNER JOIN`
```sql,runnable
SELECT
    p.name AS product_name,
    p.price,
    c.name AS category_name
FROM
    products AS p
JOIN
    product_categories AS pc ON p.id = pc.product_id
JOIN
    categories AS c ON pc.category_id = c.id;
```
*Замечание: Здесь используется два `JOIN`, чтобы связать `products` с `categories` через промежуточную таблицу `product_categories`.*

## Решение 3: `LEFT JOIN`
```sql,runnable
SELECT
    p.name AS product_name,
    c.name AS category_name
FROM
    products AS p
LEFT JOIN
    product_categories AS pc ON p.id = pc.product_id
LEFT JOIN
    categories AS c ON pc.category_id = c.id
ORDER BY
    c.name NULLS FIRST;
```
*Замечание: `ORDER BY c.name NULLS FIRST` — это специфичная для PostgreSQL (и стандарта SQL) конструкция, которая позволяет явно управлять сортировкой `NULL` значений.*

## Решение 4: `RIGHT JOIN` и агрегация
```sql,runnable
SELECT
    c.name AS category_name,
    COUNT(p.id) AS product_count
FROM
    products AS p
JOIN
    product_categories AS pc ON p.id = pc.product_id
RIGHT JOIN
    categories AS c ON pc.category_id = c.id
GROUP BY
    c.name
ORDER BY
    product_count DESC;
```
*Замечание: Мы используем `RIGHT JOIN` от `categories` к `product_categories`, чтобы гарантированно включить все категории. `COUNT(p.id)` посчитает `NULL` как 0, что нам и нужно.*

## Решение 5: Self-Join (соединение с собой)
```sql,runnable
SELECT
    child.name AS child_name,
    parent.name AS parent_name
FROM
    categories AS child
JOIN
    categories AS parent ON child.parent_category_id = parent.id;
```
*Замечание: Мы берем таблицу `categories` дважды под разными "именами" (`child` и `parent`) и соединяем их по полю `parent_category_id`, которое ссылается на `id` в той же таблице.* 