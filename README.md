# Дипломный проект профессии «Fullstack-разработчик на Python»

## Облачное хранилище «MyCloud»

Этот README содержит информацию по развертыванию проекте на боевом сервере, а также рекомендации по настройке бэкэнда и фронтэнда.

## Оглавление

1. [Общая информация](#общая-информация)
2. [Настройка сервера](#настройка-сервера)
   - [PostgreSQL](#postgresql)
   - [Nginx](#nginx)
   - [Прочие настройки](#прочие-настройки)
3. [Ссылки на документацию](#ссылки-на-документацию)

---

## Общая информация

Информация разбита на три основных блока:
- **Бэкэнд** 
- **Фронтэнд**
- **Серверная часть**

---

## Настройка сервера

### PostgreSQL

1. Установите PostgreSQL:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```
2. Создайте базу данных и пользователя:
   ```sql
   CREATE DATABASE your_project_name;
   CREATE USER your_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE your_project_name TO your_user;
   ```

### Nginx

1. Установите Nginx:
   ```bash
   sudo apt install nginx
   ```
2. Настройте конфигурацию Nginx для вашего проекта. Пример конфигурации:
   ```nginx
   server {
       listen 80;
       server_name your_domain_or_ip;

       location / {
           proxy_pass http://127.0.0.1:8000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }

       location /static/ {
           alias /path/to/your/static/files/;
       }
   }
   ```
3. Перезапустите Nginx:
   ```bash
   sudo systemctl restart nginx
   ```

### Прочие настройки

- Убедитесь, что все необходимые зависимости установлены (например, Python, Node.js).
- Настройте файрвол (если необходимо):
  ```bash
  sudo ufw allow 'Nginx Full'
  sudo ufw enable
  ```

---

## Ссылки на документацию

- [Backend README](backend/README.md): Инструкции по настройке и запуску бэкэнда.
- [Frontend README](frontend/README.md): Инструкции по настройке и сборке фронтэнда.
```

---

### **backend/README.md**

```markdown
# Backend: Django Rest Framework (DRF)

Этот README содержит инструкции по настройке и запуску бэкэнда через WSGI.

## Оглавление

1. [Установка зависимостей](#установка-зависимостей)
2. [Настройка переменных окружения](#настройка-переменных-окружения)
3. [Миграции и создание суперпользователя](#миграции-и-создание-суперпользователя)
4. [Запуск через WSGI](#запуск-через-wsgi)

---

## Установка зависимостей

1. Убедитесь, что у вас установлен Python 3.x.
2. Создайте виртуальное окружение:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Установите зависимости:
   ```bash
   pip install -r requirements.txt
   ```

---

## Настройка переменных окружения

Создайте файл `.env` в корне проекта и добавьте следующие переменные:

```env
SECRET_KEY=your_secret_key
DEBUG=True
DB_NAME=your_project_name
DB_USER=your_user
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

---

## Миграции и создание суперпользователя

1. Примените миграции:
   ```bash
   python manage.py migrate
   ```
2. Создайте суперпользователя:
   ```bash
   python manage.py createsuperuser
   ```

---

## Запуск через WSGI

1. Убедитесь, что ваш сервер настроен на работу с WSGI (например, через Gunicorn):
   ```bash
   gunicorn your_project_name.wsgi:application --bind 0.0.0.0:8000
   ```
2. Проверьте работу бэкэнда по адресу `http://your_domain_or_ip:8000`.
```

---

### **frontend/README.md**

```markdown
# Frontend: React.js

Этот README содержит инструкции по настройке и сборке фронтэнда.

## Оглавление

1. [Установка зависимостей](#установка-зависимостей)
2. [Настройка переменных окружения](#настройка-переменных-окружения)
3. [Сборка проекта](#сборка-проекта)
4. [Запуск для разработки](#запуск-для-разработки)

---

## Установка зависимостей

1. Убедитесь, что у вас установлен Node.js и npm.
2. Установите зависимости:
   ```bash
   npm install
   ```

---

## Настройка переменных окружения

Создайте файл `.env` в корне проекта и добавьте необходимые переменные, например:

```env
REACT_APP_API_URL=http://your_backend_url
```

---

## Сборка проекта

Для создания production-билда выполните команду:
```bash
npm run build
```
Собранные файлы будут находиться в папке `build`.

---

## Запуск для разработки

Для запуска проекта в режиме разработки выполните:
```bash
npm start
```
Проект будет доступен по адресу `http://localhost:3000`.
```

---

Теперь у вас есть три готовых файла: `README.md` в корне репозитория, `backend/README.md` и `frontend/README.md`. Каждый файл содержит четкие инструкции для своей части проекта, а общий README связывает их воедино.