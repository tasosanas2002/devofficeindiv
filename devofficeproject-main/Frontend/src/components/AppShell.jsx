import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function AppShell({
  brandSubtitle,
  navItems,
  activePath,
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  heroActions,
  children,
}) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [file, setFile] = useState(null);

  const initials = (username || 'DO').slice(0, 2).toUpperCase();

  const fetchUser = () => {
    axios
      .get('http://localhost:8081/checkauth', {
        headers: {
          'access-token': localStorage.getItem('token'),
        },
      })
      .then((res) => {
        setUsername(res.data.username);
        setEmail(res.data.email);
        setAvatar(res.data.avatar);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUser();
  }, []);

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
          fetchUser();
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

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <div className="dashboard-brand">
          <div className="dashboard-brand-mark">
            <i className="bi bi-buildings" />
          </div>
          <div>
            <div>DevOffice</div>
            <small>{brandSubtitle}</small>
          </div>
        </div>

        <nav className="dashboard-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`dashboard-nav-link${activePath === item.to ? ' is-active' : ''}`}
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
              <div className="dashboard-avatar-placeholder">{initials}</div>
            )}
            <div className="dashboard-user-meta">
              <strong>{username || 'DevOffice user'}</strong>
              <span>{email || brandSubtitle}</span>
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
              <input
                className="dashboard-file"
                type="file"
                onChange={(event) => setFile(event.target.files[0])}
              />
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
            <p className="auth-eyebrow">{heroEyebrow}</p>
            <h1>{heroTitle}</h1>
            <p>{heroSubtitle}</p>
          </div>
          {heroActions ? <div className="dashboard-hero-actions">{heroActions}</div> : null}
        </section>

        <div className="workspace-page">{children}</div>
      </main>
    </div>
  );
}

export default AppShell;
