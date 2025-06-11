// SQL Playground for mdBook - PostgreSQL Proxy Version
// Connects to a backend proxy to execute SQL queries against a PostgreSQL database.

class SQLPlayground {
    constructor() {
        this.editors = new Map();
        this.loadCodeMirror().then(() => {
            this.setupPlaygrounds();
        });
    }

    async loadCodeMirror() {
        try {
            const cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css';
            document.head.appendChild(cssLink);

            const themeLink = document.createElement('link');
            themeLink.rel = 'stylesheet';
            themeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/dracula.min.css';
            document.head.appendChild(themeLink);
            
            const lightThemeLink = document.createElement('link');
            lightThemeLink.rel = 'stylesheet';
            lightThemeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/eclipse.min.css';
            document.head.appendChild(lightThemeLink);

            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js');
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/sql/sql.min.js');
            console.log('CodeMirror loaded successfully');
        } catch (error) {
            console.error('Failed to load CodeMirror:', error);
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

    setupPlaygrounds() {
        const sqlBlocks = document.querySelectorAll('pre code[class*="language-sql"]');
        sqlBlocks.forEach((block, index) => {
            if (block.className.includes('editable')) {
                this.createEditablePlayground(block, index);
            } else if (block.className.includes('runnable')) {
                this.createRunnablePlayground(block, index);
            }
        });
    }

    createRunnablePlayground(codeBlock, index) {
        const container = document.createElement('div');
        container.className = 'sql-playground';
        
        const runButton = document.createElement('button');
        runButton.className = 'sql-run-button';
        runButton.textContent = '▶ Выполнить SQL';
        
        const resultContainer = document.createElement('div');
        resultContainer.className = 'sql-result';
        
        runButton.onclick = () => this.runSQL(codeBlock.textContent.trim(), resultContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'sql-buttons';
        buttonContainer.appendChild(runButton);

        container.appendChild(buttonContainer);
        container.appendChild(resultContainer);
        
        codeBlock.closest('pre').insertAdjacentElement('afterend', container);
    }
    
    createEditablePlayground(codeBlock, index) {
        const container = document.createElement('div');
        container.className = 'sql-playground editable';
        
        const editorContainer = document.createElement('div');
        editorContainer.className = 'sql-editor-container';

        const editor = window.CodeMirror(editorContainer, {
            value: codeBlock.textContent.trim(),
            mode: 'text/x-sql',
            theme: this.getTheme(),
            lineNumbers: true,
            lineWrapping: true,
            smartIndent: true,
            placeholder: 'Введите ваш SQL запрос здесь...',
            extraKeys: {
                'Ctrl-Enter': (cm) => this.runSQL(cm.getValue(), resultContainer),
                'Cmd-Enter': (cm) => this.runSQL(cm.getValue(), resultContainer)
            }
        });
        this.editors.set(index, editor);
        this.watchThemeChanges(editor);

        const runButton = document.createElement('button');
        runButton.className = 'sql-run-button';
        runButton.innerHTML = '⚡ Выполнить SQL <span class="keyboard-hint">Ctrl+Enter</span>';
        
        const clearButton = document.createElement('button');
        clearButton.className = 'sql-clear-button';
        clearButton.textContent = '📋 Очистить код';

        const resultContainer = document.createElement('div');
        resultContainer.className = 'sql-result';

        runButton.onclick = () => this.runSQL(editor.getValue(), resultContainer);
        clearButton.onclick = () => {
            editor.setValue('');
            editor.focus();
        };

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'sql-buttons';
        buttonContainer.appendChild(runButton);
        buttonContainer.appendChild(clearButton);

        container.appendChild(editorContainer);
        container.appendChild(buttonContainer);
        container.appendChild(resultContainer);

        codeBlock.closest('pre').style.display = 'none';
        codeBlock.closest('pre').insertAdjacentElement('afterend', container);

        setTimeout(() => editor.refresh(), 100);
    }

    async runSQL(sql, resultContainer) {
        if (!sql.trim()) {
            this.renderError({ error: 'SQL запрос не может быть пустым.' }, resultContainer);
            return;
        }

        resultContainer.innerHTML = '<div class="sql-loader">Выполняется запрос...</div>';

        try {
            const response = await fetch('http://localhost:3001/api/sql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sql }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw result;
            }

            this.renderResults(result, resultContainer);
        } catch (err) {
            console.error('SQL execution error:', err);
            this.renderError(err, resultContainer);
        }
    }

    renderResults({ columns, rows }, container) {
        container.innerHTML = '';
        if (rows.length === 0) {
            container.innerHTML = '<div class="sql-info">Запрос выполнен успешно, но не вернул строк.</div>';
            return;
        }

        const table = document.createElement('table');
        table.className = 'sql-table';

        const thead = table.createTHead();
        const headerRow = thead.insertRow();
        columns.forEach(colName => {
            const th = document.createElement('th');
            th.textContent = colName;
            headerRow.appendChild(th);
        });

        const tbody = table.createTBody();
        rows.forEach(row => {
            const tr = tbody.insertRow();
            columns.forEach(colName => {
                const td = tr.insertCell();
                const value = row[colName];
                td.textContent = value === null ? 'NULL' : value;
            });
        });

        container.appendChild(table);
    }

    renderError(error, container) {
        container.innerHTML = '';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'sql-error';
        
        let errorMessage = 'Неизвестная ошибка';
        if (typeof error.error === 'string') {
            errorMessage = error.error;
        } else if (error.message) {
            errorMessage = error.message;
        }
        
        errorDiv.textContent = `Ошибка выполнения: ${errorMessage}`;
        
        if (error.details) {
            const detailsDiv = document.createElement('pre');
            detailsDiv.className = 'sql-error-details';
            detailsDiv.textContent = `Details: ${JSON.stringify(error.details, null, 2)}`;
            errorDiv.appendChild(detailsDiv);
        }

        container.appendChild(errorDiv);
    }

    getTheme() {
        const isDark = document.documentElement.classList.contains('navy') || document.body.classList.contains('navy');
        return isDark ? 'dracula' : 'eclipse';
    }

    watchThemeChanges(editor) {
        const observer = new MutationObserver(() => {
            editor.setOption('theme', this.getTheme());
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }
}

// Initialize the playground logic when the window loads
window.addEventListener('load', () => {
    new SQLPlayground();
}); 