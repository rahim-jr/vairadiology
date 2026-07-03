# VAI Workbench Backend

Django + SQLite backend for the two-in-one task management and image annotation app. It uses Django ORM models for tasks, uploaded images, and polygon annotations, with API endpoints exposed through Django REST Framework.

## Runtime versions

Implemented for:

- Python: 3.11+
- Package/environment manager: `uv`
- Django: 5.x
- Database: SQLite via Django ORM

Check your local versions:

```bash
python --version
uv --version
```

## Setup and run

From `backend/`:

```bash
uv sync
uv run python manage.py migrate
uv run python manage.py createsuperuser --username demo@example.com --email demo@example.com
uv run python manage.py runserver 8000
```

The frontend login page is prefilled with `demo@example.com`; use the password you chose when creating the superuser. Django's default auth uses `username`, so this project treats the username as the login email.

## Render deployment

Use these settings for a Render Python web service:

- Root Directory: `backend`
- Build Command: `uv sync && uv run python manage.py migrate`
- Start Command: `uv run gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

Recommended environment variables:

- `DEBUG=False`
- `SECRET_KEY=<generate-a-secure-secret>`
- `FRONTEND_URL=<your deployed frontend URL>`

## API overview

- `POST /api/auth/login/` — session login with email/password
- `POST /api/auth/logout/` — logout
- `GET /api/tasks/?date=YYYY-MM-DD` — tasks filtered by selected day
- `POST /api/tasks/` — create task
- `PATCH /api/tasks/{id}/` — edit task or move status
- `DELETE /api/tasks/{id}/` — delete task
- `GET /api/images/` — list uploaded images with polygons
- `POST /api/images/` — upload image
- `POST /api/images/{id}/polygons/` — save polygon for an image
- `DELETE /api/polygons/{id}/` — remove a specific polygon

## Implementation notes and villains faced

The main villain was keeping the annotation model simple while still making polygon data precise and portable. I store polygon coordinates as normalized `x/y` JSON points from `0` to `1`, so annotations remain aligned even when the frontend displays images at different sizes. Another villain was login scope: full production auth would require more hardening, but for this task the backend uses Django's session auth with a clean DRF login endpoint and a demo-user flow.

Task persistence is intentionally normalized around a `due_date` field and query filtering, which keeps the frontend date selector decoupled from the board UI while still making daily Kanban views fast and predictable.
