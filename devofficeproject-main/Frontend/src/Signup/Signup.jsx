import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Validation from './SignupValidation';

function Signup() {
  const [values, setValues] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    password: '',
    specialization: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = Validation(values);
    setErrors(validationErrors);

    if (Object.values(validationErrors).some(Boolean)) {
      return;
    }

    axios
      .post('http://localhost:8081/signup', values)
      .then(() => {
        navigate('/');
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="auth-page">
      <section className="auth-showcase">
        <div>
          <div className="auth-brand">
            <i className="bi bi-people" />
            DevOffice
          </div>
          <h1>Register new team members with less friction.</h1>
          <p>
            The registration flow now uses the same professional visual system as the rest
            of the site, with clear fields and responsive spacing.
          </p>
        </div>

        <div className="auth-metrics">
          <div className="auth-metric">
            <strong>Clear</strong>
            <span>Readable field grouping for fast admin entry.</span>
          </div>
          <div className="auth-metric">
            <strong>Consistent</strong>
            <span>Same spacing, hierarchy, and controls across pages.</span>
          </div>
          <div className="auth-metric">
            <strong>Adaptive</strong>
            <span>Stacks naturally on smaller screens and tablets.</span>
          </div>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card auth-card--wide">
          <p className="auth-eyebrow">User registration</p>
          <h2 className="auth-title">Create a new account</h2>
          <p className="auth-subtitle">
            Add the employee profile, assign their role, and complete onboarding.
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-grid">
              <div className="auth-grid auth-grid--two">
                <label className="field-group">
                  <span className="field-label">First name</span>
                  <input
                    className="field-control"
                    type="text"
                    name="firstname"
                    placeholder="Enter first name"
                    value={values.firstname}
                    onChange={handleInput}
                  />
                  {errors.firstname && <div className="form-error">{errors.firstname}</div>}
                </label>

                <label className="field-group">
                  <span className="field-label">Last name</span>
                  <input
                    className="field-control"
                    type="text"
                    name="lastname"
                    placeholder="Enter last name"
                    value={values.lastname}
                    onChange={handleInput}
                  />
                  {errors.lastname && <div className="form-error">{errors.lastname}</div>}
                </label>
              </div>

              <label className="field-group">
                <span className="field-label">Email</span>
                <input
                  className="field-control"
                  type="text"
                  name="email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleInput}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </label>

              <div className="auth-grid auth-grid--two">
                <label className="field-group">
                  <span className="field-label">Username</span>
                  <input
                    className="field-control"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={values.username}
                    onChange={handleInput}
                  />
                  {errors.username && <div className="form-error">{errors.username}</div>}
                </label>

                <label className="field-group">
                  <span className="field-label">Password</span>
                  <input
                    className="field-control"
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={values.password}
                    onChange={handleInput}
                  />
                  {errors.password && <div className="form-error">{errors.password}</div>}
                </label>
              </div>

              <div className="auth-grid auth-grid--two">
                <label className="field-group">
                  <span className="field-label">Role</span>
                  <select
                    className="field-select"
                    name="role"
                    value={values.role}
                    onChange={handleInput}
                  >
                    <option value="">Select role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
                  </select>
                  {errors.role && <div className="form-error">{errors.role}</div>}
                </label>

                <label className="field-group">
                  <span className="field-label">Specialization</span>
                  <select
                    className="field-select"
                    name="specialization"
                    value={values.specialization}
                    onChange={handleInput}
                  >
                    <option value="">Select specialization</option>
                    <option value="Frontend">Front-end Developer</option>
                    <option value="Backend">Back-end Developer</option>
                  </select>
                  {errors.specialization && (
                    <div className="form-error">{errors.specialization}</div>
                  )}
                </label>
              </div>

              <button type="submit" className="primary-button">
                Confirm registration
              </button>
            </div>
          </form>

          <div className="auth-links">
            <span>Need to return to the dashboard?</span>
            <Link to="/">Back to login</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
