import { useState, useEffect } from 'react';
import { submitExpense } from '../services/expenseService';
import '../styles/AddExpenseForm.css';

function AddExpenseForm({ members, onClose, groupId, onExpenseAdded, editingData }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splitUsers, setSplitUsers] = useState([]);
  const [splitType, setSplitType] = useState('equal');
  const [unequalMode, setUnequalMode] = useState('amount');
  const [shares, setShares] = useState({});
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingData) {
      setDescription(editingData.description || '');
      setAmount(editingData.amount || '');
      setPaidBy(editingData.paidBy?._id || editingData.paidBy || '');
      setSplitUsers(editingData.splitBetween?.map(u => (typeof u === 'object' ? u._id : u)) || []);
      setSplitType(editingData.splitType || 'equal');
      setUnequalMode(editingData.unequalMode || 'amount');
      setShares({ ...editingData.shares });
    }
  }, [editingData]);

  useEffect(() => {
    let total = 0;
    Object.values(shares).forEach(val => {
      const num = parseFloat(val);
      if (!isNaN(num)) total += num;
    });

    if (unequalMode === 'amount') {
      setRemaining(Math.max(0, parseFloat(amount || 0) - total));
    } else {
      setRemaining(Math.max(0, 100 - total));
    }
  }, [shares, amount, unequalMode]);

  const handleCheckboxChange = (userId) => {
    setSplitUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleShareChange = (userId, value) => {
    if (isNaN(value)) return;
    setShares((prev) => ({ ...prev, [userId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !amount || !paidBy || splitUsers.length === 0) {
      alert('Please fill all fields and select split users.');
      return;
    }

    if (splitType === 'unequal') {
      const total = Object.values(shares).reduce((sum, val) => sum + parseFloat(val || 0), 0);
      if (
        (unequalMode === 'amount' && total !== parseFloat(amount)) ||
        (unequalMode === 'percentage' && total !== 100)
      ) {
        alert('Split values must add up correctly.');
        return;
      }
    }

    const payload = {
      groupId,
      description,
      amount,
      paidBy,
      splitBetween: splitUsers,
      splitType,
      shares: splitType === 'unequal' ? shares : {},
      unequalMode: splitType === 'unequal' ? unequalMode : '',
    };

    try {
      setLoading(true);
      const result = await submitExpense(payload, !!editingData, editingData?._id);
      setLoading(false);

      if (result.success) {
        alert(editingData ? 'Expense updated!' : 'Expense added!');
        onClose();
        onExpenseAdded();
      } else {
        alert(result.data?.message || 'Error submitting expense.');
      }
    } catch (err) {
      setLoading(false);
      alert('Server error.');
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <h3>{editingData ? 'Edit Expense' : 'Add New Expense'}</h3>
        <form className="modal-content" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <label>Paid By:</label>
          <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
            <option value="">Select</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>

          <label>Split Between:</label>
          <div className="split-checkbox-list">
            {members.map((m) => (
              <div key={m._id} className="split-checkbox-row">
                <label htmlFor={`check-${m._id}`}>{m.name}</label>
                <input
                  id={`check-${m._id}`}
                  type="checkbox"
                  checked={splitUsers.includes(m._id)}
                  onChange={() => handleCheckboxChange(m._id)}
                />
              </div>
            ))}
          </div>

          <label>Split Type:</label>
          <select value={splitType} onChange={(e) => setSplitType(e.target.value)}>
            <option value="equal">Equal</option>
            <option value="unequal">Unequal</option>
          </select>

          {splitType === 'equal' && splitUsers.length > 0 && (
            <div className="equal-result">
              ₹{(parseFloat(amount || 0) / splitUsers.length).toFixed(2)} per person
            </div>
          )}

          {splitType === 'unequal' && (
            <div className="split-panel">
              <h4>Customize Shares</h4>
              <div className="unequal-mode">
                <button
                  type="button"
                  className={unequalMode === 'amount' ? 'active' : ''}
                  onClick={() => setUnequalMode('amount')}
                >
                  Amount
                </button>
                <button
                  type="button"
                  className={unequalMode === 'percentage' ? 'active' : ''}
                  onClick={() => setUnequalMode('percentage')}
                >
                  Percentage
                </button>
              </div>

              {splitUsers.map((userId) => {
                const user = members.find((m) => m._id === userId) || { name: 'Unknown User' };
                return (
                  <div key={userId} className="split-row">
                    <span>{user.name}</span>
                    <input
                      type="number"
                      min="0"
                      placeholder={unequalMode === 'amount' ? '₹' : '%'}
                      value={shares[userId] || ''}
                      onChange={(e) => handleShareChange(userId, e.target.value)}
                    />
                  </div>
                );
              })}

              <div className="split-remaining">
                {unequalMode === 'amount'
                  ? `Remaining ₹${remaining.toFixed(2)}`
                  : `Remaining ${remaining.toFixed(2)}%`}
              </div>
            </div>
          )}

          <div className="modal-footer">
            <button type="button" className="btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {editingData ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpenseForm;
