function GroupSummary({ netBalances, members, totalBalance, onNavigateBalances }) {
  return (
    <div className="user-summary-box">
      {totalBalance > 0 && <div className="summary-line green">You are owed ₹{totalBalance.toFixed(2)}</div>}
      {totalBalance < 0 && <div className="summary-line red">You owe ₹{(-totalBalance).toFixed(2)}</div>}
      {totalBalance === 0 && <div className="summary-line gray">You are settled up</div>}

      <div className="detailed-breakdown">
        {Object.entries(netBalances).map(([uid, balance]) => {
          const member = members.find(m => m._id === uid);
          if (!member || balance === 0) return null;

          return (
            <div key={uid} className="detail-line">
              {balance > 0
                ? `${member.name} owes you ₹${balance.toFixed(2)}`
                : `You owe ₹${(-balance).toFixed(2)} to ${member.name}`}
            </div>
          );
        })}
      </div>

      <div className="balances-button-container">
        <button className="balances-btn" onClick={onNavigateBalances}>
          View All Balances
        </button>
      </div>
    </div>
  );
}

export default GroupSummary;