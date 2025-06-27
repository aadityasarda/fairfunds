function GroupGrid({ groups, onClickGroup }) {
  return (
    <div className="group-grid">
      {groups.length === 0 ? (
        <p>No groups joined yet.</p>
      ) : (
        groups.map((group) => (
          <div key={group._id} className="group-card" onClick={() => onClickGroup(group._id)}>
            <h3>{group.name}</h3>
            <p>👥 {group.members?.length || 0} members</p>
          </div>
        ))
      )}
    </div>
  );
}

export default GroupGrid;