# Task Board SPA

Task Board — одностраничное приложение для управления задачами, построенное на React + TypeScript + Vite.

## Стек

- **React 19** + TypeScript
- **Vite** — сборка и dev-сервер
- **Zustand** — стейт-менеджмент
- **React Hook Form** + **Zod** — формы и валидация
- **React Router** — маршрутизация
- **Axios** — HTTP-клиент
- **CSS Modules** — стилизация

## Функционал

- Авторизация (логин / регистрация)
- Kanban-доска с колонками по статусам
- Переключение вида (доска / список)
- Создание, редактирование, удаление задач
- Фильтрация по статусу, приоритету, поиск
- Модальные окна поверх основного контента
- Защищённые роуты (redirect на логин)

## Запуск

### 1. Бэкенд

```bash
git clone https://github.com/koshkinoko-hana/task-board-api.git
cd task-board-api
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run start:dev
```

Бэкенд запустится на `http://localhost:3000`  
Swagger: `http://localhost:3000/docs`

> **Node.js 20 LTS** рекомендуется для бэкенда (на Node 25+ может потребоваться Python и C++ Build Tools для компиляции `better-sqlite3`).

### 2. Фронтенд

```bash
cd final-app
npm install
npm run dev
```

Фронт запустится на `http://localhost:5173`

### Тестовые аккаунты

| Nickname | Password     | Role  |
|----------|-------------|-------|
| admin    | password123 | ADMIN |
| user     | password123 | USER  |

## Структура проекта (FSD)

```
src/
├── app/              # App, провайдеры, глобальные стили
├── pages/            # Страницы (Login, Register, Tasks, TaskDetail, TaskCreate)
├── widgets/          # Виджеты (Header)
├── features/         # Фичи (auth, tasks)
│   ├── auth/         # API, модель, схемы авторизации
│   └── tasks/        # API, модель, UI-компоненты задач
└── shared/           # Общие утилиты, типы, axios-инстанс
```