import FlashMessage from "./FlashMessage";
import StatsGrid from "./StatsGrid";

function DashboardShell({ children, message, onLogout, onRefresh, stats, subtitle, title, user }) {
  return (
    <div className="page-shell">
      <section className="app-screen">
        <header className="app-header">
          <div>
            <p className="eyebrow">Earn & Learn Portal</p>
            <h1>{title}</h1>
            <p className="lead compact">{subtitle}</p>
          </div>

          <div className="header-actions">
            <div className="user-badge">
              <strong>{user.name}</strong>
              <span>{user.role === "head" ? "Department Head" : capitalize(user.role)}</span>
            </div>
            <button className="ghost-button" onClick={onRefresh} type="button">
              Refresh
            </button>
            <button className="ghost-button" onClick={onLogout} type="button">
              Logout
            </button>
          </div>
        </header>

        {message && <FlashMessage message={message} />}
        <StatsGrid stats={stats} />
        {children}
      </section>
    </div>
  );
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default DashboardShell;
