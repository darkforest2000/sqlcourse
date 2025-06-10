# Демо: Интерактивные SQL запросы

Эта страница демонстрирует возможности выполнения SQL кода прямо в браузере.

## 🎯 Простые запросы

### Просмотр всех сотрудников
```sql,runnable
SELECT * FROM employees;
```

### Фильтрация по отделу
```sql,runnable
SELECT first_name, last_name, department, salary 
FROM employees 
WHERE department = 'IT'
ORDER BY salary DESC;
```

### Агрегатные функции
```sql,runnable
SELECT 
    department,
    COUNT(*) as employee_count,
    AVG(salary) as avg_salary,
    MIN(salary) as min_salary,
    MAX(salary) as max_salary
FROM employees 
GROUP BY department 
ORDER BY avg_salary DESC;
```

## 🔧 Изменение данных

### Добавление нового сотрудника
```sql,runnable
INSERT INTO employees (id, first_name, last_name, email, department, position, salary, hire_date, active) 
VALUES (99, 'Тест', 'Тестов', 'test@company.com', 'Testing', 'Тестировщик', 95000, '2024-06-02', 1);

-- Проверим результат
SELECT * FROM employees WHERE id = 99;
```

### Обновление данных
```sql,runnable
-- Повысим зарплату на 15% сотрудникам Marketing
UPDATE employees 
SET salary = salary * 1.15 
WHERE department = 'Marketing';

-- Посмотрим результат
SELECT first_name, last_name, department, salary 
FROM employees 
WHERE department = 'Marketing';
```

### Удаление данных
```sql,runnable
-- Удалим тестового сотрудника
DELETE FROM employees WHERE id = 99;

-- Проверим, что он удален
SELECT COUNT(*) as total_employees FROM employees;
```

## 📊 Сложные запросы

### Подзапросы
```sql,runnable
-- Сотрудники с зарплатой выше средней
SELECT first_name, last_name, salary,
       (SELECT AVG(salary) FROM employees) as avg_salary
FROM employees 
WHERE salary > (SELECT AVG(salary) FROM employees)
ORDER BY salary DESC;
```

### Работа с датами
```sql,runnable
-- Сотрудники, работающие больше 3 лет
SELECT first_name, last_name, hire_date,
       CASE 
           WHEN hire_date < '2021-01-01' THEN 'Опытный'
           ELSE 'Новичок'
       END as experience_level
FROM employees 
ORDER BY hire_date;
```

## 🗂 Работа с несколькими таблицами

### Информация об отделах
```sql,runnable
-- Сначала посмотрим на отделы
SELECT * FROM departments;
```

### JOIN операции (если доступны)
```sql,runnable
-- Попробуем объединить данные (может не работать в SQLite)
SELECT 
    e.first_name,
    e.last_name,
    e.department,
    d.description as dept_description,
    d.location
FROM employees e
LEFT JOIN departments d ON e.department = d.name
LIMIT 5;
```

## 🎮 Поэкспериментируйте!

### Готовые примеры (нажмите "Выполнить")
```sql,runnable
-- Ваш запрос здесь
SELECT 'Привет, SQL!' as message;
```

### Редактируемая песочница
Здесь вы можете писать и изменять любые SQL запросы:

```sql,editable
-- Напишите ваш собственный запрос!
-- Попробуйте что-то интересное с таблицами employees и departments

SELECT * FROM employees LIMIT 3;
```

### Полезные функции для экспериментов
```sql,runnable
-- Функции работы со строками
SELECT 
    first_name,
    last_name,
    UPPER(first_name) as upper_name,
    LENGTH(email) as email_length,
    SUBSTR(email, 1, INSTR(email, '@') - 1) as username
FROM employees 
LIMIT 3;
```

## 🔄 Сброс данных

Если что-то пошло не так, нажмите кнопку "🔄 Сбросить данные" под любым блоком, чтобы вернуть исходное состояние базы данных. 