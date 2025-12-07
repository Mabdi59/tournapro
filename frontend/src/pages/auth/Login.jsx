import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear errors when user starts typing
    if (error) setError('');
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    if (name === 'username' && value && !validateEmail(value)) {
      newErrors.username = 'Please enter a valid email address';
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors({});
    
    // Validate fields
    const newErrors = {};
    
    if (!formData.username) {
      newErrors.username = 'Email is required';
    } else if (!validateEmail(formData.username)) {
      newErrors.username = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const loadingToast = toast.loading('Signing you in...');
    
    try {
      // Backend expects { email, password }, but frontend stores in username field
      const loginData = {
        email: formData.username,
        password: formData.password
      };
      
      console.log('Sending login data:', loginData);
      await login(loginData);
      
      toast.success('✨ Welcome back!', {
        id: loadingToast,
        duration: 2000,
      });
      
      setTimeout(() => {
        navigate('/manage', { replace: true });
      }, 800);
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle network errors (backend not reachable)
      if (!err.response) {
        const networkError = 'Unable to connect to server. Please make sure the backend is running.';
        setError(networkError);
        toast.error(networkError, {
          id: loadingToast,
          duration: 5000,
        });
        return;
      }
      
      // Handle backend validation errors (field-specific)
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const mappedErrors = {};
        
        if (backendErrors.email) mappedErrors.username = backendErrors.email;
        if (backendErrors.password) mappedErrors.password = backendErrors.password;
        
        setErrors(mappedErrors);
        
        toast.error('Please fix the validation errors and try again.', {
          id: loadingToast,
          duration: 4000,
        });
        return;
      }
      
      // Handle specific error responses
      let errorMessage = 'Invalid email or password';
      
      if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (err.response?.status === 404) {
        errorMessage = 'This account does not exist';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 3000,
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome back</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
            />
            <div className="field-helper">We'll never share your email.</div>
            {errors.username && (
              <div className="field-error">❌ {errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your password"
            />
            {errors.password && (
              <div className="field-error">❌ {errors.password}</div>
            )}
            <div className="forgot-password-link">
              <Link to="#" onClick={(e) => { e.preventDefault(); toast.info('Password reset coming soon!'); }}>Forgot password?</Link>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="btn btn-primary">Sign In</button>
        </form>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
