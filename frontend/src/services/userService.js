export const getUserInfo = async (token) => {
  try {
    const res = await fetch('http://localhost:5000/api/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (err) {
    console.error('Failed to fetch user info:', err);
    return null;
  }
};