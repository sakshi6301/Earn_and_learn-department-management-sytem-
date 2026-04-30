function InfoGrid({ items }) {
  return (
    <div className="profile-grid">
      {items.map(([label, value]) => (
        <div key={label}>
          <strong>{label}</strong>
          {value}
        </div>
      ))}
    </div>
  );
}

export default InfoGrid;
