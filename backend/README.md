## Порядок действий

### Создание виртуального окружения
python3 -m venv venv

### Активация виртуального окружения
venv\Scripts\activate 
source venv/bin/activate для Ubuntu

### Установка необходимых зависимостей при развертывании проекта
pip install -r requirements.txt

### Создайте файл переменных среды .env
Такого содержания:
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
SECRET_KEY=
DEBUG=
ALLOWED_HOSTS=

Поместить рядом с файлом manage.py.

## Миграции и создание суперпользователя

1. Примените миграции:
   python manage.py migrate

2. Создайте суперпользователя:
   python manage.py createsuperuser

## Запуск через WSGI

1. Убедитесь, что ваш сервер настроен на работу с WSGI (например, через Gunicorn):

   gunicorn your_project_name.wsgi:application --bind 0.0.0.0:8000

2. Проверьте работу бэкэнда по адресу `http://your_domain_or_ip:8000`.



## Ссылки на официальную документацию
ASGIRef — документация: https://pypi.org/project/asgiref/
Colorama — документация: https://pypi.org/project/colorama/
Coverage — документация: https://coverage.readthedocs.io/en/latest/index.html
Django — документация: https://docs.djangoproject.com/en/stable/
Django CORS Headers — документация: https://pypi.org/project/django-cors-headers/
Django JS Asset — документация: https://pypi.org/project/django-js-asset/
Django REST Framework — документация: https://www.django-rest-framework.org/api-guide/
Factory Boy — документация: https://factoryboy.readthedocs.io/en/latest/
Faker — документация: https://faker.readthedocs.io/en/master/
IniConfig — документация: https://pypi.org/project/iniconfig/
Packaging — документация: https://pypi.org/project/packaging/
Pluggy — документация: https://pypi.org/project/pluggy/
Psycopg2 Binary — документация: https://pypi.org/project/psycopg2-binary/
Pytest — документация: https://docs.pytest.org/en/latest/
Pytest Django — документация: https://pytest-django.readthedocs.io/en/latest/
Python Dotenv — документация: https://pypi.org/project/python-dotenv/
SQLParse — документация: https://pypi.org/project/sqlparse/
TzData — документация: https://pypi.org/project/tzdata/

