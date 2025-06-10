#!/bin/bash

# Скрипт для запуска документации SQL курса
# Использование: ./start-docs.sh

echo "🚀 Запуск документации SQL для разработки..."

# Проверяем, установлен ли mdbook
if ! command -v mdbook &> /dev/null; then
    echo "❌ mdbook не найден. Устанавливаю..."
    
    # Проверяем наличие Homebrew (macOS)
    if command -v brew &> /dev/null; then
        brew install mdbook
    # Проверяем наличие Cargo (Rust)
    elif command -v cargo &> /dev/null; then
        cargo install mdbook
    else
        echo "❌ Не удалось найти brew или cargo для установки mdbook"
        echo "Установите mdbook вручную: https://rust-lang.github.io/mdBook/guide/installation.html"
        exit 1
    fi
fi

# Переходим в папку с книгой
cd book

# Запускаем сервер разработки
echo "📚 Запуск локального сервера..."
echo "🌐 Документация будет доступна по адресу: http://localhost:3000"
echo "🔄 Автоматическое обновление при изменении файлов включено"
echo ""
echo "Для остановки нажмите Ctrl+C"

mdbook serve --hostname 127.0.0.1 --port 3000 --open 