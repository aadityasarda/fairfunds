export const calculateNetBalances = (expenses, userId) => {
  const netBalances = {};

  expenses.forEach(expense => {
    const paidById = typeof expense.paidBy === 'object' ? expense.paidBy._id : expense.paidBy;
    const splitIds = expense.splitBetween.map(u => typeof u === 'object' ? u._id : u);
    const amount = expense.amount;

    if (expense.splitType === 'equal') {
      const sharePerPerson = amount / splitIds.length;

      splitIds.forEach(uid => {
        if (uid === paidById) return;

        if (uid === userId) {
          netBalances[paidById] = (netBalances[paidById] || 0) - sharePerPerson;
        } else if (paidById === userId) {
          netBalances[uid] = (netBalances[uid] || 0) + sharePerPerson;
        }
      });
    }

    if (expense.splitType === 'unequal' && expense.shares) {
      Object.entries(expense.shares).forEach(([uid, share]) => {
        const shareAmount = parseFloat(share) || 0;

        if (uid === paidById) return;

        if (uid === userId) {
          netBalances[paidById] = (netBalances[paidById] || 0) - shareAmount;
        } else if (paidById === userId) {
          netBalances[uid] = (netBalances[uid] || 0) + shareAmount;
        }
      });
    }
  });

  return netBalances;
};

export const groupExpensesByMonth = (expenses) => {
  return expenses.reduce((acc, expense) => {
    const month = new Date(expense.date || expense.createdAt).toLocaleString('default', {
      month: 'long',
      year: 'numeric',
    });
    if (!acc[month]) acc[month] = [];
    acc[month].push(expense);
    return acc;
  }, {});
};