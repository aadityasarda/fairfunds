import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import SettleModal from '../components/settle/SettleExpense';
import { fetchAllBalances} from '../services/balanceService';
import '../styles/balances.css';

function Balances() {
  const [balances, setBalances] = useState([]);
  const [members, setMembers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  let userId = null;
  try {
    const decoded = jwtDecode(token);
    userId = decoded._id || decoded.id || decoded.userId;
  } catch (err) {
    console.error("Failed to decode token", err);
  }

  const loadBalances = async () => {
    const result = await fetchAllBalances(token);
    setBalances(result.balances);
    setMembers(result.members);
  };

  useEffect(() => {
    loadBalances();
  }, []);

  const handleSettleClick = (user) => {
    const userBalance = balances.find(
      b => b.from === userId && b.to === user._id
    );
    const maxAmount = userBalance?.amount || 0;
    setSelectedUser({ ...user, maxAmount });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    loadBalances();
  };

  return (
    <div className="balances-page">
      <h2>Your Balances</h2>

      <div className="balances-list">
        {balances.length === 0 ? (
          <p>No outstanding balances 🎉</p>
        ) : (
          balances.map(({ from, to, amount }) => {
            const otherUserId = from === userId ? to : from;
            const person = members.find(m => m._id === otherUserId);
            if (!person) return null;

            const isYouOwe = from === userId;

            return (
              <div key={`${from}-${to}`} className={`balance-card ${isYouOwe ? 'owe' : 'owed'}`}>
                <span className="balance-text">
                  {isYouOwe ? (
                    <>
                      <strong>You</strong> owe <strong>₹{amount.toFixed(2)}</strong> to <strong>{person.name}</strong>
                    </>
                  ) : (
                    <>
                      <strong>{person.name}</strong> owes <strong>you</strong> <strong>₹{amount.toFixed(2)}</strong>
                    </>
                  )}
                </span>

                {isYouOwe ? (
                  <button className="settle-btn" onClick={() => handleSettleClick(person)}>Settle Up</button>
                ) : (
                  <button
                    className="remind-btn"
                  >
                  Remind
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {showModal && (
        <SettleModal
          toUser={selectedUser}
          onClose={handleCloseModal}
          onSettled={loadBalances}
        />
      )}

      <button className="back-btn" onClick={() => navigate(-1)}>← Back to Groups</button>
    </div>
  );
}

export default Balances;