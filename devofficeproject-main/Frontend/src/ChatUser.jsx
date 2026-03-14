import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import AppShell from './components/AppShell';
import { APP_ID, SERVER_SECRET } from './constant';

const USER_NAV_ITEMS = [
  { to: '/user', icon: 'bi-house-door', label: 'Overview' },
  { to: '/frontroomuser', icon: 'bi-grid', label: 'Book a Seat' },
  { to: '/chatuser', icon: 'bi-chat-dots', label: 'Meetings' },
  { to: '/emailuser', icon: 'bi-envelope', label: 'Email' },
];

const ChatUser = () => {
  const { id } = useParams();
  const roomID = id || 'devoffice-user-room';
  const chatContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const myMeeting = async () => {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID,
        SERVER_SECRET,
        roomID,
        Date.now().toString(),
        'devoffice-user'
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
      brandSubtitle="User workspace"
      navItems={USER_NAV_ITEMS}
      activePath="/chatuser"
      heroEyebrow="Meetings"
      heroTitle="Join calls without leaving the workspace shell."
      heroSubtitle="The meeting experience now looks like part of the same application, not a detached page."
      heroActions={
        <div className="workspace-toolbar">
          <button type="button" className="secondary-button" onClick={() => navigate('/emailuser')}>
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
            <p>Live meeting experience embedded directly inside the user workspace.</p>
          </div>
        </div>
        <div ref={chatContainerRef} />
      </section>
    </AppShell>
  );
};

export default ChatUser;
