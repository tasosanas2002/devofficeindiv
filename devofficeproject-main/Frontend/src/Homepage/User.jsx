import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const USER_NAV_ITEMS = [
  { to: '/user', icon: 'bi-house-door', label: 'Overview' },
  { to: '/frontroomuser', icon: 'bi-grid', label: 'Book a Seat' },
  { to: '/chatuser', icon: 'bi-chat-dots', label: 'Meetings' },
  { to: '/emailuser', icon: 'bi-envelope', label: 'Email' },
];

function User() {
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
  const [file, setFile] = useState();

  const fullName = `${firstname} ${lastname}`.trim() || username || 'Team Member';
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
        const seat20 = res.data.find((seat) => seat.seatnumber === 20);
        if (seat20?.last_booked) {
          const lastBookedDate = new Date(seat20.last_booked).toISOString().split('T')[0];
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
            <small>User workspace</small>
          </div>
        </div>

        <nav className="dashboard-nav">
          {USER_NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`dashboard-nav-link${item.to === '/user' ? ' is-active' : ''}`}
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
              <div className="dashboard-avatar-placeholder">{initials || 'U'}</div>
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
            <p className="auth-eyebrow">Workspace summary</p>
            <h1>Stay organized without losing screen space.</h1>
            <p>
              Your dashboard now keeps profile details and booking information readable on
              laptops, tablets, and smaller mobile screens.
            </p>
          </div>
          <div className="dashboard-hero-actions">
            <button type="button" className="primary-button" onClick={openGmail}>
              <i className="bi bi-envelope-paper" />
              Open Gmail
            </button>
            <Link to="/frontroomuser" className="ghost-button">
              <i className="bi bi-calendar-check" />
              Reserve a seat
            </Link>
          </div>
        </section>

        <section className="dashboard-content">
          <div className="dashboard-column">
            <article className="surface-card surface-card--dark">
              <div className="section-heading">
                <div>
                  <h2>Profile</h2>
                  <p>Your account details are grouped into a clean, scannable layout.</p>
                </div>
              </div>

              <div className="profile-summary">
                {avatar ? (
                  <img
                    className="profile-avatar-large"
                    src={`http://localhost:8081/images/${avatar}`}
                    alt="Avatar"
                  />
                ) : (
                  <div className="profile-avatar-fallback">{initials || 'U'}</div>
                )}
                <div>
                  <h3>{fullName}</h3>
                  <p>{specialization || 'Specialization not set'}</p>
                </div>
              </div>

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
            </article>
          </div>

          <div className="dashboard-column">
            <div className="stats-grid">
              <article className="stat-card">
                <strong>Total seat reservations</strong>
                <div className="stat-value">8</div>
                <p className="stat-note">
                  Summary cards now stack and resize instead of relying on fixed offsets.
                </p>
              </article>

              <article className="stat-card">
                <strong>Upcoming reservation</strong>
                <div className="stat-value">{lastBooked || '--'}</div>
                <p className="stat-note">Latest tracked booking date for your seat area.</p>
              </article>

              <article className="surface-card surface-card--dark">
                <div className="section-heading">
                  <div>
                    <h3>Quick insight</h3>
                    <p>Useful context surfaced in one place.</p>
                  </div>
                </div>
                <div className="insight-list">
                  <div className="insight-item">
                    <strong>Booking status</strong>
                    <p>{booking || 'No active booking state returned yet.'}</p>
                  </div>
                  <div className="insight-item">
                    <strong>Workspace role</strong>
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

export default User;
