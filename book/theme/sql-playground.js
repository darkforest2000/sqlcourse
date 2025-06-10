// SQL Playground для mdBook
// Использует sql.js (SQLite WASM) для выполнения SQL в браузере

class SQLPlayground {
    constructor() {
        this.sqlWorker = null;
        this.databases = new Map();
        this.editors = new Map();
        this.loadCodeMirror().then(() => this.initSQLjs());
    }

    async loadCodeMirror() {
        try {
            // Загружаем CodeMirror CSS
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css';
            document.head.appendChild(cssLink);

            // Загружаем темы
            const themeLink = document.createElement('link');
            themeLink.rel = 'stylesheet';
            themeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/dracula.min.css';
            document.head.appendChild(themeLink);

            const lightThemeLink = document.createElement('link');
            lightThemeLink.rel = 'stylesheet';
            lightThemeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/eclipse.min.css';
            document.head.appendChild(lightThemeLink);

            // Загружаем CodeMirror JS
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js');
            
            // Загружаем SQL режим
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/sql/sql.min.js');
            
            console.log('CodeMirror загружен успешно');
        } catch (error) {
            console.error('Ошибка загрузки CodeMirror:', error);
        }
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async initSQLjs() {
        try {
            // Загружаем sql.js из CDN
            const SQL = await initSqlJs({
                locateFile: file => `https://sql.js.org/dist/${file}`
            });
            
            this.SQL = SQL;
            this.setupPlaygrounds();
            this.setupResizeHandler();
        } catch (error) {
            console.error('Ошибка загрузки sql.js:', error);
        }
    }

    setupPlaygrounds() {
        // Находим все SQL блоки с классами runnable или editable
        const sqlBlocks = document.querySelectorAll('pre code[class*="language-sql"]');
        
        sqlBlocks.forEach((block, index) => {
            const classes = block.className;
            
            // Проверяем, содержит ли класс editable
            if (classes.includes('editable')) {
                this.createEditablePlayground(block, index);
            }
            // Иначе если содержит runnable (но не editable)
            else if (classes.includes('runnable')) {
                this.createPlayground(block, index);
            }
        });
    }

    createPlayground(codeBlock, index) {
        const container = document.createElement('div');
        container.className = 'sql-playground';
        
        const runButton = document.createElement('button');
        runButton.className = 'sql-run-button';
        runButton.textContent = '▶ Выполнить SQL';
        runButton.onclick = () => this.runSQL(codeBlock, index);

        const resetButton = document.createElement('button');
        resetButton.className = 'sql-reset-button';
        resetButton.textContent = '🔄 Сбросить данные';
        resetButton.onclick = () => this.resetDatabase(index);

        const resultContainer = document.createElement('div');
        resultContainer.className = 'sql-result';
        resultContainer.id = `sql-result-${index}`;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'sql-buttons';
        buttonContainer.appendChild(runButton);
        buttonContainer.appendChild(resetButton);

        container.appendChild(buttonContainer);
        container.appendChild(resultContainer);

        // Вставляем playground после блока кода
        codeBlock.closest('pre').insertAdjacentElement('afterend', container);

        // Инициализируем базу данных для этого playground
        this.initDatabase(index);
    }

    createEditablePlayground(codeBlock, index) {
        const container = document.createElement('div');
        container.className = 'sql-playground editable';
        
        // Создаем контейнер для редактора
        const editorContainer = document.createElement('div');
        editorContainer.className = 'sql-editor-container';
        editorContainer.id = `sql-editor-${index}`;

        // Создаем CodeMirror редактор
        const editor = window.CodeMirror(editorContainer, {
            value: codeBlock.textContent.trim(),
            mode: 'text/x-sql',
            theme: this.getTheme(),
            lineNumbers: true,
            lineWrapping: true,
            indentUnit: 2,
            smartIndent: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            placeholder: 'Введите ваш SQL запрос здесь...',
            extraKeys: {
                'Ctrl-Enter': () => this.runEditableSQL(editor, index),
                'Cmd-Enter': () => this.runEditableSQL(editor, index)
            }
        });

        // Сохраняем ссылку на редактор
        this.editors.set(index, editor);

        // Останавливаем mdBook от переключения глав по стрелкам
        editor.on('keydown', (cm, event) => {
            if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
                event.stopPropagation();
            }
        });

        // Обновляем тему при изменении темы сайта
        this.watchThemeChanges(editor);

        // Принудительно обновляем редактор после вставки в DOM
        setTimeout(() => {
            editor.refresh();
            editor.focus();
        }, 100);

        const runButton = document.createElement('button');
        runButton.className = 'sql-run-button';
        runButton.innerHTML = '⚡ Выполнить SQL <span class="keyboard-hint">Ctrl+Enter</span>';
        runButton.onclick = () => this.runEditableSQL(editor, index);

        const resetButton = document.createElement('button');
        resetButton.className = 'sql-reset-button';
        resetButton.textContent = '🔄 Сбросить данные';
        resetButton.onclick = () => this.resetDatabase(index);

        const clearButton = document.createElement('button');
        clearButton.className = 'sql-clear-button';
        clearButton.textContent = '📋 Очистить код';
        clearButton.onclick = () => {
            editor.setValue('');
            editor.focus();
        };

        const resultContainer = document.createElement('div');
        resultContainer.className = 'sql-result';
        resultContainer.id = `sql-result-${index}`;

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'sql-buttons';
        buttonContainer.appendChild(runButton);
        buttonContainer.appendChild(resetButton);
        buttonContainer.appendChild(clearButton);

        container.appendChild(editorContainer);
        container.appendChild(buttonContainer);
        container.appendChild(resultContainer);

        // Вставляем playground после блока кода
        codeBlock.closest('pre').insertAdjacentElement('afterend', container);
        
        // Скрываем оригинальный блок кода
        codeBlock.closest('pre').style.display = 'none';

        // Дополнительное обновление после полной вставки в DOM
        requestAnimationFrame(() => {
            editor.refresh();
            // Устанавливаем правильную высоту
            const wrapper = editor.getWrapperElement();
            if (wrapper) {
                wrapper.style.height = 'auto';
                const scroll = wrapper.querySelector('.CodeMirror-scroll');
                if (scroll) {
                    scroll.style.minHeight = '120px';
                }
            }
        });

        // Инициализируем базу данных для этого playground
        this.initDatabase(index);
    }

    getTheme() {
        // Определяем тему на основе класса body или html
        const isDark = document.documentElement.classList.contains('navy') || 
                      document.body.classList.contains('navy');
        return isDark ? 'dracula' : 'eclipse';
    }

    watchThemeChanges(editor) {
        // Создаем наблюдатель за изменениями темы
        const observer = new MutationObserver(() => {
            editor.setOption('theme', this.getTheme());
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
    }

    runEditableSQL(editor, index) {
        const sql = editor.getValue().trim();
        if (!sql) {
            const resultContainer = document.getElementById(`sql-result-${index}`);
            resultContainer.innerHTML = '<div class="sql-error">Введите SQL запрос для выполнения</div>';
            return;
        }

        const db = this.databases.get(index);
        const resultContainer = document.getElementById(`sql-result-${index}`);

        if (!db) {
            resultContainer.innerHTML = '<div class="sql-error">База данных не инициализирована</div>';
            return;
        }

        try {
            const startTime = performance.now();
            let results = [];

            // Разбиваем на отдельные запросы
            const statements = sql.split(';').filter(stmt => stmt.trim());

            for (const statement of statements) {
                if (!statement.trim()) continue;

                const stmt = db.prepare(statement);
                const upperStatement = statement.trim().toUpperCase();
                
                // Убираем комментарии для проверки типа запроса
                const cleanStatement = upperStatement
                    .split('\n')
                    .map(line => line.replace(/--.*$/, '').trim())
                    .filter(line => line.length > 0)
                    .join(' ');
                

                
                if (cleanStatement.startsWith('SELECT') || 
                    cleanStatement.startsWith('WITH') ||
                    cleanStatement.includes('RETURNING')) {
                    // Для SELECT запросов собираем результаты
                    const result = {
                        sql: statement.trim(),
                        columns: stmt.getColumnNames(),
                        rows: []
                    };

                    while (stmt.step()) {
                        result.rows.push(stmt.get());
                    }

                    results.push(result);
                    stmt.free();
                } else {
                    // Для других запросов (INSERT, UPDATE, DELETE, CREATE)
                    stmt.run();
                    const changes = db.getRowsModified();
                    results.push({
                        sql: statement.trim(),
                        message: `Запрос выполнен успешно. Затронуто строк: ${changes}`
                    });
                    stmt.free();
                }
            }

            const executionTime = (performance.now() - startTime).toFixed(2);
            this.displayResults(results, executionTime, resultContainer);

        } catch (error) {
            resultContainer.innerHTML = `<div class="sql-error">Ошибка: ${error.message}</div>`;
        }
    }

    initDatabase(index) {
        if (!this.SQL) return;

        const db = new this.SQL.Database();
        
        // Создаем базовые таблицы из курса
        const setupSQL = `
            -- Таблица сотрудников
            CREATE TABLE employees (
                id INTEGER PRIMARY KEY,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                department TEXT,
                position TEXT,
                salary DECIMAL(10, 2),
                hire_date DATE,
                manager_id INTEGER,
                active BOOLEAN DEFAULT 1
            );

            -- Таблица отделов
            CREATE TABLE departments (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                budget DECIMAL(12, 2),
                location TEXT
            );

            -- Вставляем тестовые данные
            INSERT INTO departments (id, name, description, budget, location) VALUES
                (1, 'IT', 'Информационные технологии', 2000000, 'Москва'),
                (2, 'HR', 'Управление персоналом', 800000, 'Москва'),
                (3, 'Marketing', 'Маркетинг и реклама', 1200000, 'Санкт-Петербург'),
                (4, 'Finance', 'Финансовый отдел', 600000, 'Москва'),
                (5, 'Sales', 'Отдел продаж', 1500000, 'Новосибирск');

            INSERT INTO employees VALUES
                (1, 'Иван', 'Петров', 'ivan.petrov@company.com', 'IT', 'Ведущий разработчик', 150000, '2020-01-15', NULL, 1),
                (2, 'Мария', 'Козлова', 'maria.kozlova@company.com', 'IT', 'Frontend разработчик', 120000, '2021-03-20', 1, 1),
                (3, 'Алексей', 'Сидоров', 'alexey.sidorov@company.com', 'IT', 'Backend разработчик', 130000, '2020-11-05', 1, 1),
                (4, 'Елена', 'Волкова', 'elena.volkova@company.com', 'IT', 'DevOps инженер', 140000, '2021-06-10', 1, 1),
                (5, 'Дмитрий', 'Смирнов', 'dmitry.smirnov@company.com', 'IT', 'QA инженер', 100000, '2022-02-01', 1, 1),
                (6, 'Анна', 'Иванова', 'anna.ivanova@company.com', 'HR', 'HR менеджер', 90000, '2019-05-12', NULL, 1),
                (7, 'Сергей', 'Федоров', 'sergey.fedorov@company.com', 'HR', 'Рекрутер', 70000, '2021-09-15', 6, 1),
                (8, 'Ольга', 'Морозова', 'olga.morozova@company.com', 'Marketing', 'Маркетинг менеджер', 95000, '2020-07-08', NULL, 1),
                (9, 'Николай', 'Лебедев', 'nikolay.lebedev@company.com', 'Marketing', 'SMM специалист', 65000, '2022-01-20', 8, 1),
                (10, 'Татьяна', 'Орлова', 'tatyana.orlova@company.com', 'Marketing', 'Контент менеджер', 60000, '2021-12-10', 8, 1);
        `;

        try {
            db.exec(setupSQL);
            this.databases.set(index, db);
        } catch (error) {
            console.error('Ошибка инициализации БД:', error);
        }
    }

    resetDatabase(index) {
        this.initDatabase(index);
        const resultContainer = document.getElementById(`sql-result-${index}`);
        resultContainer.innerHTML = '<div class="sql-success">База данных сброшена к исходному состоянию</div>';
    }

    runSQL(codeBlock, index) {
        const sql = codeBlock.textContent.trim();
        const db = this.databases.get(index);
        const resultContainer = document.getElementById(`sql-result-${index}`);

        if (!db) {
            resultContainer.innerHTML = '<div class="sql-error">База данных не инициализирована</div>';
            return;
        }

        try {
            const startTime = performance.now();
            let results = [];

            // Разбиваем на отдельные запросы
            const statements = sql.split(';').filter(stmt => stmt.trim());

            for (const statement of statements) {
                if (!statement.trim()) continue;

                const stmt = db.prepare(statement);
                const upperStatement = statement.trim().toUpperCase();
                
                // Убираем комментарии для проверки типа запроса
                const cleanStatement = upperStatement
                    .split('\n')
                    .map(line => line.replace(/--.*$/, '').trim())
                    .filter(line => line.length > 0)
                    .join(' ');
                

                
                if (cleanStatement.startsWith('SELECT') || 
                    cleanStatement.startsWith('WITH') ||
                    cleanStatement.includes('RETURNING')) {
                    // Для SELECT запросов собираем результаты
                    const result = {
                        sql: statement.trim(),
                        columns: stmt.getColumnNames(),
                        rows: []
                    };

                    while (stmt.step()) {
                        result.rows.push(stmt.get());
                    }

                    results.push(result);
                    stmt.free();
                } else {
                    // Для других запросов (INSERT, UPDATE, DELETE, CREATE)
                    stmt.run();
                    const changes = db.getRowsModified();
                    results.push({
                        sql: statement.trim(),
                        message: `Запрос выполнен успешно. Затронуто строк: ${changes}`
                    });
                    stmt.free();
                }
            }

            const executionTime = (performance.now() - startTime).toFixed(2);
            this.displayResults(results, executionTime, resultContainer);

        } catch (error) {
            resultContainer.innerHTML = `<div class="sql-error">Ошибка: ${error.message}</div>`;
        }
    }

    displayResults(results, executionTime, container) {
        let html = `<div class="sql-execution-time">⚡ ${executionTime}мс</div>`;

        for (const result of results) {
            if (result.columns && result.rows) {
                // Результат SELECT запроса
                if (result.rows.length === 0) {
                    html += '<div class="sql-no-results">📊 Запрос выполнен, но результатов нет</div>';
                } else {
                    html += '<div class="sql-result-header">📋 Результат запроса:</div>';
                    html += '<table class="sql-table">';
                    
                    // Заголовки
                    html += '<thead><tr>';
                    result.columns.forEach(col => {
                        html += `<th>${col}</th>`;
                    });
                    html += '</tr></thead>';
                    
                    // Данные
                    html += '<tbody>';
                    result.rows.forEach(row => {
                        html += '<tr>';
                        row.forEach(cell => {
                            html += `<td>${cell !== null ? cell : '<em class="null-value">NULL</em>'}</td>`;
                        });
                        html += '</tr>';
                    });
                    html += '</tbody></table>';
                    
                    html += `<div class="sql-row-count">✅ Найдено записей: ${result.rows.length}</div>`;
                }
            } else if (result.message) {
                // Результат других запросов
                html += `<div class="sql-success">✅ ${result.message}</div>`;
            }
        }

        container.innerHTML = html;
    }

    setupResizeHandler() {
        // Обновляем все редакторы при изменении размера окна
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.editors.forEach(editor => {
                    editor.refresh();
                });
            }, 100);
        });
    }
}

// Загрузка sql.js и инициализация
function loadSQLjs() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://sql.js.org/dist/sql-wasm.js';
        script.onload = () => {
            window.initSqlJs = window.initSqlJs || window.SQL;
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadSQLjs();
        new SQLPlayground();
    } catch (error) {
        console.error('Ошибка загрузки SQL playground:', error);
    }
}); 