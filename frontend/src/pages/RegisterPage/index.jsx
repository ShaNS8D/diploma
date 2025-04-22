import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../../features/auth/authSlice';
import { handleAsyncError } from '../../features/error/errorSlice';
import AuthForm from '../../components/auth/AuthForm';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};    
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(userData.username)) {
      errors.username = 'Логин должен начинаться с буквы и состоять из 4-20 символов';
    }    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.email = 'Пожалуйста, введите действительный адрес электронной почты';
    }    
    if (userData.password.length < 6) {
      errors.password = 'Пароль должен содержать не менее 6 символов';
    } else if (!/[A-Z]/.test(userData.password)) {
      errors.password = 'Пароль должен содержать хотя бы одну заглавную букву';
    } else if (!/[0-9]/.test(userData.password)) {
      errors.password = 'Пароль должен содержать хотя бы одну цифру';
    } else if (!/[^A-Za-z0-9]/.test(userData.password)) {
      errors.password = 'Пароль должен содержать хотя бы один специальный символ';
    }    
    if (userData.password !== userData.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }    
    if (Object.keys(errors).length > 0) {
      // console.log('RegisterPage', errors);
      dispatch(handleAsyncError({
        message: 'Пожалуйста, исправьте ошибки в форме',
        validationErrors: errors,
        status: 422
      }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    
    if (!validate()) return;
    const { confirmPassword, ...registrationData } = userData;
    const result = await dispatch(registerUser(registrationData));
    if (result.success) {
      navigate('/storage');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="register-page">
      <AuthForm title="Register" onSubmit={handleSubmit}>
        <AuthInput
          name="username"
          value={userData.username}
          onChange={handleChange}
          placeholder="Enter your login"
          label="Login"
        />        
        <AuthInput
          name="full_name"
          value={userData.full_name}
          onChange={handleChange}
          placeholder="Enter your full name"
          label="Full Name"
        />        
        <AuthInput
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          label="Email"
        />        
        <AuthInput
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          label="Password"
        />        
        <AuthInput
          type="password"
          name="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          label="Confirm Password"
        />        
        <AuthButton disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </AuthButton>        
        <div className="auth-footer">
          У вас уже есть учетная запись? <Link to="/login">Войти</Link>
        </div>
      </AuthForm>
    </div>
  );
};

export default RegisterPage;