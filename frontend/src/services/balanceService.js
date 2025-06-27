export const fetchAllBalances = async (token) => {
  try {
    const res = await fetch('http://localhost:5000/api/expense/user/all', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    return {
      balances: data.balances || [],
      members: data.members || [],
    };
  } catch (err) {
    console.error('❌ Error fetching balances:', err);
    return { balances: [], members: [] };
  }
};

export const sendReminder = async (token, toUserId) => {
  try {
    const res = await fetch('http://localhost:5000/api/reminders/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        to: toUserId,
        message: 'Please settle up with me on FairFunds.',
      }),
    });

    const data = await res.json();
    if (res.ok) {
      console.log('Reminder sent:', data);
      return true;
    } else {
      console.error('Reminder failed:', data.message);
      return false;
    }
  } catch (err) {
    console.error('Error sending reminder:', err);
    return false;
  }
};