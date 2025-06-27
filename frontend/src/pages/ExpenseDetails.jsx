import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AddExpenseForm from '../components/AddExpenseForm';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';
import '../styles/ExpenseDetails.css';

function ExpenseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchExpense = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExpense(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch expense', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpense();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/expense/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Expense deleted!");
        navigate(`/group/${expense.groupId}`);
      } else {
        alert(data.message || "Failed to delete.");
      }
    } catch (err) {
      console.error("Error deleting expense:", err);
      alert("Server error.");
    }
  };

  const handleEdit = () => {
    setShowEditForm(true);
  };

  const renderAvatar = (name) => {
    const initial = name?.charAt(0)?.toUpperCase() || '?';
    return (
      <div className="avatar-circle">
        {initial}
      </div>
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!expense) return <p>Expense not found</p>;

  const fullMembers = [
    ...new Map(
      [...expense.splitBetween, expense.paidBy].map(user => [user._id || user, user])
    ).values()
  ];

  return (
    <div className="expense-detail-page">
      <div className="expense-detail-header">
        <button onClick={() => navigate(`/group/${expense.groupId}`)} className="icon-btn back-btn" title="Back">
          <FiArrowLeft size={20} />
        </button>

        <div className="icon-btn-group">
          {!showEditForm && (
            <button onClick={handleEdit} className="icon-btn" title="Edit">
              <FiEdit2 size={18} />
            </button>
          )}
          <button onClick={handleDelete} className="icon-btn red" title="Delete">
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      <h2>{expense.description}</h2>

      <div className="detail-section">
        <div className="detail-label">Amount</div>
        <div className="detail-value">₹{expense.amount}</div>
      </div>

      <div className="detail-section">
        <div className="detail-label">Paid by</div>
        <div className="detail-value">{expense.paidBy?.name || expense.paidBy}</div>
      </div>

      <div className="detail-section">
        <div className="detail-label">Split Type</div>
        <div className="detail-value">{expense.splitType}</div>
      </div>

      {expense.splitType === 'equal' && (
        <div className="detail-section">
          <div className="section-heading">Split Among</div>
          <ul>
            {expense.splitBetween.map(user => (
              <li key={user._id || user} className="user-item">
                {renderAvatar(user.name || user)}
                <span>{user.name || user}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {expense.splitType === 'unequal' && (
        <div className="detail-section">
          <div className="section-heading">Shares</div>
          <ul>
            {Object.entries(expense.shares).map(([uid, val]) => {
              const user = expense.splitBetween.find(u => u._id === uid || u === uid);
              return (
                <li key={uid} className="user-item">
                  {renderAvatar(user?.name || uid)}
                  <span>
                    {user?.name || uid}: {expense.unequalMode === 'amount' ? `₹${val}` : `${val}%`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {showEditForm && (
        <AddExpenseForm
          members={fullMembers}
          groupId={expense.groupId}
          onClose={() => setShowEditForm(false)}
          onExpenseAdded={() => navigate(`/group/${expense.groupId}`)}
          editingData={expense}
        />
      )}
    </div>
  );
}

export default ExpenseDetails;
