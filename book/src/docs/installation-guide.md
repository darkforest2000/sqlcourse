# Инструкция по установке и настройке среды

## Необходимое программное обеспечение

### 1. PostgreSQL (версия 14 или выше)

#### Windows
1. Скачайте установщик с официального сайта: https://www.postgresql.org/download/windows/
2. Запустите установщик и следуйте инструкциям
3. **Важно**: Запомните пароль для пользователя `postgres`
4. Оставьте порт по умолчанию (5432)
5. При выборе компонентов убедитесь, что выбраны:
   - PostgreSQL Server
   - pgAdmin 4
   - Command Line Tools

#### macOS
```bash
# Используя Homebrew (рекомендуется)
brew install postgresql
brew install --cask pgadmin4

# Запуск службы PostgreSQL
brew services start postgresql

# Создание пользователя (если нужно)
createuser -s postgres
```

#### Linux (Ubuntu/Debian)
```bash
# Обновление пакетов
sudo apt update

# Установка PostgreSQL
sudo apt install postgresql postgresql-contrib

# Запуск службы
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Установка pgAdmin (опционально)
sudo apt install pgadmin4
```

### 2. pgAdmin 4 (GUI-клиент)

Если не установился вместе с PostgreSQL:
- Windows/macOS: https://www.pgadmin.org/download/
- Linux: `sudo apt install pgadmin4` или используйте веб-версию

### 3. Альтернативные клиенты (опционально)

#### Консольный клиент psql
Устанавливается вместе с PostgreSQL. Запуск:
```bash
psql -U postgres -h localhost
```

#### Другие GUI-клиенты
- **DBeaver** (бесплатный, кроссплатформенный)
- **DataGrip** (платный, от JetBrains)
- **Navicat** (платный)

## Настройка базы данных для курса

### 1. Первое подключение

#### Через pgAdmin
1. Откройте pgAdmin 4
2. Создайте новое подключение:
   - Host: `localhost`
   - Port: `5432`
   - Username: `postgres`
   - Password: [ваш пароль]

#### Через psql
```bash
psql -U postgres -h localhost
```

### 2. Создание базы данных для курса

```sql
-- Создание базы данных
CREATE DATABASE sql_course;

-- Подключение к базе данных
\c sql_course;

-- Проверка подключения
SELECT current_database();
```

### 3. Создание пользователя для работы

```sql
-- Создание пользователя
CREATE USER course_student WITH PASSWORD 'student123';

-- Предоставление прав
GRANT ALL PRIVILEGES ON DATABASE sql_course TO course_student;

-- Для PostgreSQL 15+ дополнительно нужно:
\c sql_course;
GRANT ALL ON SCHEMA public TO course_student;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO course_student;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO course_student;
```

## Установка демонстрационной базы данных

### Вариант 1: Использование готового дампа
```bash
# Скачивание демо-данных (будет создан позже)
wget https://github.com/[your_repo]/sql-yaru/raw/main/assets/datasets/demo_db.sql

# Восстановление из дампа
psql -U postgres -d sql_course -f demo_db.sql
```

### Вариант 2: Создание тестовых данных вручную
```sql
-- Подключение к базе курса
\c sql_course;

-- Создание простой таблицы для первых экспериментов
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    department VARCHAR(50),
    salary DECIMAL(10, 2),
    hire_date DATE DEFAULT CURRENT_DATE
);

-- Вставка тестовых данных
INSERT INTO employees (first_name, last_name, email, department, salary) VALUES
    ('Иван', 'Петров', 'ivan.petrov@company.com', 'IT', 80000),
    ('Мария', 'Сидорова', 'maria.sidorova@company.com', 'HR', 65000),
    ('Алексей', 'Иванов', 'alexey.ivanov@company.com', 'IT', 90000),
    ('Елена', 'Козлова', 'elena.kozlova@company.com', 'Marketing', 70000),
    ('Дмитрий', 'Смирнов', 'dmitry.smirnov@company.com', 'Finance', 75000);

-- Проверка создания данных
SELECT * FROM employees;
```

## Проверка установки

### Тест подключения и основных операций
```sql
-- 1. Проверка версии PostgreSQL
SELECT version();

-- 2. Проверка текущей базы данных
SELECT current_database();

-- 3. Проверка списка таблиц
\dt

-- 4. Простой запрос к данным
SELECT COUNT(*) FROM employees;

-- 5. Проверка расширений PostgreSQL
SELECT * FROM pg_available_extensions WHERE name LIKE '%postgis%';
```

### Ожидаемые результаты
- ✅ PostgreSQL версии 14+ установлен и запущен
- ✅ База данных `sql_course` создана
- ✅ Пользователь `course_student` создан с необходимыми правами
- ✅ Тестовая таблица `employees` создана и содержит данные
- ✅ pgAdmin или другой клиент успешно подключается

## Решение частых проблем

### Проблема: "Could not connect to server"
**Решение**: 
1. Проверьте, что служба PostgreSQL запущена
2. Убедитесь в правильности порта (обычно 5432)
3. Проверьте настройки файрвола

### Проблема: "authentication failed"
**Решение**:
1. Проверьте правильность пароля
2. Убедитесь, что используете правильное имя пользователя
3. Проверьте файл `pg_hba.conf` (для продвинутых пользователей)

### Проблема: "permission denied"
**Решение**:
1. Убедитесь, что пользователь имеет права на базу данных
2. Выполните команды предоставления прав из раздела настройки

### Проблема: PostgreSQL не запускается
**Решение**:
- Windows: Проверьте службы Windows (services.msc)
- macOS: `brew services restart postgresql`
- Linux: `sudo systemctl restart postgresql`

## Дополнительные настройки для курса

### Установка расширения PostGIS (для модуля 02)
```sql
-- Подключение как суперпользователь
\c sql_course postgres;

-- Создание расширения
CREATE EXTENSION IF NOT EXISTS postgis;

-- Проверка установки
SELECT PostGIS_Version();
```

### Настройки производительности для обучения
```sql
-- Включение отображения времени выполнения запросов
\timing

-- Включение подробного вывода планов запросов
SET work_mem = '4MB';
SET shared_buffers = '128MB';
```

## Готовность к курсу

После выполнения всех шагов у вас должно быть:
- ✅ Установленный и настроенный PostgreSQL
- ✅ Рабочий GUI-клиент (pgAdmin или аналог)
- ✅ База данных `sql_course` с тестовыми данными
- ✅ Понимание базовых команд подключения и проверки

**Поздравляем! Вы готовы к изучению SQL! 🎉** 