export const submitSettlement = async (toUserId, amount) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/settle/up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ toUserId, amount }),
    });
    const data = await res.json();
    return { success: res.ok, message: data.message };
  } catch (err) {
    console.error('Settle error:', err);
    return { success: false, message: 'Server error' };
  }
};
