import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/MyInvites.css';

function MyInvites() {
  const [invites, setInvites] = useState([]);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchInvites = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/invites/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInvites(res.data);
    } catch (error) {
      console.error('❌ Error fetching invites:', error);
    }
  };

  const handleAccept = async (inviteId) => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/invites/accept',
        { inviteId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setMessage(res.data.message);
      fetchInvites();
    } catch (error) {
      setMessage('❌ Error accepting invite');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  return (
    <div className="invite-page">
      <h2>Pending Invites</h2>
      {message && <p className="invite-message">{message}</p>}

      {invites.length === 0 ? (
        <p>No pending invites.</p>
      ) : (
        <div className="invite-grid">
          {invites.map((invite) => (
            <div className="invite-card" key={invite._id}>
              <h3>{invite.groupId.name}</h3>
              <p>Invited by: {invite.createdBy.email}</p>
              <button onClick={() => handleAccept(invite._id)}>Accept</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyInvites;
