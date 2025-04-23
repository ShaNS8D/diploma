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
Зарегистрируйтесь на хостинге.
Добавьте свои SSH-ключи.
Сменить пароль ROOT-пользователю.
Создать нового пользователя (добавив пароль).
Нового пользователя добавить в группу SUDO.
Установить пакеты виртуальной среды venv для python и пакетного менеджера pip.
Установить NODEjs

### PostgreSQL

1. Установите PostgreSQL:

   sudo apt update
   sudo apt install postgresql postgresql-contrib
   Проверить статус postgresql


2. Создайте базу данных и пользователя:

   CREATE DATABASE your_project_name;
   CREATE USER your_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE your_project_name TO your_user;


### Nginx

1. Установите Nginx:

   sudo apt install nginx

2. Настройте конфигурацию Nginx для вашего проекта. Пример конфигурации:

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

3. Перезапустите Nginx:

   sudo systemctl restart nginx


### Прочие настройки

1. Создать папку внужном месте

2. Клонировать в нее репозиторий

3. Настройте файрвол (если необходимо):

  sudo ufw allow 'Nginx Full'
  sudo ufw enable


---

## Ссылки на документацию

- [Backend README](backend/README.md): Инструкции по настройке и запуску бэкэнда.
- [Frontend README](frontend/README.md): Инструкции по настройке и сборке фронтэнда.
