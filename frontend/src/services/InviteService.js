export const sendInvite = async (groupId, email) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch('http://localhost:5000/api/invites/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ groupId, email }),
    });

    const data = await res.json();
    return { success: res.ok, message: data.message || 'Unknown error' };
  } catch (err) {
    return { success: false, message: 'Server error' };
  }
};