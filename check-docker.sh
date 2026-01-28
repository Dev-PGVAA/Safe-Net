#!/bin/bash

echo "🔍 Проверка статуса Docker контейнера PostgreSQL..."
echo ""

# Проверка статуса контейнера
if docker-compose ps | grep -q "safe-net-postgres.*Up"; then
    echo "✅ Контейнер запущен"
    docker-compose ps
    echo ""
    echo "📋 Логи контейнера (последние 20 строк):"
    docker-compose logs postgres --tail=20
else
    echo "❌ Контейнер не запущен или не найден"
    echo ""
    echo "Запуск контейнера..."
    docker-compose up -d
    echo ""
    echo "Ожидание готовности базы данных (10 секунд)..."
    sleep 10
    docker-compose ps
fi

echo ""
echo "🔌 Проверка доступности порта 5433..."
if lsof -i :5433 > /dev/null 2>&1; then
    echo "✅ Порт 5433 занят (это нормально, если контейнер запущен)"
    lsof -i :5433
else
    echo "⚠️  Порт 5433 свободен (контейнер может быть не запущен)"
fi
