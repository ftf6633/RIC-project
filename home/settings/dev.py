'''Use this for development'''

from .base import *

# ALLOWED_HOSTS += ['*']
# DEBUG = True

WSGI_APPLICATION = 'home.wsgi.dev.application'

DATABASES = {
 'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'airport',
        'USER':'root',
        'PASSWORD':'',
        'HOST':'127.0.0.1',
        'PORT':'3306',
		'OPTIONS': {
            'charset': 'utf8mb4',
            'use_unicode': True,
        }
	}
}
