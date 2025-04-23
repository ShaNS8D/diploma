# Установка Node.js и npm

  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash -
  sudo apt-get install -y nodejs

  Проверка установки

  node -v должна быть 22.хх
  npm -v == 10.хх 

  Если нет npm , то

  sudo apt install npm

## Установка зависимостей

  npm i

## Настройка переменных окружения

Создайте файл `.env` в корне проекта и добавьте необходимые переменные, например:

REACT_APP_API_URL=http://your_backend_url

## Сборка проекта

Для создания production-билда выполните команду:

npm run build

Собранные файлы будут находиться в папке `build`.

## Ссылки на официальную документацию

Redux Toolkit: https://redux.js.org/tutorials/fundamentals  
Testing Library DOM: https://testing-library.com/docs/dom-testing-library/intro  
Jest DOM: https://github.com/testing-library/jest-dom#readme  
React Testing Library: https://testing-library.com/docs/react-testing-library/intro  
User Event: https://github.com/testing-library/user-event#readme  
Axios: https://axios.httpstat.us/#/docs/home  
React: https://react.dev/docs/getting-started  
React DOM: https://react.dev/reference/react-dom  
React Redux: https://react-redux.js.org/api  
React Router Dom: https://reactrouter.com/en/main  
Create React App (React Scripts): https://create-react-app.dev/docs/getting-started  
Redux: https://redux.js.org/api  
Web Vitals: https://nextjs.org/docs/pages/building-your-application/optimizing/web-vitals
