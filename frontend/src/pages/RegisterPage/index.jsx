import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../features/auth/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm from '../../components/auth/AuthForm';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const RegisterPage = () => {
  const [userData, setUserData] = useState({
    login: '',
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    
    // Login validation
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(userData.login)) {
      newErrors.login = 'Login must start with a letter and be 4-20 characters long';
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation
    if (userData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(userData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(userData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[^A-Za-z0-9]/.test(userData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }
    
    // Confirm password
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const { confirmPassword, ...registrationData } = userData;
    const result = await dispatch(registerUser(registrationData));
    
    if (result.error) {
      setErrors({ form: result.error.message });
    } else {
      navigate('/storage');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="register-page">
      <AuthForm title="Register" onSubmit={handleSubmit}>
        <AuthInput
          name="login"
          value={userData.login}
          onChange={handleChange}
          placeholder="Enter your login"
          error={errors.login}
          label="Login"
        />
        <AuthInput
          name="full_name"
          value={userData.full_name}
          onChange={handleChange}
          placeholder="Enter your full name"
          error={errors.full_name}
          label="Full Name"
        />
        <AuthInput
          type="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
          label="Email"
        />
        <AuthInput
          type="password"
          name="password"
          value={userData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
          label="Password"
        />
        <AuthInput
          type="password"
          name="confirmPassword"
          value={userData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
          label="Confirm Password"
        />
        
        {errors.form && <div className="form-error">{errors.form}</div>}
        
        <AuthButton disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </AuthButton>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </AuthForm>
    </div>
  );
};

export default RegisterPage;