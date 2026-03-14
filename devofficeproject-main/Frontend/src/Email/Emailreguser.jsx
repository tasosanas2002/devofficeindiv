import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';

const USER_NAV_ITEMS = [
  { to: '/user', icon: 'bi-house-door', label: 'Overview' },
  { to: '/frontroomuser', icon: 'bi-grid', label: 'Book a Seat' },
  { to: '/chatuser', icon: 'bi-chat-dots', label: 'Meetings' },
  { to: '/emailuser', icon: 'bi-envelope', label: 'Email' },
];

function EmailUser() {
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
      brandSubtitle="User workspace"
      navItems={USER_NAV_ITEMS}
      activePath="/emailuser"
      heroEyebrow="Communication"
      heroTitle="Write and send messages from the same user workspace."
      heroSubtitle="The user email screen now matches the visual language of the dashboards and booking flow."
      heroActions={
        <div className="workspace-toolbar">
          <button type="button" className="secondary-button" onClick={() => navigate('/chatuser')}>
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
            <p>Compose direct messages in the same workspace shell.</p>
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
}

export default EmailUser;
