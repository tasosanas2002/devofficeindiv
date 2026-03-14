import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';

const ADMIN_NAV_ITEMS = [
  { to: '/admin', icon: 'bi-house-door', label: 'Overview' },
  { to: '/signup', icon: 'bi-person-plus', label: 'Register User' },
  { to: '/databasevis', icon: 'bi-database', label: 'Database' },
  { to: '/frontroom', icon: 'bi-grid', label: 'Book a Seat' },
  { to: '/chat', icon: 'bi-chat-dots', label: 'Meetings' },
  { to: '/email', icon: 'bi-envelope', label: 'Email' },
];

function Seats() {
  const [seats, setSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:8081/seats')
      .then((res) => setSeats(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <AppShell
      brandSubtitle="Admin workspace"
      navItems={ADMIN_NAV_ITEMS}
      activePath="/databasevis"
      heroEyebrow="Seat database"
      heroTitle="Monitor seat inventory from the same admin system."
      heroSubtitle="Seat records are surfaced with the same visual hierarchy as user management."
      heroActions={
        <div className="workspace-toolbar">
          <button type="button" className="secondary-button" onClick={() => navigate('/databasevis')}>
            <i className="bi bi-people" />
            View users
          </button>
          <button type="button" className="ghost-button" onClick={() => navigate('/frontroom')}>
            <i className="bi bi-grid" />
            Open map
          </button>
        </div>
      }
    >
      <section className="workspace-card">
        <div className="workspace-card-header">
          <div>
            <h2>Seat table</h2>
            <p>Inventory and booking-state view for the office floor.</p>
          </div>
          <div className="workspace-pill">
            <i className="bi bi-layout-text-window-reverse" />
            {seats.length} seats
          </div>
        </div>

        <div className="workspace-table-wrap">
          <table className="workspace-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Seat number</th>
                <th>Status</th>
                <th>Last booked</th>
              </tr>
            </thead>
            <tbody>
              {seats.map((seat) => (
                <tr key={seat.id}>
                  <td>{seat.id}</td>
                  <td>{seat.seatnumber}</td>
                  <td>
                    <span className="workspace-badge">
                      {seat.status || 'available'}
                    </span>
                  </td>
                  <td>{seat.last_booked || 'Not booked yet'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

export default Seats;
