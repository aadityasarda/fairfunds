import { useState } from 'react';
import { sendInvite } from '../services/InviteService';
import '../styles/InviteUser.css';

function InviteUser({ groupId }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setMessage('');

    const result = await sendInvite(groupId, email);
    if (result.success) {
      setMessage('' + result.message);
      setEmail('');
    } else {
      setMessage('❌ ' + result.message);
    }
  };

  return (
    <div className="invite-container">
      <h3>Invite a User</h3>
      <form className="invite-form" onSubmit={handleInvite}>
        <input
          type="email"
          placeholder="Enter email to invite"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Invite</button>
      </form>
      {message && <p className="invite-message">{message}</p>}
    </div>
  );
}

export default InviteUser;