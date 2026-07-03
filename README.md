# VAI Radiology Task

A small full-stack web app that combines task management and image annotation.

The frontend is built with Next.js and TypeScript. The backend is built with Django, Django ORM, and Django REST Framework.

## Deployed URLs

- Frontend: `https://vairadiology.vercel.app`
- Backend: `https://vairadiology.onrender.com`
- Backend API base: `https://vairadiology.onrender.com/api`

## Features

### Login

Users can log in with email and password.

Demo login:

```text
Email: demo@example.com
Password: demo12345
```

### Tasks

Page: `/tasks`

- Kanban board with three columns:
  - To Do
  - In Progress
  - Done
- Date picker for viewing tasks by day
- Add, edit, and delete tasks
- Drag tasks between columns
- Task fields:
  - title
  - priority
  - due date
  - tags

### Image annotation

Page: `/annotate`

- Upload images
- View uploaded images in a scrollable list
- Draw polygons on images
- Select saved polygons
- Delete selected polygons
- Save polygon data to the backend

## Tech stack

### Frontend

- Next.js
- React
- TypeScript
- Zustand
- dnd-kit
- CSS modules/global CSS

### Backend

- Django
- Django REST Framework
- Django ORM
- SQLite
- Gunicorn for deployment
- uv for Python package management

## Project structure

```text
vairadiologytask/
├── backend/
│   ├── config/
│   ├── core/
│   ├── media/
│   ├── manage.py
│   └── pyproject.toml
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── store/
│   └── package.json
└── README.md
```

## Backend setup

From the `backend` folder:

```bash
uv sync
uv run python manage.py migrate
uv run python manage.py runserver 8000
```

The backend will run at:

```text
http://localhost:8000
```

## Frontend setup

From the `frontend` folder:

```bash
npm install
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

## Frontend environment variable

For local development with the local backend:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

For the deployed backend:

```env
NEXT_PUBLIC_API_BASE_URL=https://vairadiology.onrender.com/api
```

## Backend environment variables

For deployment, configure these values:

```env
DEBUG=False
SECRET_KEY=<your-secret-key>
FRONTEND_URL=https://vairadiology.vercel.app
```

## Render backend deployment

Render settings:

```text
Root Directory: backend
Build Command: uv sync && uv run python manage.py migrate
Start Command: uv run gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```

## Demo user

The backend includes a migration that creates this demo user:

```text
Email: demo@example.com
Password: demo12345
```

This is for demo use only.

## Notes

- SQLite is used for the backend database.
- Uploaded images are stored in the backend media folder.
- Polygon points are stored as normalized coordinates so they stay aligned when images resize.
- The app is intended as a clean demo implementation, not a production-ready authentication system.
