import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Style from './Frontroom.module.css';

const ADMIN_NAV_ITEMS = [
  { to: '/admin', icon: 'bi-house-door', label: 'Overview' },
  { to: '/signup', icon: 'bi-person-plus', label: 'Register User' },
  { to: '/databasevis', icon: 'bi-database', label: 'Database' },
  { to: '/frontroom', icon: 'bi-grid', label: 'Book a Seat' },
  { to: '/chat', icon: 'bi-chat-dots', label: 'Meetings' },
  { to: '/email', icon: 'bi-envelope', label: 'Email' },
];

const SEAT_POSITIONS = [
  { left: 5, top: 16 }, { left: 5, top: 40 }, { left: 5, top: 63 }, { left: 5, top: 86 },
  { left: 12, top: 22 }, { left: 17, top: 22 }, { left: 22, top: 22 },
  { left: 12, top: 35 }, { left: 17, top: 35 }, { left: 22, top: 35 },
  { left: 30, top: 22 }, { left: 35, top: 22 }, { left: 40, top: 22 },
  { left: 30, top: 35 }, { left: 35, top: 35 }, { left: 40, top: 35 },
  { left: 58, top: 25 }, { left: 64, top: 25 }, { left: 58, top: 35 }, { left: 64, top: 35 },
  { left: 88, top: 40 }, { left: 94, top: 40 }, { left: 88, top: 63 }, { left: 94, top: 63 },
];

function Frontend() {
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  const [newSeatNumber, setNewSeatNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [file, setFile] = useState();

  const formattedDate = selectedDate.toISOString().slice(0, 10);
  const availableSeats = seats.filter((seat) => seat.status !== 'occupied').length;
  const occupiedSeats = seats.length - availableSeats;
  const initials = (username || 'A').slice(0, 2).toUpperCase();
  const mappedSeats = useMemo(
    () => seats.map((seat, index) => ({ ...seat, position: SEAT_POSITIONS[index] || { left: 50, top: 50 } })),
    [seats]
  );

  const selectedSeatStatus = useMemo(() => {
    if (!selectedSeat) return 'Pick a seat marker from the map to manage or reserve it.';
    return `Seat ${selectedSeat.seatnumber} is selected for ${formattedDate}.`;
  }, [formattedDate, selectedSeat]);

  const fetchSeats = () => {
    axios
      .get('http://localhost:8081/seats', { params: { date: formattedDate } })
      .then((response) => {
        const updatedSeats = response.data.map((seat) => ({
          ...seat,
          status: seat.status === 'occupied' ? 'occupied' : 'available',
        }));
        setSeats(updatedSeats);
        if (selectedSeat) {
          const nextSelectedSeat = updatedSeats.find((seat) => seat.id === selectedSeat.id);
          setSelectedSeat(nextSelectedSeat?.status === 'available' ? nextSelectedSeat : null);
        }
      })
      .catch((error) => console.error('Error fetching seat data:', error));
  };

  const fetchUser = () => {
    axios
      .get('http://localhost:8081/checkauth', {
        headers: { 'access-token': localStorage.getItem('token') },
      })
      .then((res) => {
        setUsername(res.data.username);
        setAvatar(res.data.avatar);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchSeats();
    fetchUser();
  }, [formattedDate]);

  const handleFile = (event) => setFile(event.target.files[0]);

  const handleUpload = () => {
    if (!file) return;
    const formdata = new FormData();
    formdata.append('image', file);
    axios
      .post('http://localhost:8081/upload', formdata, {
        headers: { 'access-token': localStorage.getItem('token') },
      })
      .then((res) => {
        if (res.data.Status === 'Success') {
          fetchUser();
          setShowUploadOptions(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'available') setSelectedSeat(seat);
  };

  const handleSubmitBooking = () => {
    if (!selectedSeat) return;
    axios
      .put(
        `http://localhost:8081/updateseat/${selectedSeat.id}`,
        { selectedDate: formattedDate },
        { headers: { 'access-token': localStorage.getItem('token') } }
      )
      .then(() => {
        fetchSeats();
        setSelectedSeat(null);
      })
      .catch((error) => {
        console.error('Error updating seat status:', error);
        if (error.response?.status === 401) {
          alert('Your session expired. Please log in again and try booking the seat.');
          navigate('/');
          return;
        }
        alert('Booking failed. Please try again.');
      });
  };

  const handleDeleteSeat = () => {
    if (!selectedSeat) return;
    axios
      .delete(`http://localhost:8081/deleteSeat/${selectedSeat.id}`)
      .then(() => {
        setSelectedSeat(null);
        fetchSeats();
      })
      .catch((error) => console.error('Error deleting seat:', error));
  };

  const handleAddSeat = () => {
    if (!newSeatNumber.trim()) return;
    axios
      .post('http://localhost:8081/addSeat', { seatNumber: newSeatNumber })
      .then(() => {
        setNewSeatNumber('');
        fetchSeats();
      })
      .catch((error) => console.error('Error adding seat:', error));
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
            <small>Admin workspace</small>
          </div>
        </div>
        <nav className="dashboard-nav">
          {ADMIN_NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className={`dashboard-nav-link${item.to === '/frontroom' ? ' is-active' : ''}`}>
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="dashboard-user">
          <div className="dashboard-user-top">
            {avatar ? <img className="dashboard-avatar" src={`http://localhost:8081/images/${avatar}`} alt="Avatar" /> : <div className="dashboard-avatar-placeholder">{initials}</div>}
            <div className="dashboard-user-meta">
              <strong>{username || 'Admin user'}</strong>
              <span>Workspace manager</span>
            </div>
          </div>
          <div className="dashboard-actions">
            <button type="button" className="ghost-button" onClick={() => setShowUploadOptions((current) => !current)}>
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
              <button type="button" className="secondary-button" onClick={handleUpload}>Upload image</button>
            </div>
          )}
        </div>
      </aside>

      <main className={`${Style.roomPage} dashboard-main`}>
        <section className={Style.hero}>
          <div>
            <p className="auth-eyebrow">Office booking</p>
            <h1>Manage the room through a visual office map.</h1>
            <p>The booking page now uses a modern mapped room view that fits the rest of the site while preserving admin controls.</p>
          </div>
          <div className={Style.heroControls}>
            <div className={Style.dateCard}>
              <span>Booking date</span>
              <DatePicker selected={selectedDate} onChange={(date) => setSelectedDate(date)} dateFormat="dd/MM/yyyy" className={Style.dateInput} />
            </div>
          </div>
        </section>

        <section className={Style.metrics}>
          <article className={Style.metricCard}><span>Available seats</span><strong>{availableSeats}</strong></article>
          <article className={Style.metricCard}><span>Occupied seats</span><strong>{occupiedSeats}</strong></article>
          <article className={Style.metricCard}><span>Total seats</span><strong>{seats.length}</strong></article>
        </section>

        <section className={Style.layout}>
          <article className={Style.floorCard}>
            <div className={Style.sectionHeader}>
              <div>
                <h2>Frontend Room 1FRP</h2>
                <p>Markers only: green available, red occupied, yellow selected.</p>
              </div>
              <div className={Style.legend}>
                <span><i className={`${Style.legendDot} ${Style.availableDot}`} /> Available</span>
                <span><i className={`${Style.legendDot} ${Style.occupiedDot}`} /> Occupied</span>
                <span><i className={`${Style.legendDot} ${Style.selectedDot}`} /> Selected</span>
              </div>
            </div>

            <div className={Style.floorToolbar}>
              <label className={Style.toolbarField}>
                <span>Search</span>
                <input className={Style.toolbarInput} placeholder="Enter seat..." value={selectedSeat?.seatnumber ?? ''} readOnly />
              </label>
              <label className={Style.toolbarField}>
                <span>Floor</span>
                <select className={Style.toolbarSelect} value="2nd Floor" readOnly><option>2nd Floor</option></select>
              </label>
              <label className={Style.toolbarField}>
                <span>Map</span>
                <select className={Style.toolbarSelect} value="Frontend Room 1FRP" readOnly><option>Frontend Room 1FRP</option></select>
              </label>
              <button type="button" className={Style.toolbarButton}>Live View</button>
            </div>

            <div className={Style.floorPlan}>
              <div className={Style.mapCanvas}>
                <div className={Style.mapHeader}>
                  <strong>2nd Floor Plan</strong>
                  <span>{formattedDate}</span>
                </div>
                <div className={Style.mapInner}>
                  <div className={Style.mapSurface} aria-hidden="true" />
                  {mappedSeats.map((seat) => {
                    const isSelected = selectedSeat?.id === seat.id;
                    const seatClassName = [
                      Style.seatMarker,
                      seat.status === 'occupied' ? Style.occupied : Style.available,
                      isSelected ? Style.selected : '',
                    ].filter(Boolean).join(' ');
                    return (
                      <button
                        key={seat.id}
                        type="button"
                        className={seatClassName}
                        style={{ left: `${seat.position.left}%`, top: `${seat.position.top}%` }}
                        onClick={() => handleSeatClick(seat)}
                        disabled={seat.status === 'occupied'}
                        title={`Seat ${seat.seatnumber}`}
                      >
                        {seat.status === 'occupied' && seat.booked_avatar ? (
                          <img
                            className={Style.seatAvatar}
                            src={`http://localhost:8081/images/${seat.booked_avatar}`}
                            alt={seat.booked_username || `Seat ${seat.seatnumber}`}
                          />
                        ) : (
                          <div className={Style.seatTileInner}>{seat.seatnumber}</div>
                        )}
                        <span className={Style.seatLabel}>{seat.seatnumber}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </article>

          <aside className={Style.sidePanel}>
            <article className={Style.actionCard}>
              <div className={Style.sectionHeader}>
                <div>
                  <h3>Selected seat</h3>
                  <p>{selectedSeatStatus}</p>
                </div>
              </div>
              <div className={Style.selectionSummary}>
                <div><span>Seat</span><strong>{selectedSeat ? selectedSeat.seatnumber : '--'}</strong></div>
                <div><span>Date</span><strong>{formattedDate}</strong></div>
              </div>
              <div className={Style.actionStack}>
                <button type="button" className="primary-button" onClick={handleSubmitBooking} disabled={!selectedSeat}>
                  <i className="bi bi-calendar-check" />
                  Book selected seat
                </button>
                <button type="button" className="danger-button" onClick={handleDeleteSeat} disabled={!selectedSeat}>
                  <i className="bi bi-trash" />
                  Delete selected seat
                </button>
              </div>
            </article>
            <article className={Style.actionCard}>
              <div className={Style.sectionHeader}>
                <div>
                  <h3>Add a seat</h3>
                  <p>Add extra capacity to the current room map.</p>
                </div>
              </div>
              <div className={Style.addSeatForm}>
                <input type="text" className={Style.inlineInput} placeholder="Enter seat number" value={newSeatNumber} onChange={(event) => setNewSeatNumber(event.target.value)} />
                <button type="button" className="secondary-button" onClick={handleAddSeat}>
                  <i className="bi bi-plus-lg" />
                  Add seat
                </button>
              </div>
            </article>
          </aside>
        </section>
      </main>
    </div>
  );
}

export default Frontend;
