function ExpenseList({ groupedByMonth, userId, navigate, onEdit }) {
  return (
    <div className="expenses-list">
      {Object.entries(groupedByMonth).map(([month, monthExpenses]) => (
        <div key={month} className="month-section">
          <div className="month-header">{month}</div>
          {monthExpenses.map((expense) => {
            const paidById = typeof expense.paidBy === 'object' ? expense.paidBy._id : expense.paidBy;
            const paid = userId === paidById ? expense.amount : 0;

            let share = 0;
            const splitIds = expense.splitBetween.map(u => typeof u === 'object' ? u._id : u);

            if (expense.splitType === 'equal' && splitIds.includes(userId)) {
              share = expense.amount / splitIds.length;
            }

            if (expense.splitType === 'unequal' && expense.shares && expense.shares[userId]) {
              share = parseFloat(expense.shares[userId]) || 0;
            }

            const balance = paid - share;

            return (
              <div
                className="expense-card"
                key={expense._id}
                onClick={() => navigate(`/expense/${expense._id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="expense-left">
                  <div className="expense-desc">{expense.description}</div>
                  <div className="expense-meta">
                    Paid by <strong>{
                      (typeof expense.paidBy === 'object'
                        ? expense.paidBy._id === userId
                        : expense.paidBy === userId)
                        ? 'you'
                        : (typeof expense.paidBy === 'object'
                          ? expense.paidBy.name || expense.paidBy.email
                          : expense.paidBy)
                    }</strong> | ₹{expense.amount}
                  </div>
                </div>
                <div className="expense-actions">
                  <div className="expense-balance">
                    {balance > 0 && (
                      <div className="balance-line balance-lent">You lent ₹{balance.toFixed(2)}</div>
                    )}
                    {balance < 0 && (
                      <div className="balance-line balance-borrowed">You borrowed ₹{(-balance).toFixed(2)}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default ExpenseList;