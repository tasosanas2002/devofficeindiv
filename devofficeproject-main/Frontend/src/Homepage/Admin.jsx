import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const ADMIN_NAV_ITEMS = [
  { to: '/admin', icon: 'bi-house-door', label: 'Overview' },
  { to: '/signup', icon: 'bi-person-plus', label: 'Register User' },
  { to: '/databasevis', icon: 'bi-database', label: 'Database' },
  { to: '/frontroom', icon: 'bi-grid', label: 'Book a Seat' },
  { to: '/chat', icon: 'bi-chat-dots', label: 'Meetings' },
  { to: '/email', icon: 'bi-envelope', label: 'Email' },
];

function Admin() {
  const navigate = useNavigate();
  const [lastBooked, setLastBooked] = useState('');
  const [booking, setBooking] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [avatar, setAvatar] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState();

  const fullName = `${firstname} ${lastname}`.trim() || username || 'Admin User';
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  const handleAuth = () => {
    axios
      .get('http://localhost:8081/checkauth', {
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setBooking(res.data.booking);
        setLastBooked(res.data.last_booked);
        setUsername(res.data.username);
        setAvatar(res.data.avatar);
        setFirstname(res.data.firstname);
        setLastname(res.data.lastname);
        setRole(res.data.role);
        setEmail(res.data.email);
        setSpecialization(res.data.specialization);
      })
      .catch((err) => console.log(err));
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      return;
    }

    const formdata = new FormData();
    formdata.append('image', file);

    axios
      .post('http://localhost:8081/upload', formdata, {
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then((res) => {
        if (res.data.Status === 'Success') {
          handleAuth();
          setShowUploadOptions(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();

    axios
      .post(
        'http://localhost:8081/updateprofile',
        {
          firstname,
          lastname,
          username,
          email,
          role,
          specialization,
        },
        {
          headers: {
            'access-token': localStorage.getItem('token'),
          },
        }
      )
      .then((res) => {
        if (res.data.Status === 'Success') {
          setIsEditing(false);
          handleAuth();
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  useEffect(() => {
    handleAuth();
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:8081/seats')
      .then((res) => {
        const seat6 = res.data.find((seat) => seat.seatnumber === 6);
        if (seat6?.last_booked) {
          const lastBookedDate = new Date(seat6.last_booked).toISOString().split('T')[0];
          setLastBooked(lastBookedDate);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const openGmail = () => {
    window.open('https://mail.google.com/', '_blank');
  };

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-brand-mark">
            <i className="bi bi-buildings" />
          </div>
          <div>
            <div>DevOffice</div>
            <small>Admin workspace</small>
          </div>
        </div>

        <nav className="dashboard-nav">
          {ADMIN_NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`dashboard-nav-link${item.to === '/admin' ? ' is-active' : ''}`}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="dashboard-user">
          <div className="dashboard-user-top">
            {avatar ? (
              <img
                className="dashboard-avatar"
                src={`http://localhost:8081/images/${avatar}`}
                alt="Avatar"
              />
            ) : (
              <div className="dashboard-avatar-placeholder">{initials || 'A'}</div>
            )}
            <div className="dashboard-user-meta">
              <strong>{fullName}</strong>
              <span>{email || 'No email available'}</span>
            </div>
          </div>

          <div className="dashboard-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={() => setShowUploadOptions((current) => !current)}
            >
              <i className="bi bi-camera" />
              Update photo
            </button>
            <button type="button" className="danger-button" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right" />
              Logout
            </button>
          </div>

          {showUploadOptions && (
            <div className="dashboard-upload">
              <input className="dashboard-file" type="file" onChange={handleFile} />
              <button type="button" className="secondary-button" onClick={handleUpload}>
                Upload image
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="dashboard-main">
        <section className="dashboard-hero">
          <div>
            <p className="auth-eyebrow">Operations overview</p>
            <h1>Professional control for the DevOffice workspace.</h1>
            <p>
              Review account details, keep seating activity visible, and move between
              admin tasks from a layout that scales cleanly from mobile to desktop.
            </p>
          </div>
          <div className="dashboard-hero-actions">
            <button type="button" className="primary-button" onClick={openGmail}>
              <i className="bi bi-envelope-paper" />
              Open Gmail
            </button>
            <Link to="/frontroom" className="ghost-button">
              <i className="bi bi-calendar-check" />
              Manage seats
            </Link>
          </div>
        </section>

        <section className="dashboard-content">
          <div className="dashboard-column">
            <article className="surface-card surface-card--dark">
              <div className="section-heading">
                <div>
                  <h2>Profile</h2>
                  <p>Update your admin information without leaving the dashboard.</p>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setIsEditing((current) => !current)}
                >
                  <i className={`bi ${isEditing ? 'bi-x-lg' : 'bi-pencil-square'}`} />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="profile-summary">
                {avatar ? (
                  <img
                    className="profile-avatar-large"
                    src={`http://localhost:8081/images/${avatar}`}
                    alt="Avatar"
                  />
                ) : (
                  <div className="profile-avatar-fallback">{initials || 'A'}</div>
                )}
                <div>
                  <h3>{fullName}</h3>
                  <p>{specialization || 'Specialization not set'}</p>
                </div>
              </div>

              {isEditing ? (
                <form className="profile-form" onSubmit={handleUpdateProfile}>
                  <div className="auth-grid auth-grid--two">
                    <label className="field-group">
                      <span className="field-label">First name</span>
                      <input
                        className="field-control"
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </label>
                    <label className="field-group">
                      <span className="field-label">Last name</span>
                      <input
                        className="field-control"
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                      />
                    </label>
                  </div>
                  <label className="field-group">
                    <span className="field-label">Username</span>
                    <input
                      className="field-control"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </label>
                  <label className="field-group">
                    <span className="field-label">Email</span>
                    <input
                      className="field-control"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <div className="auth-grid auth-grid--two">
                    <label className="field-group">
                      <span className="field-label">Role</span>
                      <input
                        className="field-control"
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                      />
                    </label>
                    <label className="field-group">
                      <span className="field-label">Specialization</span>
                      <input
                        className="field-control"
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                      />
                    </label>
                  </div>
                  <button type="submit" className="primary-button">
                    Save profile
                  </button>
                </form>
              ) : (
                <div className="profile-grid">
                  <div className="profile-field">
                    <span>First name</span>
                    <strong>{firstname || 'Not set'}</strong>
                  </div>
                  <div className="profile-field">
                    <span>Last name</span>
                    <strong>{lastname || 'Not set'}</strong>
                  </div>
                  <div className="profile-field">
                    <span>Username</span>
                    <strong>{username || 'Not set'}</strong>
                  </div>
                  <div className="profile-field">
                    <span>Email</span>
                    <strong>{email || 'Not set'}</strong>
                  </div>
                  <div className="profile-field">
                    <span>Role</span>
                    <strong>{role || 'Not set'}</strong>
                  </div>
                  <div className="profile-field">
                    <span>Specialization</span>
                    <strong>{specialization || 'Not set'}</strong>
                  </div>
                </div>
              )}
            </article>
          </div>

          <div className="dashboard-column">
            <div className="stats-grid">
              <article className="stat-card">
                <strong>Total seat reservations</strong>
                <div className="stat-value">8</div>
                <p className="stat-note">
                  Current layout presents your workspace metrics without overlap on smaller
                  screens.
                </p>
              </article>

              <article className="stat-card">
                <strong>Upcoming reservation</strong>
                <div className="stat-value">{lastBooked || '--'}</div>
                <p className="stat-note">
                  Latest tracked booking date for monitored seat activity.
                </p>
              </article>

              <article className="surface-card surface-card--dark">
                <div className="section-heading">
                  <div>
                    <h3>Quick insight</h3>
                    <p>Snapshot of your current admin record.</p>
                  </div>
                </div>
                <div className="insight-list">
                  <div className="insight-item">
                    <strong>Booking status</strong>
                    <p>{booking || 'No active booking state returned yet.'}</p>
                  </div>
                  <div className="insight-item">
                    <strong>Account role</strong>
                    <p>{role || 'Role not available.'}</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Admin;
