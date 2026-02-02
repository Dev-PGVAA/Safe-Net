# Safe-Net Административная Панель

Полнофункциональная административная панель для управления LMS-платформой Safe-Net, разработанная на Next.js 16 с React 19 и TypeScript. Backend API построен на NestJS 10 с использованием Prisma ORM и PostgreSQL .

## 📋 Содержание

- [Функционал](#функционал)
- [Технологический стек](#технологический-стек)
- [Установка и Docker](#установка-и-docker)
- [Структура проекта](#структура-проекта)
- [Решение проблем](#решение-проблем)
- [API Endpoints](#api-endpoints)

## ✨ Функционал

- 📊 **Dashboard:** Интерактивная статистика платформы с автообновлением каждые 30 секунд .
- 👥 **Управление пользователями:** Полный цикл CRUD, управление ролями, блокировка и детальная аналитика активности .
- 📚 **Управление контентом:** Иерархия (Этапы → Курсы → Уроки), поддержка Markdown и 6 типов практических заданий .
- 📈 **Аналитика:** Детальные отчеты по завершению курсов, средним баллам и динамике роста платформы .

## 🛠 Технологический стек

### Frontend & Backend

| Слой            | Технологии                                                          |
| :-------------- | :------------------------------------------------------------------ |
| **Frontend**    | Next.js 16, React 19, Tailwind CSS 4, Radix UI, TanStack Query v5 . |
| **Backend**     | NestJS 10, Prisma 7, PostgreSQL, Passport JWT, Argon2 .             |
| **Инструменты** | Docker, Zod, Axios, Lucide React, Framer Motion .                   |

## 📦 Установка и Docker

### Шаг 1: Клонирование и запуск контейнеров

```bash
git clone https://github.com/yourusername/safe-net-admin.git
cd safe-net-admin
docker-compose up -d
```

Убедитесь, что контейнер `safe-net-postgres` запущен через `docker-compose ps`. База данных доступна на порту **5433**. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/85906560/94e4b485-baf9-49ba-9f16-a46722ff97e4/DOCKER_SETUP.md)

### Шаг 2: Настройка окружения (Server)

Создайте файл `server/.env` на основе предоставленных данных:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/safenet?schema=public
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-key-here
```

**Важно:** Порт 5433 используется для предотвращения конфликтов с локальным PG на 5432. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/85906560/94e4b485-baf9-49ba-9f16-a46722ff97e4/DOCKER_SETUP.md)

### Шаг 3: Инициализация БД и запуск

1. **Установка зависимостей:** Выполните `npm install` в папках `client` и `server` .
2. **База данных:** В папке `server` выполните `npx prisma migrate dev` и `npx prisma db seed`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/85906560/94e4b485-baf9-49ba-9f16-a46722ff97e4/DOCKER_SETUP.md)
3. **Проверка:** Запустите `npm run check-db` для подтверждения связи с PostgreSQL. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/85906560/94e4b485-baf9-49ba-9f16-a46722ff97e4/DOCKER_SETUP.md)

## 🆘 Решение проблем

- **Connection Refused:** Проверьте статус контейнера (`docker-compose ps`) и убедитесь, что порт 5433 не занят другим процессом. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/85906560/94e4b485-baf9-49ba-9f16-a46722ff97e4/DOCKER_SETUP.md)
- **Authentication Failed:** Сверьте логин (`postgres`) и пароль (`postgres`) в файле `.env`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/85906560/94e4b485-baf9-49ba-9f16-a46722ff97e4/DOCKER_SETUP.md)
- **Database does not exist:** Если база не создалась автоматически, используйте `docker-compose exec postgres psql -U postgres` и выполните `CREATE DATABASE safenet;`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/85906560/94e4b485-baf9-49ba-9f16-a46722ff97e4/DOCKER_SETUP.md)
- **Relation does not exist:** Означает, что миграции не были применены. Запустите `npx prisma migrate dev`. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/85906560/94e4b485-baf9-49ba-9f16-a46722ff97e4/DOCKER_SETUP.md)

## 🗂 Полезные команды Docker

- `docker-compose down -v` — остановить контейнеры и полностью удалить данные БД. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/85906560/94e4b485-baf9-49ba-9f16-a46722ff97e4/DOCKER_SETUP.md)
- `docker-compose logs -f postgres` — просмотр логов базы в реальном времени. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/85906560/94e4b485-baf9-49ba-9f16-a46722ff97e4/DOCKER_SETUP.md)
- `npx prisma studio` — запуск графического интерфейса для управления данными в браузере .
