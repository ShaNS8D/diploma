import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    login: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(credentials));
    
    if (result.error) {
      setErrors({ form: result.error.message });
    } else {
      navigate('/storage');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="login-page">
      <AuthForm title="Login" onSubmit={handleSubmit}>
        <AuthInput
          name="login"
          value={credentials.login}
          onChange={handleChange}
          placeholder="Enter your login"
          error={errors.login}
          label="Login"
        />
        <AuthInput
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
          label="Password"
        />
        
        {errors.form && <div className="form-error">{errors.form}</div>}
        
        <AuthButton disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </AuthButton>
        
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </div>
      </AuthForm>
    </div>
  );
};

export default LoginPage;