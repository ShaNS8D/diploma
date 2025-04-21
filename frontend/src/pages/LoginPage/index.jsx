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
    username: '',
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
    // console.log('handleSubmit login',result);
    
    if (!result.success) {
      setErrors({ form: result.error.message });
    } else {
      navigate('/storage');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="login-page">
      <AuthForm title="Вход" onSubmit={handleSubmit}>
        <AuthInput
          name="username"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Введите логин"
          error={errors.username}
          label="Логин"
        />
        <AuthInput
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Введите пароль"
          error={errors.password}
          label="Пароль"
        />
        
        {errors.form && <div className="form-error">{errors.form}</div>}
        
        <AuthButton disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </AuthButton>
        
        <div className="auth-footer">
        У вас нет учетной записи? <Link to="/register">Зарегистрируйся</Link>
        </div>
      </AuthForm>
    </div>
  );
};

export default LoginPage;