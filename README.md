# Дипломный проект профессии «Fullstack-разработчик на Python»

## Облачное хранилище «MyCloud»

## Порядок действий
### Создание виртуального окружения
python -m venv venv

### Активация виртуального окружения
venv\Scripts\activate

### Обновление пакета pip
python.exe -m pip install --upgrade pip

### Установка необходимых пакетов
pip install django djangorestframework psycopg2-binary ....

### Создание requirements.txt
pip freeze > requirements.txt

### Инициализация проекта
django-admin startproject my_cloud

### Переход в папку проекта
cd my_cloud

### Создание приложения
python manage.py startapp cloud_app