import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
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

const Email = () => {
  const form = useRef();
  const navigate = useNavigate();

  const sendEmail = (event) => {
    event.preventDefault();
    emailjs
      .sendForm('service_oxzjn1a', 'template_et005fs', form.current, {
        publicKey: 'eV42P4OM9_FkxarKS',
      })
      .then(
        () => console.log('SUCCESS!'),
        (error) => console.log('FAILED...', error.text)
      );

    event.target.reset();
  };

  return (
    <AppShell
      brandSubtitle="Admin workspace"
      navItems={ADMIN_NAV_ITEMS}
      activePath="/email"
      heroEyebrow="Communication"
      heroTitle="Send internal email from the same clean workspace."
      heroSubtitle="The email route now sits inside the shared app shell instead of dropping into an unrelated Bootstrap page."
      heroActions={
        <div className="workspace-toolbar">
          <button type="button" className="secondary-button" onClick={() => navigate('/chat')}>
            <i className="bi bi-camera-video" />
            Open meetings
          </button>
        </div>
      }
    >
      <section className="workspace-card">
        <div className="workspace-card-header">
          <div>
            <h2>Email portal</h2>
            <p>Compose and send updates without leaving the admin workspace.</p>
          </div>
        </div>

        <form ref={form} onSubmit={sendEmail} className="workspace-form">
          <div className="workspace-form-grid">
            <label className="field-group">
              <span className="field-label">Sender name</span>
              <input className="field-control" type="text" name="user_name" placeholder="Your name" />
            </label>
            <label className="field-group">
              <span className="field-label">Recipient email</span>
              <input className="field-control" type="email" name="user_email" placeholder="recipient@company.com" required />
            </label>
          </div>
          <label className="field-group">
            <span className="field-label">Subject</span>
            <input className="field-control" type="text" name="subject" placeholder="Email subject" />
          </label>
          <label className="field-group">
            <span className="field-label">Reply-to email</span>
            <input className="field-control" type="email" name="to_email" placeholder="your@company.com" required />
          </label>
          <label className="field-group">
            <span className="field-label">Message</span>
            <textarea className="field-control" name="message" rows="10" placeholder="Write your message..." />
          </label>
          <button type="submit" className="primary-button">Send email</button>
        </form>
      </section>
    </AppShell>
  );
};

export default Email;
