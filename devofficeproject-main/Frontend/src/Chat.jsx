import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import AppShell from './components/AppShell';
import { APP_ID, SERVER_SECRET } from './constant';

const ADMIN_NAV_ITEMS = [
  { to: '/admin', icon: 'bi-house-door', label: 'Overview' },
  { to: '/signup', icon: 'bi-person-plus', label: 'Register User' },
  { to: '/databasevis', icon: 'bi-database', label: 'Database' },
  { to: '/frontroom', icon: 'bi-grid', label: 'Book a Seat' },
  { to: '/chat', icon: 'bi-chat-dots', label: 'Meetings' },
  { to: '/email', icon: 'bi-envelope', label: 'Email' },
];

const Chat = () => {
  const { id } = useParams();
  const roomID = id || 'devoffice-admin-room';
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const myMeeting = async () => {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID,
        SERVER_SECRET,
        roomID,
        Date.now().toString(),
        'devoffice-admin'
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: chatContainerRef.current,
        sharedLinks: [
          {
            name: 'Copy link',
            url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
      });
    };

    myMeeting();
  }, [roomID]);

  return (
    <AppShell
      brandSubtitle="Admin workspace"
      navItems={ADMIN_NAV_ITEMS}
      activePath="/chat"
      heroEyebrow="Meetings"
      heroTitle="Run calls inside the same product system."
      heroSubtitle="The video route now inherits the same shell, spacing, and hierarchy as the rest of the admin experience."
      heroActions={
        <div className="workspace-toolbar">
          <button type="button" className="secondary-button" onClick={() => navigate('/email')}>
            <i className="bi bi-envelope" />
            Open email
          </button>
        </div>
      }
    >
      <section className="workspace-card workspace-embed">
        <div className="workspace-card-header">
          <div>
            <h2>Meeting room</h2>
            <p>Live call experience embedded directly inside the application shell.</p>
          </div>
        </div>
        <div ref={chatContainerRef} />
      </section>
    </AppShell>
  );
};

export default Chat;
