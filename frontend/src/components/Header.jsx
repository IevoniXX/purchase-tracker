const FILTERS = ['Both', 'Ieva', 'Cesar']

export default function Header({ personFilter, onPersonFilterChange }) {
  return (
    <header className="header">
      <div>
        <h1 className="header-title">📦 PurchaseTracker</h1>
        <div className="header-subtitle">Family purchase lifecycle — Ieva &amp; Cesar</div>
      </div>
      <div className="user-pills">
        {FILTERS.map(f => (
          <button
            key={f}
            className={`user-pill ${personFilter === f ? 'active' : ''}`}
            onClick={() => onPersonFilterChange(f)}
          >
            {f}
          </button>
        ))}
      </div>
    </header>
  )
}
