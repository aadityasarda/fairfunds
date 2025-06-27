import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import InviteUser from '../components/InviteUser';
import AddExpenseForm from '../components/AddExpenseForm';
import { fetchGroupData, fetchGroupExpenses } from '../services/groupService';
import { calculateNetBalances, groupExpensesByMonth } from '../utils/groupCalculations';
import GroupSummary from '../components/GroupDetails/GroupSummary';
import ExpenseList from '../components/GroupDetails/ExpenseList';
import MyInvites from './MyInvites';
import '../styles/GroupDetails.css';

function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [showInvite, setShowInvite] = useState(false);

  const token = localStorage.getItem('token');
  let userId = null;
  try {
    const decoded = jwtDecode(token);
    userId = decoded._id || decoded.id || decoded.userId;
  } catch (err) {
    console.error("Failed to decode token:", err);
  }

  const loadGroupAndExpenses = async () => {
    try {
      const groupData = await fetchGroupData(groupId);
      const expData = await fetchGroupExpenses(groupId);
      setMembers(groupData.members || []);
      setExpenses(expData || []);
    } catch (err) {
      console.error('Error loading group details:', err);
    }
  };

  useEffect(() => {
    loadGroupAndExpenses();
  }, [groupId]);

  const openEditModal = (expense) => setEditingExpense(expense);
  const closeEditModal = () => setEditingExpense(null);

  const netBalances = calculateNetBalances(expenses, userId);
  const groupedByMonth = groupExpensesByMonth(expenses);

  const totalBalance = Object.values(netBalances).reduce((sum, val) => sum + val, 0);

  return (
    <div className="group-details-container">
      <GroupSummary
        netBalances={netBalances}
        members={members}
        totalBalance={totalBalance}
        onNavigateBalances={() => navigate('/balances')}
      />

      <div className="invite-section">
        <button onClick={() => setShowInvite(true)} className="invite-btn">
          Invite a Friend
        </button>

        {showInvite && (
          <div className="modal-overlay" onClick={() => setShowInvite(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowInvite(false)}>
                ✕
              </button>
              <InviteUser groupId={groupId} />
            </div>
          </div>
        )}
      </div>

      <div className="group-header">
        <h2>Group Expenses</h2>
        <div className="group-header-buttons">
          <button className="add-expense-btn" onClick={() => setShowForm(true)}>
            + Add Expense
          </button>
        </div>
      </div>

      {showForm && (
        <AddExpenseForm
          members={members}
          groupId={groupId}
          onClose={() => setShowForm(false)}
          onExpenseAdded={loadGroupAndExpenses}
        />
      )}

      {editingExpense && (
        <AddExpenseForm
          members={members}
          groupId={groupId}
          onClose={closeEditModal}
          onExpenseAdded={loadGroupAndExpenses}
          editingData={editingExpense}
        />
      )}

      <ExpenseList
        groupedByMonth={groupedByMonth}
        userId={userId}
        navigate={navigate}
        onEdit={openEditModal}
      />
    </div>
  );
}

export default GroupDetails;