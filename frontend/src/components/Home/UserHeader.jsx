function UserHeader({ name, avatarLetter, message, balance }) {
  return (
    <div className="profile-header">
      <div className="avatar-circle">{avatarLetter}</div>
      <h2>Welcome, {name}</h2>
      <p>
        {message} {balance !== 0 && <strong>₹{Math.abs(balance).toFixed(2)}</strong>}
      </p>
    </div>
  );
}

export default UserHeader;