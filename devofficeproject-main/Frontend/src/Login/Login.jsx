import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import Validation from './LoginValidation';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';

function Login() {
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
  });
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setValues((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (validationErrors.email || validationErrors.password) {
      return;
    }

    if (!captchaVerified) {
      alert('Please complete the reCAPTCHA before submitting the form.');
      return;
    }

    axios
      .post('http://localhost:8081/login', values)
      .then((res) => {
        if (res.data.Login) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('isLogedIn', true);
          localStorage.setItem('role', res.data.data[0].role);

          if (res.data.data[0].role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user');
          }
        } else {
          alert('No record existed');
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 19 || currentHour < 7) {
      document.body.classList.add('night-mode');
    } else {
      document.body.classList.remove('night-mode');
    }
  }, []);

  return (
    <div className="auth-page">
      <section className="auth-showcase">
        <div>
          <div className="auth-brand">
            <i className="bi bi-buildings" />
            DevOffice
          </div>
          <h1>Professional workspace access.</h1>
          <p>
            Sign in to manage reservations, collaboration tools, and internal workspace
            activity from a cleaner, more reliable interface.
          </p>
        </div>

        <div className="auth-metrics">
          <div className="auth-metric">
            <strong>Responsive</strong>
            <span>Built to stay readable on mobile and desktop.</span>
          </div>
          <div className="auth-metric">
            <strong>Secure</strong>
            <span>Protected sign-in with token-based access flow.</span>
          </div>
          <div className="auth-metric">
            <strong>Focused</strong>
            <span>Workspace tools organized around daily operations.</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <p className="auth-eyebrow">Welcome back</p>
          <h2 className="auth-title">Sign in to DevOffice</h2>
          <p className="auth-subtitle">
            Use your email or username and continue to your dashboard.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-grid">
              <label className="field-group">
                <span className="field-label">Email or username</span>
                <input
                  className="field-control"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="you@company.com"
                  value={values.email}
                  onChange={handleInput}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </label>

              <label className="field-group">
                <span className="field-label">Password</span>
                <div className="field-row">
                  <input
                    className="field-control"
                    type={values.showPassword ? 'text' : 'password'}
                    name="password"
                    id="pwd"
                    placeholder="Enter your password"
                    value={values.password}
                    onChange={handleInput}
                  />
                  <button
                    type="button"
                    className="toggle-button"
                    onClick={togglePasswordVisibility}
                  >
                    {values.showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {errors.password && <div className="form-error">{errors.password}</div>}
              </label>

              <div className="auth-captcha">
                <ReCAPTCHA
                  sitekey="6LcFkYMpAAAAACTt1EJ_10_zh0pNEcwiKHZWitIN"
                  onChange={() => setCaptchaVerified(true)}
                />
              </div>

              <button type="submit" className="primary-button">
                Login
              </button>
            </div>
          </form>

          <div className="auth-links">
            <a href="#">Forgot your password?</a>
            <Link to="/signup">Create a user account</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
