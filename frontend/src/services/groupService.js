import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const fetchGroups = async () => {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${BASE_URL}/api/groups`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const fetchGroupData = async (groupId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/groups/${groupId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};

export const fetchGroupExpenses = async (groupId) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`http://localhost:5000/api/expense/group/${groupId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};