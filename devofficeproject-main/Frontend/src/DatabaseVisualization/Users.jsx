import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';

const ADMIN_NAV_ITEMS = [
  { to: '/admin', icon: 'bi-house-door', label: 'Overview' },
  { to: '/signup', icon: 'bi-person-plus', label: 'Register User' },
  { to: '/databasevis', icon: 'bi-database', label: 'Database' },
  { to: '/frontroom', icon: 'bi-grid', label: 'Book a Seat' },
  { to: '/chat', icon: 'bi-chat-dots', label: 'Meetings' },
  { to: '/email', icon: 'bi-envelope', label: 'Email' },
];

function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8081/')
      .then((res) => setUsers(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8081/delete/${id}`)
      .then(() => setUsers((prev) => prev.filter((user) => user.id !== id)))
      .catch((err) => console.log(err));
  };

  return (
    <AppShell
      brandSubtitle="Admin workspace"
      navItems={ADMIN_NAV_ITEMS}
      activePath="/databasevis"
      heroEyebrow="Database"
      heroTitle="Manage user records with one consistent admin view."
      heroSubtitle="The database pages now share the same shell, spacing, and controls as the rest of the app."
      heroActions={
        <div className="workspace-toolbar">
          <button type="button" className="secondary-button" onClick={() => navigate('/seatsdtb')}>
            <i className="bi bi-grid-3x3-gap" />
            View seats
          </button>
          <button type="button" className="ghost-button" onClick={() => navigate('/signup')}>
            <i className="bi bi-person-plus" />
            Add user
          </button>
        </div>
      }
    >
      <section className="workspace-card">
        <div className="workspace-card-header">
          <div>
            <h2>User table</h2>
            <p>Review, edit, and remove users without leaving the workspace shell.</p>
          </div>
          <div className="workspace-pill">
            <i className="bi bi-people" />
            {users.length} records
          </div>
        </div>

        <div className="workspace-table-wrap">
          <table className="workspace-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Role</th>
                <th>Username</th>
                <th>Name</th>
                <th>Email</th>
                <th>Specialization</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td><span className="workspace-badge">{user.role}</span></td>
                  <td>{user.username}</td>
                  <td>{`${user.firstname} ${user.lastname}`}</td>
                  <td>{user.email}</td>
                  <td>{user.specialization}</td>
                  <td>
                    <div className="workspace-actions">
                      <Link to={`/update/${user.id}`} className="secondary-button">
                        <i className="bi bi-pencil" />
                        Edit
                      </Link>
                      <button type="button" className="danger-button" onClick={() => handleDelete(user.id)}>
                        <i className="bi bi-trash" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

export default Users;
