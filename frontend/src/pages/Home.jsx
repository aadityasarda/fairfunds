import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../services/userService';
import { fetchGroups } from '../services/groupService';
import { getUserTimeline } from '../services/expenseService';
import { decodeToken } from '../utils/decodeToken';
import UserHeader from '../components/Home/UserHeader';
import GroupGrid from '../components/Home/GroupGrid';
import MyInvites from './MyInvites';
import '../styles/Home.css';

function Home() {
  const [avatarLetter, setAvatarLetter] = useState('U');
  const [userName, setUserName] = useState('');
  const [groups, setGroups] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const loadUserInfo = async () => {
    const data = await getUserInfo(token);
    if (data) {
      setUserName(data.name || data.email || 'You');
      setAvatarLetter((data.name || data.email || 'U')[0].toUpperCase());
    }
  };

  const loadGroups = async () => {
    try {
      const data = await fetchGroups();
      setGroups(data || []);
    } catch (err) {
      console.error('Error loading groups:', err);
    }
  };

  const loadTimeline = async () => {
    const { timeline, message } = await getUserTimeline(token, decodeToken(token));
    setTimelineData(timeline);
    setMessage(message);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    loadUserInfo();
    loadGroups();
    loadTimeline();
  }, []);

  const latestBalance = timelineData.length > 0 ? timelineData[timelineData.length - 1].balance : 0;

  return (
    <div className="home-container">
      <div className="home-header">
        <UserHeader
          name={userName}
          avatarLetter={avatarLetter}
          message={message}
          balance={latestBalance}
        />
        <div>
          <button onClick={() => navigate('/create-group')}>+ Create Group</button>
          <button onClick={() => navigate('/my-invites')}>Invites</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <GroupGrid groups={groups} onClickGroup={(id) => navigate(`/group/${id}`)} />

    </div>
  );
}

export default Home;