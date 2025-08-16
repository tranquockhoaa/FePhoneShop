const StatCard = ({ label, value, icon, color }) => (
  <div
    className="stat-card admin-template-stat-card"
    style={{ "--stat-bg": color }}
  >
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

export default StatCard;
