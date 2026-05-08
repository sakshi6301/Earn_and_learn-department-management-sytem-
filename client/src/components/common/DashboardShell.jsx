import FlashMessage from "./FlashMessage";
import StatsGrid from "./StatsGrid";

function DashboardShell({
  activeSection,
  children,
  message,
  navItems = [],
  onLogout,
  onRefresh,
  onSectionChange,
  stats,
  subtitle,
  title,
  user
}) {
  return (
    <div className="page-shell">
      <div className="workspace-shell">
        <aside className="workspace-sidebar">
          <div className="sidebar-brand">
            <p className="eyebrow">Earn & Learn Portal</p>
            <h2>{title}</h2>
            <p className="sidebar-copy">{subtitle}</p>
          </div>

          <nav className="sidebar-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`sidebar-nav-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => onSectionChange(item.id)}
                type="button"
              >
                <strong>{item.label}</strong>
                {item.note ? <span>{item.note}</span> : null}
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="user-badge sidebar-user-badge">
              <strong>{user.name}</strong>
              <span>{user.role === "head" ? "Department Head" : capitalize(user.role)}</span>
            </div>
            <div className="sidebar-actions">
              <button className="ghost-button" onClick={onRefresh} type="button">
                Refresh
              </button>
              <button className="ghost-button" onClick={onLogout} type="button">
                Logout
              </button>
            </div>
          </div>
        </aside>

        <section className="app-screen workspace-main">
          {message && <FlashMessage message={message} />}
          <StatsGrid stats={stats} />
          {children}
        </section>
      </div>
    </div>
  );
}

export default DashboardShell;

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
