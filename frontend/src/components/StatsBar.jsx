export default function StatsBar({ stats }) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <div className="stat-number">{stats.wishlist}</div>
        <div className="stat-label">Wish List</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.ordered}</div>
        <div className="stat-label">Ordered</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.pickup}</div>
        <div className="stat-label">⚠️ Pick Up</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{stats.delivered}</div>
        <div className="stat-label">Delivered</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">€{stats.spentThisMonth.toFixed(2)}</div>
        <div className="stat-label">Spent This Month</div>
      </div>
    </div>
  )
}
