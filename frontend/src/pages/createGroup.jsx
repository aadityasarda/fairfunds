import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CreateGroup.css';

function CreateGroup() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/groups/creategroup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate('/');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Server error');
    }
  };

  return (
    <div className="create-group-container">
      <div className="create-group-card">
        <h2>Create New Group</h2>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Group Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Create</button>
        </form>
        {message && <p className="create-message">{message}</p>}
      </div>
    </div>
  );
}

export default CreateGroup;
