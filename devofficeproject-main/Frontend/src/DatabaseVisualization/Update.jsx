import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function Update() {
  const [user, setUser] = useState({
    firstname: '',
    lastname: '',
    username: '',
    role: '',
    specialization: '',
    email: '',
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/${id}`)
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .put(`http://localhost:8081/update/${id}`, user)
      .then(() => navigate('/databasevis'))
      .catch((err) => console.log(err));
  };

  return (
    <div className="auth-page">
      <section className="auth-showcase">
        <div>
          <div className="auth-brand">
            <i className="bi bi-pencil-square" />
            DevOffice
          </div>
          <h1>Refine user profiles in the same product voice.</h1>
          <p>
            The edit flow now uses the same form system as login and registration so the app
            feels designed as one product.
          </p>
        </div>
      </section>
      <section className="auth-panel">
        <div className="auth-card auth-card--wide">
          <p className="auth-eyebrow">Edit user</p>
          <h2 className="auth-title">Update account details</h2>
          <p className="auth-subtitle">Adjust the profile fields and save the changes.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-grid">
              <div className="auth-grid auth-grid--two">
                <label className="field-group">
                  <span className="field-label">First name</span>
                  <input className="field-control" type="text" name="firstname" value={user.firstname} onChange={handleChange} />
                </label>
                <label className="field-group">
                  <span className="field-label">Last name</span>
                  <input className="field-control" type="text" name="lastname" value={user.lastname} onChange={handleChange} />
                </label>
              </div>
              <div className="auth-grid auth-grid--two">
                <label className="field-group">
                  <span className="field-label">Username</span>
                  <input className="field-control" type="text" name="username" value={user.username} onChange={handleChange} />
                </label>
                <label className="field-group">
                  <span className="field-label">Email</span>
                  <input className="field-control" type="text" name="email" value={user.email} onChange={handleChange} />
                </label>
              </div>
              <div className="auth-grid auth-grid--two">
                <label className="field-group">
                  <span className="field-label">Role</span>
                  <input className="field-control" type="text" name="role" value={user.role} onChange={handleChange} />
                </label>
                <label className="field-group">
                  <span className="field-label">Specialization</span>
                  <input className="field-control" type="text" name="specialization" value={user.specialization} onChange={handleChange} />
                </label>
              </div>
              <button type="submit" className="primary-button">Save changes</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Update;
