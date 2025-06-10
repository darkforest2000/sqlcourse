# 🎮 SQL Playground в mdBook

## ✨ Что это дает?

Теперь ваш SQL курс поддерживает **интерактивное выполнение SQL кода** прямо в браузере! Студенты могут:

- ✅ **Выполнять SQL запросы** без установки PostgreSQL
- ✅ **Видеть результаты** в красивых таблицах
- ✅ **Экспериментировать** с данными безопасно
- ✅ **Изучать на практике** без сложной настройки
- 🆕 **Писать и редактировать код** в интерактивных блоках
- 🆕 **Получать мгновенную обратную связь** при выполнении запросов

## 🛠 Технологии

### SQLite WASM (sql.js)
- **Быстро** - выполняется в браузере
- **Безопасно** - изолированная среда
- **Совместимо** - работает на всех устройствах
- **Оффлайн** - не требует интернета после загрузки

## 📝 Как использовать в материалах

### 1. Готовые примеры (только выполнение)
```markdown
```sql,runnable
SELECT * FROM employees WHERE department = 'IT';
```

### 2. Редактируемые блоки (можно изменять код)
```markdown
```sql,editable
-- Студент может редактировать этот код
SELECT first_name, last_name FROM employees WHERE salary > 100000;
```

### Результат
- **Runnable**: Кнопки "▶ Выполнить SQL" и "🔄 Сбросить данные"
- **Editable**: Дополнительно кнопка "🗑 Очистить код" и текстовое поле для редактирования
- Результаты отображаются в таблице под блоком
- Показывается время выполнения

## 🎯 Возможности

### 1. SELECT запросы
```sql,runnable
SELECT first_name, last_name, salary FROM employees ORDER BY salary DESC;
```

### 2. Агрегатные функции
```sql,runnable
SELECT department, COUNT(*), AVG(salary) FROM employees GROUP BY department;
```

### 3. Изменение данных
```sql,runnable
INSERT INTO employees VALUES (99, 'Тест', 'Тестов', 'test@example.com', 'IT', 'Developer', 100000, '2024-01-01', NULL, 1);
SELECT * FROM employees WHERE id = 99;
```

### 4. Множественные запросы
```sql,runnable
UPDATE employees SET salary = salary * 1.1 WHERE department = 'IT';
SELECT first_name, last_name, salary FROM employees WHERE department = 'IT';
```

## 🏗 Предустановленные данные

В каждом playground автоматически создаются таблицы:

### Таблица `employees`
- id, first_name, last_name, email
- department, position, salary
- hire_date, manager_id, active

### Таблица `departments`
- id, name, description
- budget, location

### Тестовые данные
- 10 сотрудников из разных отделов
- 5 отделов компании
- Реалистичные зарплаты и даты

## 🎨 Кастомизация

### CSS классы для стилизации
```css
.sql-playground { } /* Контейнер playground */
.sql-run-button { } /* Кнопка выполнения */
.sql-table { }      /* Таблица результатов */
.sql-error { }      /* Сообщения об ошибках */
.sql-success { }    /* Сообщения об успехе */
```

### JavaScript события
```javascript
// Кастомная обработка результатов
document.addEventListener('sqlExecuted', (event) => {
    console.log('SQL выполнен:', event.detail);
});
```

## 🔧 Расширенная настройка

### Добавление новых таблиц
Отредактируйте файл `book/theme/sql-playground.js`:

```javascript
const setupSQL = `
    CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price DECIMAL(10,2)
    );
    
    INSERT INTO products VALUES 
        (1, 'Laptop', 1000.00),
        (2, 'Mouse', 25.00);
`;
```

### Кастомные функции
```javascript
// Добавление пользовательских SQL функций
db.create_function("CUSTOM_FUNC", function(value) {
    return value.toUpperCase();
});
```

## 🚀 Альтернативные подходы

### 1. PostgreSQL через WebAssembly
- **Плюсы**: 100% совместимость с PostgreSQL
- **Минусы**: Больший размер, сложнее настройка

### 2. Удаленный SQL сервер
- **Плюсы**: Реальная база данных
- **Минусы**: Требует сервер, проблемы безопасности

### 3. Iframe с внешним playground
```html
<iframe src="https://sqlfiddle.com/postgresql/online-compiler" width="100%" height="400"></iframe>
```

## 📋 Ограничения SQLite vs PostgreSQL

### Работает одинаково
- ✅ Базовые SELECT, INSERT, UPDATE, DELETE
- ✅ JOIN операции
- ✅ Агрегатные функции
- ✅ Подзапросы и CTE
- ✅ Оконные функции

### Различия
- ❌ Специфичные типы PostgreSQL (UUID, JSONB)
- ❌ Расширения (PostGIS)
- ❌ Процедуры и функции PL/pgSQL
- ❌ Триггеры (ограниченно)

## 🎯 Рекомендации по использованию

### Для начальных модулей (00-01)
✅ **Отлично подходит** - базовый SQL полностью совместим

### Для продвинутых модулей (02-03)
⚠️ **Частично** - большинство функций работает, но без PostgreSQL-специфики

### Для оптимизации (04)
❌ **Ограниченно** - нет планов выполнения PostgreSQL

## 🔄 Миграция существующих материалов

### 1. Автоматическая замена
```bash
# Сделать все SQL блоки интерактивными
sed -i 's/```sql$/```sql,runnable/g' *.md
```

### 2. Выборочно
Добавляйте `,runnable` только к блокам, которые должны быть интерактивными:
```markdown
```sql,runnable
SELECT * FROM employees;
```

### 3. Комбинированный подход
```markdown
<!-- Демонстрация (интерактивно) -->
```sql,runnable
SELECT COUNT(*) FROM employees;
```

<!-- Продвинутый код (только показ) -->
```sql
-- Специфичный для PostgreSQL код
SELECT * FROM pg_stats;
```

## 🎉 Результат

Ваш SQL курс теперь:
- **Интерактивный** - студенты учатся на практике
- **Доступный** - работает на любом устройстве
- **Современный** - красивый UI/UX
- **Безопасный** - изолированная среда выполнения

**Попробуйте сами**: Откройте http://localhost:3000 и перейдите в раздел "🎮 Демо: Интерактивные SQL запросы"! 