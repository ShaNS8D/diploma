import { Link } from 'react-router-dom';

const HomeContent = ({ isAuthenticated }) => {
  return (
    <div className="home-content">
      <p>Welcome to our cloud storage service. Store, manage and share your files securely.</p>
      
      {isAuthenticated ? (
        <div className="auth-links">
          <Link to="/storage" className="btn primary">
            Go to My Storage
          </Link>
        </div>
      ) : (
        <div className="auth-links">
          <Link to="/login" className="btn primary">
            Login
          </Link>
          <Link to="/register" className="btn secondary">
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default HomeContent;