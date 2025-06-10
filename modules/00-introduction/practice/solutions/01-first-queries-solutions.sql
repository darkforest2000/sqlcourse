-- Эталонные решения для "Первые SQL запросы"
-- Модуль 00: Введение в курс

-- ========================================
-- ОСНОВНЫЕ ЗАДАНИЯ
-- ========================================

-- Задание 1: Получить все записи
-- Ожидаемый результат: 16 записей со всеми сотрудниками
SELECT * FROM employees;

-- Альтернативное решение (более явное):
SELECT 
    id,
    first_name,
    last_name,
    email,
    department,
    position,
    salary,
    hire_date,
    manager_id,
    active,
    created_at
FROM employees;

-- ========================================

-- Задание 2: Фильтрация по отделу
-- Ожидаемый результат: 5 сотрудников из IT отдела
SELECT * FROM employees 
WHERE department = 'IT';

-- С выводом только основных полей:
SELECT 
    first_name,
    last_name,
    position,
    salary
FROM employees 
WHERE department = 'IT';

-- ========================================

-- Задание 3: Сортировка по зарплате
-- Ожидаемый результат: Сотрудники от самых высокооплачиваемых к наименее
SELECT 
    first_name,
    last_name,
    department,
    position,
    salary
FROM employees 
ORDER BY salary DESC;

-- ========================================

-- Задание 4: Подсчет количества записей
-- Ожидаемый результат: 16
SELECT COUNT(*) as total_employees FROM employees;

-- Альтернативное решение с названием столбца:
SELECT COUNT(*) as "Общее количество сотрудников" FROM employees;

-- ========================================

-- Задание 5: Уникальные значения
-- Ожидаемый результат: Список уникальных отделов
SELECT DISTINCT department FROM employees;

-- С сортировкой:
SELECT DISTINCT department 
FROM employees 
ORDER BY department;

-- ========================================

-- Задание 6: Диапазон зарплат
-- Ожидаемый результат: Сотрудники с зарплатой от 80,000 до 120,000
SELECT 
    first_name,
    last_name,
    department,
    salary
FROM employees 
WHERE salary BETWEEN 80000 AND 120000
ORDER BY salary DESC;

-- Альтернативное решение:
SELECT 
    first_name,
    last_name,
    department,
    salary
FROM employees 
WHERE salary >= 80000 AND salary <= 120000
ORDER BY salary DESC;

-- ========================================

-- Задание 7: Поиск по имени
-- Ожидаемый результат: Сотрудники с именами на "А"
SELECT 
    first_name,
    last_name,
    department,
    position
FROM employees 
WHERE first_name LIKE 'А%';

-- Более универсальное решение (учитывает разный регистр):
SELECT 
    first_name,
    last_name,
    department,
    position
FROM employees 
WHERE first_name ILIKE 'а%';

-- ========================================

-- Задание 8: Сложное условие
-- Ожидаемый результат: Активные IT сотрудники с зарплатой больше 100,000
SELECT 
    first_name,
    last_name,
    position,
    salary,
    hire_date
FROM employees 
WHERE active = true 
  AND department = 'IT' 
  AND salary > 100000
ORDER BY salary DESC;

-- ========================================
-- БОНУСНЫЕ ЗАДАНИЯ
-- ========================================

-- Бонус 1: Статистика по отделам
-- Ожидаемый результат: Количество сотрудников в каждом отделе
SELECT 
    department,
    COUNT(*) as employee_count
FROM employees 
GROUP BY department
ORDER BY employee_count DESC;

-- С добавлением процента от общего количества:
SELECT 
    department,
    COUNT(*) as employee_count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM employees), 2) as percentage
FROM employees 
GROUP BY department
ORDER BY employee_count DESC;

-- ========================================

-- Бонус 2: Средняя зарплата
-- Ожидаемый результат: Средняя зарплата по компании
SELECT 
    ROUND(AVG(salary), 2) as average_salary
FROM employees;

-- С дополнительной статистикой:
SELECT 
    ROUND(AVG(salary), 2) as average_salary,
    MIN(salary) as min_salary,
    MAX(salary) as max_salary,
    COUNT(*) as total_employees
FROM employees;

-- ========================================

-- Бонус 3: Самый опытный сотрудник
-- Ожидаемый результат: Сотрудник с самой ранней датой найма
SELECT 
    first_name,
    last_name,
    department,
    position,
    hire_date,
    EXTRACT(YEAR FROM age(CURRENT_DATE, hire_date)) as years_in_company
FROM employees 
WHERE hire_date = (SELECT MIN(hire_date) FROM employees);

-- Альтернативное решение с LIMIT:
SELECT 
    first_name,
    last_name,
    department,
    position,
    hire_date,
    EXTRACT(YEAR FROM age(CURRENT_DATE, hire_date)) as years_in_company
FROM employees 
ORDER BY hire_date
LIMIT 1;

-- ========================================
-- ДОПОЛНИТЕЛЬНЫЕ ПОЛЕЗНЫЕ ЗАПРОСЫ
-- ========================================

-- Проверка корректности данных
SELECT 
    'Общее количество сотрудников' as metric,
    COUNT(*) as value
FROM employees
UNION ALL
SELECT 
    'Активных сотрудников',
    COUNT(*)
FROM employees 
WHERE active = true
UNION ALL
SELECT 
    'Количество отделов',
    COUNT(DISTINCT department)
FROM employees;

-- Быстрая статистика по зарплатам
SELECT 
    department,
    COUNT(*) as employees,
    MIN(salary) as min_salary,
    ROUND(AVG(salary), 2) as avg_salary,
    MAX(salary) as max_salary
FROM employees 
GROUP BY department
ORDER BY avg_salary DESC;

-- Проверка иерархии (менеджеры и подчиненные)
SELECT 
    e.first_name || ' ' || e.last_name as employee,
    e.position,
    COALESCE(m.first_name || ' ' || m.last_name, 'Нет менеджера') as manager
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id
ORDER BY e.department, e.last_name;

-- ========================================
-- КОММЕНТАРИИ К РЕШЕНИЯМ
-- ========================================

/*
ОСНОВНЫЕ ПРИНЦИПЫ:

1. ЧИТАЕМОСТЬ
   - Используйте отступы и переносы строк для сложных запросов
   - Давайте осмысленные имена алиасам (AS clause)
   - Комментируйте сложную логику

2. ПРОИЗВОДИТЕЛЬНОСТЬ
   - Выбирайте только нужные поля вместо SELECT *
   - Используйте индексы (WHERE по индексированным полям)
   - Добавляйте LIMIT для больших результатов

3. ТОЧНОСТЬ
   - Будьте внимательны к типам данных
   - Учитывайте NULL значения
   - Проверяйте граничные случаи

4. БЕЗОПАСНОСТЬ
   - Всегда валидируйте входные данные
   - Используйте параметризованные запросы в приложениях
   - Не включайте чувствительную информацию в логи

РАСПРОСТРАНЕННЫЕ ОШИБКИ:
- Забыть точку с запятой в конце запроса
- Неправильный регистр в именах полей (PostgreSQL чувствителен к регистру)
- Путаница между = и LIKE для текстового поиска
- Забыть GROUP BY при использовании агрегатных функций

СЛЕДУЮЩИЕ ШАГИ:
1. Поэкспериментируйте с различными комбинациями условий
2. Попробуйте создать собственные вариации запросов
3. Изучите план выполнения с помощью EXPLAIN
4. Подготовьтесь к модулю 01 - основы SQL и баз данных
*/ 