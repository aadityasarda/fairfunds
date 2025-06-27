export function decodeToken(token) {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.id || decoded._id || decoded.userId;
  } catch (err) {
    console.error("Failed to decode token:", err);
    return null;
  }
}