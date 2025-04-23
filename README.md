# Дипломный проект профессии «Fullstack-разработчик на Python»

## Облачное хранилище «MyCloud»

Этот README содержит информацию по развертыванию проекте на боевом сервере, а также рекомендации по настройке бэкэнда и фронтэнда.

## Оглавление

- [Дипломный проект профессии «Fullstack-разработчик на Python»](#дипломный-проект-профессии-fullstack-разработчик-на-python)
  - [Облачное хранилище «MyCloud»](#облачное-хранилище-mycloud)
  - [Оглавление](#оглавление)
  - [Общая информация](#общая-информация)
  - [Настройка сервера](#настройка-сервера)
    - [PostgreSQL](#postgresql)
    - [Nginx](#nginx)
    - [Прочие настройки](#прочие-настройки)
  - [Ссылки на документацию](#ссылки-на-документацию)

## Общая информация

Информация разбита на три основных блока:

- **Бэкэнд** 
- **Фронтэнд**
- **Серверная часть**

## Настройка сервера

   Зарегистрируйтесь на хостинге.
   Добавьте свои SSH-ключи.
   Сменить пароль ROOT-пользователю.
   Создать нового пользователя (добавив пароль).
   Нового пользователя добавить в группу SUDO.
   Установить пакеты виртуальной среды venv для python и пакетного менеджера pip.
   Установить NODEjs и npm

1. Создать папку внужном месте

2. Клонировать в нее репозиторий

### PostgreSQL

1. Установите PostgreSQL:

   sudo apt update
   sudo apt install postgresql postgresql-contrib
   Проверить статус postgresql

2. Создайте базу данных и пользователя:
   sudo su postgres
   psql

   CREATE USER your_user WITH SUPERUSER;
   ALERT USER your_user WITH PASSWORD 'your_password';
   
   создаем системную папку для нового пользователя

   CREATE DATABASE your_user;

   \q
   exit
   psql

   CREATE DATABASE your_project_name;

   \q

### Nginx 

1. Установите Nginx:

   sudo apt install nginx

2. Настройте конфигурацию Nginx для вашего проекта. Эти настройки делать после gunicorn. Пример конфигурации:

server {
   listen 80;
   server_name 89.111.155.26;

   access_log /var/log/nginx/levsha8d.access.log;
   error_log /var/log/nginx/levsha8d.error.log;

   sendfile on;
   tcp_nopush on;
   tcp_nodelay on;
   keepalive_timeout 65;
   types_hash_max_size 2048;
   server_tokens off;

   location /backend-static/ {
      alias /var/www/levsha8d/backend/my_cloud/staticfiles/;
      expires max;
      add_header Cache-Control "public";
   }

   location /media/ {
      alias /var/www/levsha8d/backend/my_cloud/media/;
      expires max;
      add_header Cache-Control "public";
   }

   location / {
      root /var/www/levsha8d/frontend/build;
      index index.html;
      try_files $uri /index.html;
   }

   location /api/v1/ {
      proxy_pass http://unix:/var/www/levsha8d/backend/my_cloud/gunicorn.sock;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
   }

   location /admin/ {
      proxy_pass http://unix:/var/www/levsha8d/backend/my_cloud/gunicorn.sock;
      proxy_set_header Host $host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;
   }
}

3. Делаем символическую ссылку

    sudo ln -s /etc/nginx/sites-available/levsha8d.conf /etc/nginx/sites-enabled


4. Перезапустите Nginx:

   sudo systemctl restart nginx


### Прочие настройки

1. Настройте файрвол (если необходимо):

  sudo ufw allow 'Nginx Full'
  sudo ufw enable

## Ссылки на документацию

- [Backend README](backend/README.md): Инструкции по настройке и запуску бэкэнда.
- [Frontend README](frontend/README.md): Инструкции по настройке и сборке фронтэнда.
