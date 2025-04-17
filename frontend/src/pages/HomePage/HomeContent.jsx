import { Link } from 'react-router-dom';

const HomeContent = ({ isAuthenticated }) => {
  return (
    <div className="home-content">
      <p>Добро пожаловать в наш сервис облачного хранения. Надежно храните свои файлы, управляйте ими и предоставляйте к ним общий доступ.</p>
      
      {isAuthenticated ? (
        <div className="auth-links">
          <Link to="/storage" className="btn primary">
            К моему хранилищу
          </Link>
        </div>
      ) : (
        <div className="auth-links">
          <Link to="/login" className="btn primary">
            Войти
          </Link>
          <Link to="/register" className="btn secondary">
            Зарегистрироваться
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomeContent;