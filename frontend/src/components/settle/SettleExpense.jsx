import { useState, useEffect } from 'react';
import { submitSettlement } from '../../services/settleService';
import '../../styles/SettleExpense.css';

function SettleModal({ toUser, onClose, onSettled }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (toUser?.maxAmount) {
      setAmount(toUser.maxAmount.toFixed(2));
    }
  }, [toUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (numericAmount > toUser?.maxAmount) {
      setError(`You can only settle up to ₹${toUser.maxAmount}`);
      return;
    }

    setLoading(true);
    const result = await submitSettlement(toUser._id, numericAmount);
    setLoading(false);

    if (result.success) {
      if (onSettled) onSettled();
      onClose();
    } else {
      setError(result.message || 'Failed to settle up');
    }
  };

  return (
    <div className="settle-overlay" onClick={onClose}>
      <div className="settle-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Settle Up</h3>
        <p>You are settling with <strong>{toUser?.name}</strong></p>

        <form onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder={`Max: ₹${toUser?.maxAmount || 0}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <p className="hint">You currently owe ₹{toUser?.maxAmount.toFixed(2)}</p>

          {error && <p className="error-msg">{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" disabled={loading}>Settle</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettleModal;