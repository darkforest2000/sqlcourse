# Примеры кода

## Реальные сценарии использования SQL

### E-commerce приложение

#### Схема базы данных
```sql
-- Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Категории товаров
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    parent_id INTEGER REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Товары
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    stock_quantity INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Заказы
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Позиции заказа
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);
```

#### Аналитические запросы

##### Топ продаж за месяц
```sql
SELECT 
    p.name,
    SUM(oi.quantity) as total_sold,
    SUM(oi.quantity * oi.price) as revenue
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE)
    AND o.status = 'completed'
GROUP BY p.id, p.name
ORDER BY revenue DESC
LIMIT 10;
```

##### Активность пользователей
```sql
WITH user_stats AS (
    SELECT 
        u.id,
        u.email,
        COUNT(o.id) as orders_count,
        SUM(o.total_amount) as total_spent,
        MAX(o.created_at) as last_order_date
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id 
        AND o.status = 'completed'
    GROUP BY u.id, u.email
)
SELECT 
    email,
    orders_count,
    total_spent,
    last_order_date,
    CASE 
        WHEN last_order_date >= CURRENT_DATE - INTERVAL '30 days' THEN 'Active'
        WHEN last_order_date >= CURRENT_DATE - INTERVAL '90 days' THEN 'At Risk'
        WHEN orders_count > 0 THEN 'Inactive'
        ELSE 'New'
    END as user_segment
FROM user_stats
ORDER BY total_spent DESC NULLS LAST;
```

##### Когортный анализ
```sql
WITH first_orders AS (
    SELECT 
        user_id,
        DATE_TRUNC('month', MIN(created_at)) as cohort_month
    FROM orders
    WHERE status = 'completed'
    GROUP BY user_id
),
user_activities AS (
    SELECT 
        fo.cohort_month,
        DATE_TRUNC('month', o.created_at) as activity_month,
        COUNT(DISTINCT o.user_id) as active_users
    FROM first_orders fo
    JOIN orders o ON fo.user_id = o.user_id
    WHERE o.status = 'completed'
    GROUP BY fo.cohort_month, DATE_TRUNC('month', o.created_at)
),
cohort_sizes AS (
    SELECT 
        cohort_month,
        COUNT(DISTINCT user_id) as cohort_size
    FROM first_orders
    GROUP BY cohort_month
)
SELECT 
    cs.cohort_month,
    ua.activity_month,
    cs.cohort_size,
    ua.active_users,
    ROUND(
        100.0 * ua.active_users / cs.cohort_size, 2
    ) as retention_rate
FROM cohort_sizes cs
JOIN user_activities ua ON cs.cohort_month = ua.cohort_month
ORDER BY cs.cohort_month, ua.activity_month;
```

### Система управления контентом

#### Схема для блога
```sql
-- Авторы
CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Статьи
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id INTEGER REFERENCES authors(id),
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Теги
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

-- Связь статей и тегов
CREATE TABLE post_tags (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Комментарии
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_email VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Запросы для блога

##### Получение статей с тегами
```sql
SELECT 
    p.id,
    p.title,
    p.slug,
    p.excerpt,
    a.username as author,
    p.published_at,
    STRING_AGG(t.name, ', ' ORDER BY t.name) as tags
FROM posts p
JOIN authors a ON p.author_id = a.id
LEFT JOIN post_tags pt ON p.id = pt.post_id
LEFT JOIN tags t ON pt.tag_id = t.id
WHERE p.status = 'published' 
    AND p.published_at <= CURRENT_TIMESTAMP
GROUP BY p.id, p.title, p.slug, p.excerpt, a.username, p.published_at
ORDER BY p.published_at DESC;
```

##### Поиск по содержимому
```sql
SELECT 
    p.id,
    p.title,
    p.excerpt,
    a.username as author,
    ts_rank(
        to_tsvector('russian', p.title || ' ' || p.content),
        plainto_tsquery('russian', 'поисковый запрос')
    ) as rank
FROM posts p
JOIN authors a ON p.author_id = a.id
WHERE p.status = 'published'
    AND to_tsvector('russian', p.title || ' ' || p.content) 
        @@ plainto_tsquery('russian', 'поисковый запрос')
ORDER BY rank DESC, p.published_at DESC;
```

### Система финансового учета

#### Схема для двойной записи
```sql
-- Счета
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    account_type VARCHAR(20) NOT NULL, -- 'asset', 'liability', 'equity', 'revenue', 'expense'
    parent_id INTEGER REFERENCES accounts(id),
    is_active BOOLEAN DEFAULT true
);

-- Проводки
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    transaction_date DATE NOT NULL,
    description TEXT NOT NULL,
    reference VARCHAR(100),
    created_by INTEGER, -- user_id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Записи в проводках
CREATE TABLE journal_entries (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES transactions(id),
    account_id INTEGER REFERENCES accounts(id),
    debit DECIMAL(15, 2) DEFAULT 0,
    credit DECIMAL(15, 2) DEFAULT 0,
    CONSTRAINT check_debit_or_credit CHECK (
        (debit > 0 AND credit = 0) OR (credit > 0 AND debit = 0)
    )
);

-- Проверка баланса на уровне транзакции
CREATE OR REPLACE FUNCTION check_transaction_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT SUM(debit) - SUM(credit) 
        FROM journal_entries 
        WHERE transaction_id = NEW.transaction_id) != 0 THEN
        RAISE EXCEPTION 'Transaction does not balance';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER transaction_balance_check
    AFTER INSERT OR UPDATE OR DELETE ON journal_entries
    FOR EACH ROW EXECUTE FUNCTION check_transaction_balance();
```

#### Финансовые отчеты

##### Баланс счетов
```sql
WITH account_balances AS (
    SELECT 
        a.id,
        a.code,
        a.name,
        a.account_type,
        SUM(je.debit - je.credit) as balance
    FROM accounts a
    LEFT JOIN journal_entries je ON a.id = je.account_id
    JOIN transactions t ON je.transaction_id = t.id
    WHERE t.transaction_date <= CURRENT_DATE
    GROUP BY a.id, a.code, a.name, a.account_type
)
SELECT 
    account_type,
    code,
    name,
    balance,
    CASE 
        WHEN account_type IN ('asset', 'expense') AND balance >= 0 THEN balance
        WHEN account_type IN ('asset', 'expense') AND balance < 0 THEN 0
        WHEN account_type IN ('liability', 'equity', 'revenue') AND balance <= 0 THEN ABS(balance)
        ELSE 0
    END as normal_balance
FROM account_balances
WHERE balance != 0
ORDER BY account_type, code;
```

### Система аналитики веб-сайта

#### Схема для отслеживания событий
```sql
-- Пользователи (анонимные и зарегистрированные)
CREATE TABLE analytics_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER, -- ссылка на registered user, если есть
    session_id VARCHAR(255) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- События
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    user_session_id INTEGER REFERENCES analytics_users(id),
    event_type VARCHAR(50) NOT NULL,
    page_url TEXT,
    referrer_url TEXT,
    properties JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для аналитики
CREATE INDEX idx_events_timestamp ON events(timestamp);
CREATE INDEX idx_events_type_timestamp ON events(event_type, timestamp);
CREATE INDEX idx_events_properties ON events USING GIN(properties);
```

#### Аналитические запросы

##### Воронка конверсии
```sql
WITH funnel_steps AS (
    SELECT 
        user_session_id,
        MIN(CASE WHEN event_type = 'page_view' AND page_url LIKE '%/products%' THEN timestamp END) as viewed_products,
        MIN(CASE WHEN event_type = 'add_to_cart' THEN timestamp END) as added_to_cart,
        MIN(CASE WHEN event_type = 'checkout_started' THEN timestamp END) as started_checkout,
        MIN(CASE WHEN event_type = 'purchase' THEN timestamp END) as completed_purchase
    FROM events
    WHERE timestamp >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY user_session_id
),
funnel_analysis AS (
    SELECT 
        COUNT(*) FILTER (WHERE viewed_products IS NOT NULL) as step1_viewed,
        COUNT(*) FILTER (WHERE added_to_cart IS NOT NULL) as step2_cart,
        COUNT(*) FILTER (WHERE started_checkout IS NOT NULL) as step3_checkout,
        COUNT(*) FILTER (WHERE completed_purchase IS NOT NULL) as step4_purchase
    FROM funnel_steps
)
SELECT 
    'Viewed Products' as step, step1_viewed as users, 100.0 as conversion_rate
FROM funnel_analysis
UNION ALL
SELECT 
    'Added to Cart', step2_cart, 
    ROUND(100.0 * step2_cart / NULLIF(step1_viewed, 0), 2)
FROM funnel_analysis
UNION ALL
SELECT 
    'Started Checkout', step3_checkout,
    ROUND(100.0 * step3_checkout / NULLIF(step2_cart, 0), 2)
FROM funnel_analysis
UNION ALL
SELECT 
    'Completed Purchase', step4_purchase,
    ROUND(100.0 * step4_purchase / NULLIF(step3_checkout, 0), 2)
FROM funnel_analysis;
```

##### Анализ поведения пользователей
```sql
SELECT 
    DATE_TRUNC('hour', timestamp) as hour,
    COUNT(*) as total_events,
    COUNT(DISTINCT user_session_id) as unique_sessions,
    COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
    COUNT(*) FILTER (WHERE event_type = 'purchase') as purchases,
    AVG(EXTRACT(EPOCH FROM (
        MAX(timestamp) OVER (PARTITION BY user_session_id) - 
        MIN(timestamp) OVER (PARTITION BY user_session_id)
    ))) as avg_session_duration
FROM events
WHERE timestamp >= CURRENT_DATE - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', timestamp)
ORDER BY hour;
```

### Полезные оптимизации

#### Партиционирование по времени
```sql
-- Создание партиционированной таблицы
CREATE TABLE events_partitioned (
    id BIGSERIAL,
    user_session_id INTEGER,
    event_type VARCHAR(50) NOT NULL,
    page_url TEXT,
    properties JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) PARTITION BY RANGE (timestamp);

-- Создание партиций
CREATE TABLE events_2024_01 PARTITION OF events_partitioned
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE events_2024_02 PARTITION OF events_partitioned
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

#### Материализованные представления
```sql
-- Ежедневная статистика
CREATE MATERIALIZED VIEW daily_stats AS
SELECT 
    DATE(timestamp) as date,
    COUNT(*) as total_events,
    COUNT(DISTINCT user_session_id) as unique_sessions,
    COUNT(*) FILTER (WHERE event_type = 'purchase') as purchases,
    SUM((properties->>'revenue')::NUMERIC) FILTER (WHERE event_type = 'purchase') as revenue
FROM events
GROUP BY DATE(timestamp);

-- Создание индекса
CREATE UNIQUE INDEX ON daily_stats (date);

-- Обновление (можно запускать по cron)
REFRESH MATERIALIZED VIEW CONCURRENTLY daily_stats;
``` 