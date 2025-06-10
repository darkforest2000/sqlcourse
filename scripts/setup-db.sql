-- SQL скрипт инициализации базы данных для курса "SQL для разработки"
-- Выполните этот скрипт как пользователь postgres

-- ============================================
-- 1. СОЗДАНИЕ БАЗЫ ДАННЫХ И ПОЛЬЗОВАТЕЛЯ
-- ============================================

-- Создание базы данных для курса
DROP DATABASE IF EXISTS sql_course;
CREATE DATABASE sql_course 
    WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'ru_RU.UTF-8'
    LC_CTYPE = 'ru_RU.UTF-8'
    TEMPLATE = template0;

-- Создание пользователя для работы с курсом
DROP USER IF EXISTS course_student;
CREATE USER course_student WITH 
    PASSWORD 'student123'
    CREATEDB
    LOGIN;

-- Предоставление прав на базу данных
GRANT ALL PRIVILEGES ON DATABASE sql_course TO course_student;

-- Подключение к созданной базе данных
\c sql_course;

-- Предоставление прав на схему public (для PostgreSQL 15+)
GRANT ALL ON SCHEMA public TO course_student;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO course_student;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO course_student;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO course_student;

-- ============================================
-- 2. СОЗДАНИЕ ДЕМОНСТРАЦИОННЫХ ТАБЛИЦ
-- ============================================

-- Таблица сотрудников для начальных упражнений
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50),
    position VARCHAR(100),
    salary DECIMAL(10, 2),
    hire_date DATE DEFAULT CURRENT_DATE,
    manager_id INTEGER REFERENCES employees(id),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица отделов
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    budget DECIMAL(12, 2),
    location VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица проектов
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'planned',
    department_id INTEGER REFERENCES departments(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица участия сотрудников в проектах (многие ко многим)
CREATE TABLE project_assignments (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id),
    project_id INTEGER REFERENCES projects(id),
    role VARCHAR(100),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    hours_per_week INTEGER DEFAULT 40,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, project_id)
);

-- ============================================
-- 3. НАПОЛНЕНИЕ ДЕМОНСТРАЦИОННЫМИ ДАННЫМИ
-- ============================================

-- Вставка отделов
INSERT INTO departments (name, description, budget, location) VALUES
    ('IT', 'Информационные технологии', 2000000, 'Москва'),
    ('HR', 'Управление персоналом', 800000, 'Москва'),
    ('Marketing', 'Маркетинг и реклама', 1200000, 'Санкт-Петербург'),
    ('Finance', 'Финансовый отдел', 600000, 'Москва'),
    ('Sales', 'Отдел продаж', 1500000, 'Новосибирск'),
    ('Support', 'Техническая поддержка', 400000, 'Москва');

-- Вставка сотрудников
INSERT INTO employees (first_name, last_name, email, department, position, salary, hire_date, manager_id) VALUES
    -- IT отдел
    ('Иван', 'Петров', 'ivan.petrov@company.com', 'IT', 'Ведущий разработчик', 150000, '2020-01-15', NULL),
    ('Мария', 'Козлова', 'maria.kozlova@company.com', 'IT', 'Frontend разработчик', 120000, '2021-03-20', 1),
    ('Алексей', 'Сидоров', 'alexey.sidorov@company.com', 'IT', 'Backend разработчик', 130000, '2020-11-05', 1),
    ('Елена', 'Волкова', 'elena.volkova@company.com', 'IT', 'DevOps инженер', 140000, '2021-06-10', 1),
    ('Дмитрий', 'Смирнов', 'dmitry.smirnov@company.com', 'IT', 'QA инженер', 100000, '2022-02-01', 1),
    
    -- HR отдел
    ('Анна', 'Иванова', 'anna.ivanova@company.com', 'HR', 'HR менеджер', 90000, '2019-05-12', NULL),
    ('Сергей', 'Федоров', 'sergey.fedorov@company.com', 'HR', 'Рекрутер', 70000, '2021-09-15', 6),
    
    -- Marketing отдел
    ('Ольга', 'Морозова', 'olga.morozova@company.com', 'Marketing', 'Маркетинг менеджер', 95000, '2020-07-08', NULL),
    ('Николай', 'Лебедев', 'nikolay.lebedev@company.com', 'Marketing', 'SMM специалист', 65000, '2022-01-20', 8),
    ('Татьяна', 'Орлова', 'tatyana.orlova@company.com', 'Marketing', 'Контент менеджер', 60000, '2021-12-10', 8),
    
    -- Finance отдел
    ('Михаил', 'Павлов', 'mikhail.pavlov@company.com', 'Finance', 'Финансовый аналитик', 85000, '2019-03-25', NULL),
    ('Екатерина', 'Новикова', 'ekaterina.novikova@company.com', 'Finance', 'Бухгалтер', 55000, '2020-10-30', 11),
    
    -- Sales отдел
    ('Владимир', 'Соколов', 'vladimir.sokolov@company.com', 'Sales', 'Менеджер по продажам', 80000, '2021-04-15', NULL),
    ('Юлия', 'Попова', 'yulia.popova@company.com', 'Sales', 'Менеджер по работе с клиентами', 75000, '2021-08-22', 13),
    
    -- Support отдел
    ('Андрей', 'Васильев', 'andrey.vasiliev@company.com', 'Support', 'Техподдержка L1', 50000, '2022-05-10', NULL),
    ('Светлана', 'Романова', 'svetlana.romanova@company.com', 'Support', 'Техподдержка L2', 60000, '2021-11-05', 15);

-- Вставка проектов
INSERT INTO projects (name, description, start_date, end_date, budget, status, department_id) VALUES
    ('Новый сайт компании', 'Разработка корпоративного сайта с современным дизайном', '2023-01-01', '2023-06-30', 500000, 'completed', 1),
    ('CRM система', 'Внедрение системы управления клиентами', '2023-03-15', '2023-12-31', 800000, 'in_progress', 1),
    ('Мобильное приложение', 'Разработка мобильного приложения для клиентов', '2023-06-01', '2024-03-31', 1200000, 'in_progress', 1),
    ('Маркетинговая кампания Q4', 'Продвижение новых продуктов в четвертом квартале', '2023-10-01', '2023-12-31', 300000, 'planned', 3),
    ('Автоматизация финансовой отчетности', 'Внедрение системы автоматического формирования отчетов', '2023-08-01', '2024-02-29', 400000, 'in_progress', 4),
    ('Обучение персонала', 'Программа повышения квалификации сотрудников', '2023-09-01', '2024-05-31', 200000, 'in_progress', 2);

-- Назначение сотрудников на проекты
INSERT INTO project_assignments (employee_id, project_id, role, start_date, end_date, hours_per_week) VALUES
    -- Новый сайт компании
    (1, 1, 'Техлид', '2023-01-01', '2023-06-30', 40),
    (2, 1, 'Frontend разработчик', '2023-01-15', '2023-06-15', 40),
    (3, 1, 'Backend разработчик', '2023-01-15', '2023-05-30', 40),
    (5, 1, 'QA инженер', '2023-04-01', '2023-06-30', 20),
    
    -- CRM система
    (1, 2, 'Архитектор', '2023-03-15', NULL, 20),
    (3, 2, 'Ведущий разработчик', '2023-03-15', NULL, 40),
    (4, 2, 'DevOps', '2023-04-01', NULL, 10),
    (5, 2, 'QA инженер', '2023-05-01', NULL, 30),
    
    -- Мобильное приложение
    (2, 3, 'Мобильный разработчик', '2023-06-01', NULL, 40),
    (5, 3, 'QA инженер', '2023-07-01', NULL, 20),
    
    -- Маркетинговая кампания
    (8, 4, 'Руководитель кампании', '2023-10-01', NULL, 40),
    (9, 4, 'SMM специалист', '2023-10-01', NULL, 30),
    (10, 4, 'Контент менеджер', '2023-10-01', NULL, 25),
    
    -- Автоматизация финансовой отчетности
    (11, 5, 'Аналитик', '2023-08-01', NULL, 30),
    (3, 5, 'Разработчик', '2023-09-01', NULL, 20),
    
    -- Обучение персонала
    (6, 6, 'Координатор программы', '2023-09-01', NULL, 15),
    (7, 6, 'Рекрутер', '2023-09-01', NULL, 10);

-- ============================================
-- 4. СОЗДАНИЕ ИНДЕКСОВ ДЛЯ ОПТИМИЗАЦИИ
-- ============================================

-- Индексы для часто используемых запросов
CREATE INDEX idx_employees_department ON employees(department);
CREATE INDEX idx_employees_hire_date ON employees(hire_date);
CREATE INDEX idx_employees_salary ON employees(salary);
CREATE INDEX idx_employees_active ON employees(active);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_department_id ON projects(department_id);
CREATE INDEX idx_projects_dates ON projects(start_date, end_date);

CREATE INDEX idx_project_assignments_employee ON project_assignments(employee_id);
CREATE INDEX idx_project_assignments_project ON project_assignments(project_id);

-- ============================================
-- 5. СОЗДАНИЕ ПРЕДСТАВЛЕНИЙ ДЛЯ УДОБСТВА
-- ============================================

-- Представление с полной информацией о сотрудниках
CREATE VIEW employee_details AS
SELECT 
    e.id,
    e.first_name,
    e.last_name,
    e.email,
    e.department,
    e.position,
    e.salary,
    e.hire_date,
    m.first_name || ' ' || m.last_name AS manager_name,
    EXTRACT(YEAR FROM age(CURRENT_DATE, e.hire_date)) AS years_in_company,
    e.active
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;

-- Представление проектов с информацией об отделах
CREATE VIEW project_overview AS
SELECT 
    p.id,
    p.name,
    p.description,
    p.start_date,
    p.end_date,
    p.budget,
    p.status,
    d.name AS department_name,
    COUNT(pa.employee_id) AS team_size
FROM projects p
JOIN departments d ON p.department_id = d.id
LEFT JOIN project_assignments pa ON p.id = pa.project_id
GROUP BY p.id, p.name, p.description, p.start_date, p.end_date, p.budget, p.status, d.name;

-- ============================================
-- 6. ВСТАВКА КОММЕНТАРИЕВ К ТАБЛИЦАМ
-- ============================================

COMMENT ON TABLE employees IS 'Таблица сотрудников компании';
COMMENT ON COLUMN employees.manager_id IS 'ID менеджера сотрудника (самоссылка)';
COMMENT ON COLUMN employees.active IS 'Активный ли сотрудник (не уволен)';

COMMENT ON TABLE departments IS 'Таблица отделов компании';
COMMENT ON TABLE projects IS 'Таблица проектов';
COMMENT ON TABLE project_assignments IS 'Назначения сотрудников на проекты (многие ко многим)';

-- ============================================
-- 7. НАСТРОЙКИ ДЛЯ КУРСА
-- ============================================

-- Включение расширений, которые могут понадобиться
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Создание функции для генерации тестовых данных (будет использована в упражнениях)
CREATE OR REPLACE FUNCTION generate_random_email(name TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(name) || '+' || floor(random() * 1000)::text || '@test.com';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 8. ФИНАЛЬНАЯ ПРОВЕРКА
-- ============================================

-- Проверка созданных объектов
\echo '============================================'
\echo 'ПРОВЕРКА УСТАНОВКИ:'
\echo '============================================'

\echo 'Таблицы:'
\dt

\echo ''
\echo 'Представления:'
\dv

\echo ''
\echo 'Количество записей в таблицах:'
SELECT 'employees' as table_name, count(*) as records FROM employees
UNION ALL
SELECT 'departments', count(*) FROM departments  
UNION ALL
SELECT 'projects', count(*) FROM projects
UNION ALL
SELECT 'project_assignments', count(*) FROM project_assignments;

\echo ''
\echo 'Пример запроса к представлению:'
SELECT * FROM employee_details LIMIT 3;

\echo ''
\echo '============================================'
\echo 'БАЗА ДАННЫХ КУРСА УСПЕШНО НАСТРОЕНА! ✅'
\echo 'Теперь вы можете подключаться как course_student'
\echo 'и начинать изучение SQL!'
\echo '============================================' 