from pathlib import Path


# ---------------------------------------------------------
# BASE DIRECTORY
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent


# ---------------------------------------------------------
# SECURITY
# ---------------------------------------------------------

SECRET_KEY = 'django-insecure-change-this-to-your-existing-secret-key'

DEBUG = True

ALLOWED_HOSTS = [
    '127.0.0.1',
    'localhost',
]


# ---------------------------------------------------------
# APPLICATIONS
# ---------------------------------------------------------

INSTALLED_APPS = [

    # Django applications
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party applications
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'django_filters',

    # Local applications
    'properties',
    'accounts',
]


# ---------------------------------------------------------
# MIDDLEWARE
# ---------------------------------------------------------

MIDDLEWARE = [

    'django.middleware.security.SecurityMiddleware',

    'corsheaders.middleware.CorsMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',

    'django.middleware.common.CommonMiddleware',

    'django.middleware.csrf.CsrfViewMiddleware',

    'django.contrib.auth.middleware.AuthenticationMiddleware',

    'django.contrib.messages.middleware.MessageMiddleware',

    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# ---------------------------------------------------------
# URL CONFIGURATION
# ---------------------------------------------------------

ROOT_URLCONF = 'rental_system_main.urls'


# ---------------------------------------------------------
# TEMPLATES
# ---------------------------------------------------------

TEMPLATES = [

    {
        'BACKEND':
            'django.template.backends.django.DjangoTemplates',

        'DIRS': [],

        'APP_DIRS': True,

        'OPTIONS': {

            'context_processors': [

                'django.template.context_processors.request',

                'django.contrib.auth.context_processors.auth',

                'django.contrib.messages.context_processors.messages',

            ],
        },
    },
]


# ---------------------------------------------------------
# WSGI
# ---------------------------------------------------------

WSGI_APPLICATION = 'rental_system_main.wsgi.application'


# ---------------------------------------------------------
# DATABASE
# ---------------------------------------------------------

DATABASES = {

    'default': {

        'ENGINE':
            'django.db.backends.sqlite3',

        'NAME':
            BASE_DIR / 'db.sqlite3',
    }
}


# ---------------------------------------------------------
# PASSWORD VALIDATION
# ---------------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [

    {
        'NAME':
            'django.contrib.auth.password_validation.'
            'UserAttributeSimilarityValidator',
    },

    {
        'NAME':
            'django.contrib.auth.password_validation.'
            'MinimumLengthValidator',
    },

    {
        'NAME':
            'django.contrib.auth.password_validation.'
            'CommonPasswordValidator',
    },

    {
        'NAME':
            'django.contrib.auth.password_validation.'
            'NumericPasswordValidator',
    },
]


# ---------------------------------------------------------
# INTERNATIONALIZATION
# ---------------------------------------------------------

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Africa/Kampala'

USE_I18N = True

USE_TZ = True


# ---------------------------------------------------------
# STATIC FILES
# ---------------------------------------------------------

STATIC_URL = 'static/'


# ---------------------------------------------------------
# MEDIA FILES
# ---------------------------------------------------------

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR / 'media'


# ---------------------------------------------------------
# DEFAULT PRIMARY KEY
# ---------------------------------------------------------

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

CORS_ALLOWED_ORIGINS = [

    'http://localhost:5173',

]


# ---------------------------------------------------------
# DJANGO REST FRAMEWORK
# ---------------------------------------------------------

REST_FRAMEWORK = {

    # Authentication
    'DEFAULT_AUTHENTICATION_CLASSES': [

        'rest_framework.authentication.TokenAuthentication',

    ],

    # Security
    'DEFAULT_PERMISSION_CLASSES': [

        'rest_framework.permissions.IsAuthenticated',

    ],

    # Filtering, searching and ordering
    'DEFAULT_FILTER_BACKENDS': [

        'django_filters.rest_framework.DjangoFilterBackend',

        'rest_framework.filters.SearchFilter',

        'rest_framework.filters.OrderingFilter',

    ],

    # Pagination
    'DEFAULT_PAGINATION_CLASS':
        'rest_framework.pagination.PageNumberPagination',

    'PAGE_SIZE': 10,

}