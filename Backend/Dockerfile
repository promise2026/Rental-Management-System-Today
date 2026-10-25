# ---------------------------------------------------------
# Backend — Django REST Framework (served with Gunicorn)
# ---------------------------------------------------------
FROM python:3.12-slim

# Keep Python from writing .pyc files and buffer stdout/stderr
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# System dependencies needed for PostgreSQL (psycopg2) and Pillow
RUN apt-get update \
    && apt-get install --no-install-recommends -y \
        libpq-dev \
        gcc \
        build-essential \
        libffi-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy backend code into the container
COPY . .

EXPOSE 8000

# Run Gunicorn (production WSGI server)
CMD ["gunicorn", "rental_system_main.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "3", "--timeout", "120"]