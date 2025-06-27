export const getUserTimeline = async (token, userId) => {
  try {
    const res = await fetch('http://localhost:5000/api/expense/user/activities', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const { expenses } = await res.json();
    let balance = 0;
    const timeline = [];

    expenses.forEach((exp) => {
      const paidBy = typeof exp.paidBy === 'object' ? exp.paidBy._id : exp.paidBy;
      const splitIds = exp.splitBetween.map((u) => (typeof u === 'object' ? u._id : u));

      let share = 0;
      if (exp.splitType === 'equal' && splitIds.includes(userId)) {
        share = exp.amount / splitIds.length;
      } else if (exp.splitType === 'unequal' && exp.shares?.[userId]) {
        share = parseFloat(exp.shares[userId]) || 0;
      }

      const delta = userId === paidBy ? exp.amount - share : -share;
      balance += delta;

      timeline.push({
        date: new Date(exp.createdAt).toLocaleDateString(),
        balance: parseFloat(balance.toFixed(2)),
      });
    });

    const positiveMsgs = [
      "🤑 You're rolling in IOUs! Time to collect!",
      "💸 Your wallet just got fatter! People owe you money.",
      "📈 Look at you go! You're in credit by",
      "🥳 Free money alert! Friends owe you",
      "🫰 Looks like you covered lunch — time to settle up!"
    ];
    const negativeMsgs = [
      "😬 Uh-oh... you owe your friends some ₹₹₹!",
      "😓 Gotta pay the bill someday, buddy!",
      "🙈 You’re in the red. Time to settle up!",
      "💀 Debts are haunting you...",
      "🧾 Swipe that card — you owe ₹"
    ];
    const neutralMsgs = [
      "🎉 You’re perfectly balanced. Nice job!",
      "🧘 All settled. Peace and harmony!",
      "🥂 Zero debt — cheers to that!",
      "🤝 Everyone’s square. We love that!"
    ];

    let msg = '';
    if (balance > 0) msg = positiveMsgs[Math.floor(Math.random() * positiveMsgs.length)];
    else if (balance < 0) msg = negativeMsgs[Math.floor(Math.random() * negativeMsgs.length)];
    else msg = neutralMsgs[Math.floor(Math.random() * neutralMsgs.length)];

    return { timeline, message: msg };
  } catch (err) {
    console.error('❌ Failed to fetch timeline data:', err);
    return { timeline: [], message: '' };
  }
};

export const submitExpense = async (data, isEdit = false, expenseId = null) => {
  const token = localStorage.getItem('token');
  const endpoint = isEdit
    ? `http://localhost:5000/api/expense/${expenseId}`
    : 'http://localhost:5000/api/expense/add';
  const method = isEdit ? 'PUT' : 'POST';

  const res = await fetch(endpoint, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  return { success: res.ok, data: result };
};
