import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'ORGANIZER',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    if (name === 'email' && value && !validateEmail(value)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (name === 'password' && value && !validatePassword(value)) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (name === 'confirmPassword' && value && value !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    
    // Full name is optional, so no validation needed
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const loadingToast = toast.loading('Creating your account...');
    
    try {
      // Prepare data for backend - backend expects fullName, email, password, confirmPassword
      const registrationData = {
        fullName: formData.username.trim() || '', // Backend accepts empty string for optional fullName
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      
      console.log('Sending registration data:', registrationData);
      await register(registrationData);
      
      toast.success('✨ Account created successfully! Welcome to TournaPro!', {
        id: loadingToast,
        duration: 2000,
      });
      
      // Short delay before redirect for better UX
      setTimeout(() => {
        navigate('/manage', { replace: true });
      }, 1000);
    } catch (err) {
      console.error('Registration error:', err.response?.data);
      
      // Handle backend validation errors (field-specific)
      if (err.response?.status === 400 && err.response?.data?.errors) {
        const backendErrors = err.response.data.errors;
        const mappedErrors = {};
        
        // Map backend field names to frontend field names
        if (backendErrors.email) mappedErrors.email = backendErrors.email;
        if (backendErrors.password) mappedErrors.password = backendErrors.password;
        if (backendErrors.confirmPassword) mappedErrors.confirmPassword = backendErrors.confirmPassword;
        if (backendErrors.fullName) mappedErrors.username = backendErrors.fullName;
        
        setErrors(mappedErrors);
        
        toast.error('Please fix the validation errors and try again.', {
          id: loadingToast,
          duration: 4000,
        });
        return;
      }
      
      // Handle other specific errors
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
        
        // Handle specific backend business logic errors
        if (errorMessage.includes('already exists') || errorMessage.includes('already taken')) {
          setErrors({ email: 'This email is already registered' });
        } else if (errorMessage.includes('Passwords do not match')) {
          setErrors({ confirmPassword: 'Passwords do not match' });
        }
      } else if (err.response?.status === 409) {
        errorMessage = 'An account with this email already exists.';
        setErrors({ email: 'This email is already registered' });
      }
      
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 4000,
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create your account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name <span className="optional-label">(optional)</span></label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="you@example.com"
            />
            <div className="field-helper">We'll never share your email.</div>
            {errors.email && (
              <div className="field-error">❌ {errors.email}</div>
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
              placeholder="Create a strong password"
            />
            <div className="field-helper">At least 8 characters.</div>
            {errors.password && (
              <div className="field-error">❌ {errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <div className="field-error">❌ {errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">Create Account</button>
        </form>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
