# Установка зависимостей
npm i
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