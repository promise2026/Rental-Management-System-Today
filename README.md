# Rental Management System

A **Django REST Framework (DRF) backend + React frontend** property rental platform, currently being prepared for **Dockerization and production deployment**.

> **Branch:** `deployment_preparation`  
> **Status:** Pre-Dockerization — the backend is fully implemented as a DRF API; the React frontend lives in `rental-frontend/` and is wired to the API via CORS (`http://localhost:5173`).

---

## 1. Project Overview

The Rental Management System (branded **propertyConnect**) is a full-stack rental platform that connects accommodation seekers with property owners and agents in Uganda. It exposes a RESTful API built with **Django REST Framework** and is intended to be consumed by a **React** frontend.

**Architecture (decoupled):**

- **Backend:** Django 6.0.3 + Django REST Framework 3.18.3 — stateless API, token-based authentication, SQLite (dev) / PostgreSQL-ready (prod via `psycopg2-binary`), served with Gunicorn.
- **Frontend:** React 19 + Vite, located in `rental-frontend/` (dev server on port 5173).
- **Communication:** JSON over HTTP; the React app calls the DRF API endpoints (e.g. `/api/properties/`, `/api/accounts/`, `/api/inquiries/`).
- **Media:** Property images are uploaded via `MediaField` and served under `/media/`.

**User roles:** Seeker, Owner, Agent (plus Django staff/admin).

---

## 2. Current Project Structure

```text
rental-management-system/
├── manage.py                       # Django CLI entry point
├── requirements.txt                # Python production dependencies
├── package.json                    # Root Node file (Bootstrap only — not a React app)
├── .gitignore                      # Django + Node ignore rules
├── README.md                       # This file
│
├── rental_system_main/             # Django project configuration package
│   ├── __init__.py
│   ├── settings.py                 # Django settings (SECRET_KEY, DB, CORS, DRF, etc.)
│   ├── urls.py                     # Root URL router
│   ├── wsgi.py                     # WSGI application (Gunicorn entry point)
│   └── asgi.py                     # ASGI application
│
├── properties/                     # Django app: property listings
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py                   # PropertyType, PropertyOwnership, PropertyRegistration,
│   │                               # PropertyImage, PropertyInquiry
│   ├── serializers.py              # DRF serializers for all property models
│   ├── views.py                    # DRF ViewSets (ModelViewSet) + role-based permissions
│   ├── urls.py                     # DRF DefaultRouter routes under /api/
│   ├── tests.py                    # API test cases
│   └── migrations/
│       └── 0001_initial.py
│
├── accounts/                       # Django app: user accounts & profiles
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py                   # UserProfile, FavoriteProperty
│   ├── serializers.py              # Register/Login/Profile/Favorite serializers
│   ├── views.py                    # RegisterView, LoginView, LogoutView, MyProfileView, FavoritePropertyView
│   ├── urls.py                     # Routes under /api/accounts/
│   └── migrations/
│       └── 0001_initial.py
│
├── rental-frontend/                # React + Vite frontend (Vite dev server, port 5173)
│   ├── index.html                  # Vite entry HTML
│   ├── vite.config.js              # Vite config with @vitejs/plugin-react
│   ├── package.json                # React 19, react-router-dom, Vite, ESLint
│   ├── eslint.config.js            # ESLint flat config
│   └── src/                        # React source (main.jsx, Pages, components, etc.)
│
├── templates/                      # Legacy Django-rendered templates (no longer used by the API)
│   ├── base.html                   # Base template with Bootstrap navbar/footer
│   └── homepage.html               # Homepage extending base.html
│
├── static/                         # Legacy static assets (Bootstrap CSS/JS, images)
│   ├── css/bootstrap.min.css
│   ├── js/bootstrap.bundle.js
│   └── images/houses_for_rent.jpg
│
└── db.sqlite3                      # Local SQLite database (gitignored)
```

---

## 1. Project Overview

The Rental Management System (branded **propertyConnect**) is a full-stack rental platform that connects accommodation seekers with property owners and agents in Uganda. It exposes a RESTful API built with **Django REST Framework** and is intended to be consumed by a **React** frontend.

**Architecture (decoupled):**

- **Backend:** Django 6.0.3 + Django REST Framework 3.18.3 — stateless API, token-based authentication, SQLite (dev) / PostgreSQL-ready (prod via `psycopg2-binary`), served with Gunicorn.
- **Frontend:** React (CORS origin configured for `http://localhost:5173`, indicating Vite on port 5173). *Frontend source is not yet present in this branch; scaffold it under `frontend/` or `client/` as part of the Dockerization effort.*
- **Communication:** JSON over HTTP; the React app calls the DRF API endpoints (e.g. `/api/properties/`, `/api/accounts/`, `/api/inquiries/`).
- **Media:** Property images are uploaded via `MediaField` and served under `/media/`.

**User roles:** Seeker, Owner, Agent (plus Django staff/admin).


## 3. Backend Details

### 3.1 Python / Django Version & Core Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Django | `6.0.3` | Web framework |
| djangorestframework | `3.18.3` | REST API framework |
| djangorestframework_simplejwt | `5.5.1` | JWT authentication (installed; DRF currently uses TokenAuthentication) |
| django-cors-headers | `4.9.0` | Cross-Origin Resource sharing (React on `localhost:5173`) |
| django-filter | `26.2` | Filtering backend for DRF |
| django-rest-framework authtoken | `rest_framework.authtoken` | Token authentication (built-in, listed in INSTALLED_APPS) |
| gunicorn | `26.2.0` | Production WSGI HTTP server |
| pillow | `12.2.0` | Image handling for `ImageField` |
| psycopg2-binary | `2.9.13` | PostgreSQL adapter (for production DB) |
| PyJWT | `2.15.1` | JWT encoding/decoding |
| asgiref | `3.11.1` | ASGI compatibility |
| sqlparse | `0.5.5` | SQL formatting |
| tzdata | `2025.3` | Timezone data |

Full list is in `requirements.txt` at the repository root.

Install with:
```bash
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### 3.2 Database Configuration

- **Development:** SQLite, file `db.sqlite3` at project root (`DATABASES.default.ENGINE = django.db.backends.sqlite3`).
- **Production target:** PostgreSQL via `psycopg2-binary` (already in `requirements.txt`). Update `DATABASES` in `settings.py` and provide connection credentials via environment variables when Dockerizing.

### 3.3 Key Settings (`rental_system_main/settings.py`)

| Setting | Value / Notes |
|---------|---------------|
| `SECRET_KEY` | `'django-insecure-change-this-to-your-existing-secret-key'` — **must be changed via env var in production** |
| `DEBUG` | `True` (set to `False` in production) |
| `ALLOWED_HOSTS` | `['127.0.0.1', 'localhost']` |
| `INSTALLED_APPS` | Django contrib + `rest_framework`, `rest_framework.authtoken`, `corsheaders`, `django_filters` + local apps `properties`, `accounts` |
| `ROOT_URLCONF` | `rental_system_main.urls` |
| `WSGI_APPLICATION` | `rental_system_main.wsgi.application` |
| `ASGI_APPLICATION` | `rental_system_main.asgi.application` |
| `DATABASES` | SQLite (`db.sqlite3`) |
| `LANGUAGE_CODE` | `en-us` |
| `TIME_ZONE` | `Africa/Kampala` |
| `USE_TZ` | `True` |
| `STATIC_URL` | `static/` |
| `MEDIA_URL` | `/media/` |
| `MEDIA_ROOT` | `BASE_DIR / 'media'` |
| `DEFAULT_AUTO_FIELD` | `django.db.models.BigAutoField` |
| `CORS_ALLOWED_ORIGINS` | `['http://localhost:5173']` — Vite dev server |
| `REST_FRAMEWORK.DEFAULT_AUTHENTICATION_CLASSES` | `TokenAuthentication` |
| `REST_FRAMEWORK.DEFAULT_PERMISSION_CLASSES` | `IsAuthenticated` |
| `REST_FRAMEWORK.DEFAULT_FILTER_BACKENDS` | `DjangoFilterBackend`, `SearchFilter`, `OrderingFilter` |
| `REST_FRAMEWORK.DEFAULT_PAGINATION_CLASS` | `PageNumberPagination` (`PAGE_SIZE = 10`) |

### 3.4 Environment Variables

No `.env` or `.env.example` exists yet. For Dockerization, move the following into environment variables:

- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS` (comma-separated)
- `DATABASE_URL` / `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
- `CORS_ALLOWED_ORIGINS`

Recommended approach: use `python-decouple`, `django-environ`, or read `os.environ.get(...)` directly in `settings.py`.

### 3.5 Entry Points

| File | Purpose |
|------|---------|
| `manage.py` | Django administration CLI. Sets `DJANGO_SETTINGS_MODULE=rental_system_main.settings` |
| `rental_system_main/wsgi.py` | WSGI callable `application` — used by Gunicorn in production |
| `rental_system_main/asgi.py` | ASGI callable `application` — for async deployments |
| `rental_system_main/urls.py` | Root URLconf: `/admin/`, `/api/` (properties), `/api/accounts/` |

Run the dev server:
```bash
python manage.py runserver
```

Common Django commands:
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py collectstatic   # for production static files
python manage.py test            # run the test suite
```

## 4. Frontend Details

### 4.1 Framework / Library

- **Stack:** React 19 + Vite (CORS origin `http://localhost:5173`).
- **Package manager:** npm (scripts: `dev`, `build`, `lint`, `preview`).
- **Frontend source:** Present in `rental-frontend/` — React 19 + Vite, dev server on port 5173.

### 4.2 Build & Development Commands

Run from the `rental-frontend/` directory:

```bash
# Install dependencies
npm install

# Start dev server (port 5173)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Preview production build
npm run preview
```

**Note:** The dev server runs on port 5173, which matches `CORS_ALLOWED_ORIGINS` in Django `settings.py`. For production, update `CORS_ALLOWED_ORIGINS` to your frontend's production domain.


## 5. Existing Legacy Assets

The project originated as a pure Django server-rendered application. The following legacy folders/files remain and are **no longer needed** now that the system is a DRF API + React SPA. They can be removed during cleanup before Dockerization:

| Path | Description |
|------|-------------|
| `templates/base.html` | Django base template with Bootstrap navbar/footer |
| `templates/homepage.html` | Server-rendered homepage |
| `static/css/bootstrap.min.css` | Bootstrap 5.3.8 CSS (legacy) |
| `static/js/bootstrap.bundle.js` | Bootstrap 5.3.8 JS bundle (legacy) |
| `static/images/houses_for_rent.jpg` | Placeholder property image (legacy) |

**Why they're no longer needed:** The backend now serves JSON via DRF ViewSets (`/api/properties/`, `/api/accounts/`, etc.), and the frontend (React) will consume those endpoints directly. Django templates and static HTML are not rendered by any active URL route — `rental_system_main/urls.py` only wires up `/admin/`, the properties API router, and `/api/accounts/`.

> **Recommendation:** Delete `templates/`, `static/`, and the root `package.json` (Bootstrap should move into the React app's own dependencies) once the API is verified.

## 6. Getting Started

### Backend

```bash
# 1. Clone and enter the repo (you're already on branch deployment_preparation)
git checkout deployment_preparation

# 2. Create & activate a virtual environment
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate

# 3. Install Python dependencies
pip install -r requirements.txt

# 4. Apply migrations
python manage.py migrate

# 5. Create a superuser
python manage.py createsuperuser

# 6. Run the development server
python manage.py runserver
```

API base URL: `http://127.0.0.1:8000/api/`  
Admin: `http://127.0.0.1:8000/admin/`

### Frontend

```bash
# 1. Enter the frontend directory
cd rental-frontend

# 2. Install dependencies
npm install

# 3. Start the Vite dev server (port 5173)
npm run dev
```

The frontend dev server proxies to the Django API at `http://127.0.0.1:8000`. Ensure the backend is running first.


## 7. Next Steps for Dockerization

1. **React frontend already exists** at `rental-frontend/` (React 19 + Vite). Point `CORS_ALLOWED_ORIGINS` at it in production.
2. **Replace hardcoded settings** with environment variables (`SECRET_KEY`, `DEBUG`, `DATABASE_URL`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`).
3. **Add `Dockerfile`** (multi-stage: backend + frontend) and `docker-compose.yml` at repo root.
4. **Add `.env.example`** documenting required variables.
5. **Switch `DATABASES` to PostgreSQL** using `psycopg2-binary` already in `requirements.txt`.
6. **Remove legacy assets** (`templates/`, `static/`, root `package.json`) once the React app is in place.
7. **Add Gunicorn as the production WSGI server** entry point (`gunicorn rental_system_main.wsgi:application`).

---

*Prepared for the `deployment_preparation` branch in preparation for Dockerization and production deployment.*
**Note:** Update `CORS_ALLOWED_ORIGINS` in Django `settings.py` to match the frontend's actual dev/prod origin (e.g. `http://localhost:5173` in dev, your production domain in prod).

